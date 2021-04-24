const pool = require('../pool.js');

class ProductsRepo {
    static async getAllProducts() {
        const {rows} = await pool.query('SELECT id, name, manufacture, category FROM products_full;');
        //console.log(rows);
        return rows;
    }
    static async findByCategory(categories) {
        categories = categories.split(',').map(el => `'${el}'`).join(',');
        const {rows} = await pool.query(`SELECT id, name, manufacture, category FROM products_full WHERE category IN (${categories});`);
        return rows;
    }
    static async getProductDetails(id) {
        ////security issue
        const {rows} = await pool.query(`SELECT * FROM products_full WHERE id=${id};`);
        return rows;
    }
}
module.exports = ProductsRepo;