const nodeMailer = require('../nodemailer.js');
const Unauthorized = require('../../common/errors/unauthorized.js');
const NotFound = require('../../common/errors/notFound.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const Shop_order = require('../models/orderModel.js');
const OrderItem = require('../models/orderItemModel.js');
const {Sequelize} = require("sequelize");
const sequelize = require( '../../db/dbSequelize.js');

class OrderService {
    async addOrder(products, user) {
        try {
            if (user.isAuthenticated === 'false') return new Unauthorized('User is unauthorized');
            const availability = await this.checkAvailableProducts(products);
            if (availability.success === 'false') return availability;
            const {data} = await this.insertItems(products, user.id);
            await nodeMailer.sendMail(user, data);
        } catch (er) {throw er}
        return this.getSuccess();
    }

    async getUser(phone) {
        const users = await User.findAll({where: {phone: phone}});
        return users[0];
    }

    async checkAvailableProducts(products) {
        const notFoundProducts = [];
        const notEnoughProducts = []
        for (let i = 0; i < products.length; i++) {
            const prods = await Product.findAll({where: {id: products[i].id}});
            if (prods.length <= 0) notFoundProducts.push({id: products[i].id})
            else if (prods[0].amount < products[i].count) notEnoughProducts.push({id:prods[0].id,count:prods[0].amount});
        }
        if (notFoundProducts.length > 0) throw new NotFound('Products are not found',notFoundProducts);
        if (notEnoughProducts.length > 0) throw new NotFound('Not enough products',notEnoughProducts);
        return this.getSuccess();
    }

    async insertItems(products, userId) {
        let orderId=0;
        try {
            await sequelize.transaction(async (t) => {
                const orderInfo = await Shop_order.create({user_id: userId}, { transaction: t });
                orderId = orderInfo.id;
                const values = products.reduce((res,el) => [...res,{shop_order_id: orderId, product_id:el.id, count:el.count}],[]);
                await OrderItem.bulkCreate(values,{ transaction: t });
                await this.updateTotalPrice(orderId,t);
            })
        } catch (er) {throw er}
        const order = await this.getFullOrderInfo(orderId)
        return this.getSuccess(order);
    }

    async updateTotalPrice(orderId, transaction) {
        const total = await OrderItem.findOne({
            attributes: [[Sequelize.literal('SUM(order_item.count*product.price)') ,'total_price']],
            include: {model:Product,required: true, attributes: []},
            group: 'shop_order_id',
            where: {shop_order_id:orderId},
            transaction: transaction})
        const total_price = total.dataValues.total_price;
        await Shop_order.update(
            {total_price: total_price},
            {where: {id:orderId}, transaction: transaction})
    }

    async getFullOrderInfo(orderId, transaction) {
        const order = await OrderItem.findAll({
            attributes:{include:[[Sequelize.literal('order_item.count*product.price'),'price_for_item'],
                    [Sequelize.literal('product.price') ,'product_price'],[Sequelize.literal('product.name') ,'product_name'],
                    [Sequelize.literal('shop_order.total_price') ,'total_price'],
                    [Sequelize.literal('shop_order.created_at') ,'created_at']]},
            include: [
                { model: Product, as: 'product',required: true, attributes: []},
                { model: Shop_order, as: 'shop_order',required: true, attributes: []}],
            where: {'shop_order_id':orderId}, transaction:transaction})
        return order;
    }

    getSuccess(data = []) {
        return { success: 'true', data: data}
    }
}

module.exports = new OrderService();
