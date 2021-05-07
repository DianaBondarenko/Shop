const pool = require('./pool.js');
const NotFound = require('../common/errors/notFound.js');
const product = require('./productMod.js');

class ProductModel {
    async getAllProducts() {
        const products = await product.findAll();
        return this.getSuccess(products);
    }
    // async getAllProducts() {
    //     const {rows} = await pool.query('SELECT id, name, manufacture, category, units, price, img FROM products_full;');
    //     return rows.length > 0 ? this.getOk(rows) : this.getError();
    // }

    async getProductDetails(id) {
        const products = await product.findAll({where: {id: id}});
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
        if ((name || manufacture) & categories) {
            query = `SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p JOIN categories 
            ON p.category = categories.name WHERE p.name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%' AND categories.id IN (${categories});`;
        } else if (name || manufacture) {
            query = `SELECT id, name, manufacture, category, units, price, img FROM products_full 
                WHERE name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%';`;
        } else if (categories) {
            query = `SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p 
                JOIN categories ON p.category = categories.name WHERE categories.id IN (${categories});`;
        }
        const {rows} = await pool.query(query);
        return rows.length > 0 ? this.getOk(rows) : this.getError();
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

module.exports = new ProductModel();
