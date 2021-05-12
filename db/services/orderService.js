const pool = require('../pool.js');
const nodeMailer = require('../nodemailer.js');
const Unauthorized = require('../../common/errors/unauthorized.js');
const NotFound = require('../../common/errors/notFound.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const Order = require('../models/orderModel.js');
const OrderItem = require('../models/orderItemModel.js');
const {Sequelize} = require("sequelize");

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
    async getUsers() {
        const users = await User.findAll();
        return users;
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
        const orderInfo = await Order.create({user_id: userId});
        const orderId = orderInfo.id;
        const values = products.reduce((res,el) => [...res,{order_id: orderId, product_id:el.id, count:el.count}],[]);
        await OrderItem.bulkCreate(values);
        const total = await OrderItem.findOne({
                attributes: [[Sequelize.literal('SUM(order_item.count*product.price)') ,'total_price']],
                include: {model:Product,required: true, attributes: []},
                group: 'order_id',
                where: {order_id:orderId}
            }
        )
        const total_price = total.dataValues.total_price;
        console.log(total_price);
        await Order.update(
            {total_price: total_price},
            {where: {id:orderId}})
        const order = await OrderItem.findAll(
            {
                attributes:{include:[[Sequelize.literal('order_item.count*product.price'),'price_for_item'],
                        [Sequelize.literal('product.price') ,'product_price'],[Sequelize.literal('product.name') ,'product_name'],
                        [Sequelize.literal('order.total_price') ,'total_price']]},
                include: [
                    { model: Product, as: 'product',required: true, attributes: []},
                    { model: Order, as: 'order',required: true, attributes: []}
                ],
                where: {'order_id':orderId}
            }
        )
        console.log(order);
        const {rows} = await pool.query(`SELECT *, count*price AS price_for_item FROM order_items 
        JOIN products ON order_items.product_id = products.id JOIN orders ON order_items.order_id = orders.id WHERE order_id = $1;`, [orderId]);
        return this.getSuccess(rows);
    }

    getSuccess(data = []) {
        return {
            success: 'true',
            data: data
        }
    }
}

module.exports = new OrderService();
