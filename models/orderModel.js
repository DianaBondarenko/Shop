const pool = require('./pool.js');

class OrderModel {
    async createOrder(products, user) {
        const {name, phone,email} = user;
        const {rows} = await pool.query(`INSERT INTO users (name,phone,email) VALUES ($1, $2, $3) RETURNING *;`,
            [name,phone,email]);
        const user_id = rows[0].id;
        return 'oki';
    }
}

module.exports = new OrderModel();