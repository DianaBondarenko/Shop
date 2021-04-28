const pool = require('./pool.js');

class ProductModel {
    async getAllProducts() {
        const {rows} = await pool.query('SELECT id, name, manufacture, category, units, price, img FROM products_full;');
        return rows.length > 0 ? this.getOk(rows) : this.getError();
    }

    ///// add params validation!
    async findByCategory(categories) {
        const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p 
            JOIN categories ON p.category = categories.name WHERE categories.id IN (${categories});`);
        return rows.length > 0 ? this.getOk(rows) : this.getError();
    }
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
    async findByNameManufacture(name,manufacture) {
        const {rows} = await pool.query(`SELECT id, name, manufacture, category, units, price, img FROM products_full 
            WHERE name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%';`);
        return rows.length > 0 ? this.getOk(rows) : this.getError();
    }
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
    async findByNameManufactureInCategory(name, manufacture, categories) {
        const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p
        JOIN categories ON p.category = categories.name WHERE p.name ILIKE '${name}%' OR manufacture ILIKE '${manufacture}%' AND categories.id IN (${categories});
        `);
        return rows.length > 0 ? this.getOk(rows) : this.getError();
    }
    async getProductDetails(id) {
        if (this.checkDetails(id)) {
            const {rows} = await pool.query(`SELECT * FROM products_full WHERE id = $1;`, [id]);
            return rows.length > 0 ? this.getOk(rows) : this.getError([{id: id}], 'Product is not found');
        } else {
            return this.getError([],'Invalid params');
        }
    }
    checkParams(params) {
        const {name, manufacture, categories } = params;
        const res = [];
        // if (name && typeof name === 'string' && name.match(/[a-z]{1,100}/)) res.push(name);
        // if (manufacture && typeof name === 'string' && manufacture.match(/[a-z]{1,100}/)) res.push(name);
        if (categories.split(',').every(el => !isNaN(Number(el)))) res.push(categories);
        return res;
    }
    checkDetails(id) {
        return Number.isInteger(Number(id)) ? true : false;
    }
    getError(data = [], message = 'Products are not found') {
       return  {
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