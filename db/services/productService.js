const pool = require('../pool.js');
const NotFound = require('../../common/errors/notFound.js');
const Product = require('../models/productModel.js');
const ProductView = require('../models/productView.js');
const Category = require('../models/categoryModel.js');
const Manufacture = require('../models/manufactureModel.js');
const Unit = require('../models/unitModel.js');
const {Sequelize} = require("sequelize");

class ProductService {
    async getAllProducts() {
        const products = await Product.findAll({
            attributes: [
                'id', 'name', [Sequelize.literal('category.name'), 'product_category'],
                [Sequelize.literal('manufacture.name'), 'product_manufacture'],
                [Sequelize.literal('unit.name'), 'product_unit'], 'price', 'img'
            ],
            include: [{
                model: Category,
                as: 'category',
                required: true,
                attributes: []
            },
                {
                    model: Manufacture,
                    as: 'manufacture',
                    required: true,
                    attributes: []
                },
                {
                    model: Unit,
                    as: 'unit',
                    required: true,
                    attributes: []
                }],
            order: ['id']
        });
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Products are not found');
    }

    async getProductDetails(id) {
        const products = await Product.findAll({
            attributes: [
                'id', 'name', [Sequelize.literal('category.name'), 'product_category'],
                [Sequelize.literal('manufacture.name'), 'product_manufacture'],
                [Sequelize.literal('unit.name'), 'product_unit'], 'price', 'img'
            ],
            include: [{
                model: Category,
                as: 'category',
                required: true,
                attributes: []
            },
                {
                    model: Manufacture,
                    as: 'manufacture',
                    required: true,
                    attributes: []
                },
                {
                    model: Unit,
                    as: 'unit',
                    required: true,
                    attributes: []
                }],
            where: {id: id}
        });
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Product is not found', [{id: id}]);
    }

    /////
    // async findByCategory(categories) {
    //     const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p
    //         JOIN categories ON p.category = categories.name WHERE categories.id IN (${categories});`);
    //     return rows.length > 0 ? this.getOk(rows) : this.getError();
    // }
    //////
    // async findByName(name) {
    //     const {rows} = await pool.query(`SELECT id, name, manufacture, category, units, price, img FROM products_full
    //         WHERE name ILIKE '${name}%';`);
    //     return rows;
    // }
    // async findByManufacture(manufacture) {
    //     const {rows} = await pool.query(`SELECT id, name, manufacture, category, units, price, img FROM products_full
    //         WHERE manufacture ILIKE '${manufacture}%';`);
    //     return rows;
    // }
    // async findByNameManufacture(name, manufacture) {
    //     const {rows} = await pool.query(`SELECT id, name, manufacture, category, units, price, img FROM products_full
    //         WHERE name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%';`);
    //     return rows.length > 0 ? this.getOk(rows) : this.getError();
    // }
    //////
    // async findByNameInCategory(name, categories) {
    //     const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p
    //     JOIN categories ON p.category = categories.name WHERE p.name ILIKE '${name}%' AND categories.id IN (${categories});`);
    //     return rows;
    // }
    // async findByManufactureInCategory(name, categories) {
    //     const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p
    //     JOIN categories ON p.category = categories.name WHERE manufacture ILIKE '${name}%' AND categories.id IN (${categories});`);
    //     return rows;
    // }
    // async findByNameManufactureInCategory(name, manufacture, categories) {
    //     const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p
    //     JOIN categories ON p.category = categories.name WHERE p.name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%' AND categories.id IN (${categories});
    //     `);
    //     return rows.length > 0 ? this.getOk(rows) : this.getError();
    // }

    async search(name, manufacture, categories) {
        let query = ``;
        const cat = categories.split(',');
        let products = [];
        if ((name || manufacture) & categories) {
            query = `SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p JOIN categories 
            ON p.category = categories.name WHERE p.name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%' AND categories.id IN (${categories});`;
        } else if (name || manufacture) {
            query = `SELECT id, name, manufacture, category, units, price, img FROM products_full 
                WHERE name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%';`;
        } else if (categories) {
            products = await Product.findAll({
                attributes: [
                    'id', 'name', [Sequelize.literal('category.name'), 'product_category'],
                    [Sequelize.literal('category.id'), 'product_category_id'],
                    [Sequelize.literal('manufacture.name'), 'product_manufacture'],
                    [Sequelize.literal('unit.name'), 'product_unit'], 'price', 'img'
                ],
                include: [{
                    model: Category,
                    as: 'category',
                    required: true,
                    attributes: []
                },
                    {
                        model: Manufacture,
                        as: 'manufacture',
                        required: true,
                        attributes: []
                    },
                    {
                        model: Unit,
                        as: 'unit',
                        required: true,
                        attributes: []
                    }],
                where: {
                    'product_category': cat
                }
            });
        }

        //const {rows} = await pool.query(query);
        //return rows.length > 0 ? this.getOk(rows) : this.getError();
        if (products.length > 0) return this.getSuccess(products);
        throw new NotFound('Products are not found');
    }

    getSuccess(data = []) {
        return {
            success: 'true',
            data: data
        }
    }

    getError(data = [], message = 'Products are not found') {
        return {
            status: 'error',
            data: data,
            message: message
        }
    }

    getOk(data) {
        return {
            status: 'ok',
            data: data,
            message: ''
        }
    }
}

module.exports = new ProductService();
