const NotFound = require('../../common/errors/notFound.js');
const Product = require('../models/productModel.js');
const Category = require('../models/categoryModel.js');
const Manufacture = require('../models/manufactureModel.js');
const Unit = require('../models/unitModel.js');
const {Sequelize, Op} = require("sequelize");

class ProductService {
    shortProductInfo = [ 'id', 'name', [Sequelize.literal('category.name'), 'product_category'],
        [Sequelize.literal('manufacture.name'), 'product_manufacture'],
        [Sequelize.literal('unit.name'), 'product_unit'], 'price', 'img']
    joinedTables = [{ model: Category, as: 'category', required: true, attributes: []},
        { model: Manufacture, as: 'manufacture',  required: true, attributes: []},
        { model: Unit, as: 'unit', required: true, attributes: []}]

    async getAllProducts() {
        const products = await Product.findAll({
            attributes: this.shortProductInfo,
            include: this.joinedTables,
            order: ['id']});
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Products are not found');
    }

    async getProductDetails(id) {
        const products = await Product.findAll({
            attributes: [...this.shortProductInfo, 'ingredients', 'amount'],
            include: this.joinedTables,
            where: {id: id}});
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Product is not found', [{id: id}]);
    }

    async search(name, manufacture, categories) {
        let whereCondition = {};
        const categoriesArr = categories? categories.split(',') : [];
        if ((name || manufacture) & categories) {
            whereCondition = {[Op.or]:[{'name': {[Op.iLike]: `${name}%`}},{'$manufacture.name$':{[Op.iLike]: `${manufacture}%`}}],
                '$category.id$': categoriesArr}
        } else if (name || manufacture) {
            whereCondition = {[Op.or]:[{'name': {[Op.iLike]: `${name}%`}},{'$manufacture.name$':{[Op.iLike]: `${manufacture}%`}}]}
        } else if (categories) {
            whereCondition = {'$category.id$': categoriesArr}
        }
        const products = await Product.findAll({
            attributes: this.shortProductInfo,
            include: this.joinedTables,
            where: whereCondition
        });
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Products are not found');
    }

    getSuccess(data = []) {
        return { success: 'true', data: data }
    }
}

module.exports = new ProductService();
