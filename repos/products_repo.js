const pool = require('../pool.js');

class ProductsRepo {
    static async getAllProducts() {
        const {rows} = await pool.query('SELECT * FROM products');
        console.log(rows);
        return rows;
    }
    findByCategory() {

    }
}
module.exports = ProductsRepo;