const pool = require('./pool.js');

class OrderModel {
    async createUser(user) {
        const {name, phone,email} = user;
        try {
            const {rows} = await pool.query(`SELECT id FROM users WHERE phone = '${phone}';`);
            if (rows) return rows[0].id;
        } catch (e) {
            console.log('not found');
        }
        const {rows} = await pool.query(`INSERT INTO users (name,phone,email) VALUES ($1, $2, $3) RETURNING *;`,
            [name,phone,email]);
        console.log(rows[0].id);
        return rows[0].id;
    }
    async createOrder(products, userId) {
        // const {name, phone,email} = user;
        // let {rows} = await pool.query(`INSERT INTO users (name,phone,email) VALUES ($1, $2, $3) RETURNING *;`,
        //     [name,phone,email]);
        //const user_id = rows[0].id;
        try {
            const {rows} = await pool.query(`INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`,[userId]);
            const orderId = rows[0].id;
            await products.forEach(el => {
                pool.query(`INSERT INTO order_items (order_id, product_id, count) VALUES ($1, $2, $3);`,[orderId,el.id,el.count]);
            });
            const res = await pool.query(`SELECT SUM(price) FROM order_items JOIN products ON order_items.product_id = products.id 
            WHERE order_id = $1;`,[orderId]);
            const total = res.rows;
            console.log(total);
            const r = await pool.query(`UPDATE orders SET total_price = ( SELECT SUM(price) FROM order_items 
            JOIN products ON order_items.product_id = products.id WHERE order_id = $1)
            WHERE id = $1;`,[orderId])
        }
        catch (e) {}

        return 'oki';
    }
}

module.exports = new OrderModel();