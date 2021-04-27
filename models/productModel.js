const pool = require('./pool.js');

class ProductModel {
    async getAllProducts() {
        const {rows} = await pool.query('SELECT id, name, manufacture, category FROM products_full;');
        //console.log(rows);
        return rows;
    }

    async findByCategory(categories) {
        categories = categories.split(',').map(el => `'${el}'`).join(',');
        console.log(categories);
        const {rows} = await pool.query(`SELECT id, name, manufacture, category FROM products_full WHERE category IN (${categories});`);
        //console.log(rows);
        return rows;
    }

    async getProductDetails(id) {
        const {rows} = await pool.query(`SELECT * FROM products_full WHERE id=$1;`, [id]);
        return rows;
    }
}

module.exports = new ProductModel();