const pool = require('./pool.js');

class ProductModel {
    async getAllProducts() {
        const {rows} = await pool.query('SELECT id, name, manufacture, category, units, price, img FROM products_full;');
        return rows;
    }
    async findByCategory(categories) {
        const {rows} = await pool.query(`SELECT p.id, p.name, manufacture, category, units, price, img FROM products_full as p 
            JOIN categories ON p.category = categories.name WHERE categories.id IN (${categories});`);
        return rows;
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
        return rows;
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
        return rows;
    }
    async getProductDetails(id) {
        const {rows} = await pool.query(`SELECT * FROM products_full WHERE id = $1;`, [id]);
        return rows;
    }
}

module.exports = new ProductModel();