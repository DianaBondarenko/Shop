const pool = require('./pool.js');
const nodeMailer = require('./nodemailer.js');

class OrderModel {
    async createUser(user) {
        //const {name, phone, email} = user;
        const {name, phone, email} = this.getValidUserInfo(user);
        if (!name || !phone) return this.getError([],'User info is not valid');
        try {
            const {rows} = await pool.query(`SELECT id, name FROM users WHERE phone = '${phone}';`);
            if (rows) return this.getOk([{id: rows[0].id}]);
        } catch (e) {}
        const {rows} = await pool.query(`INSERT INTO users (name,phone,email) VALUES ($1, $2, $3) RETURNING *;`,
            [name, phone, email]);
        return this.getOk([{id: rows[0].id, name:rows[0].name}]);
    }

    async createOrder(products, userId, userName) {
        const notFoundProducts = [];
        for (let i = 0; i< products.length; i++) {
            const {rows} = await pool.query('SELECT id FROM products WHERE id = $1 ;',[products[i].id]);
            if (rows.length === 0) notFoundProducts.push(products[i].id);
        }
        if (notFoundProducts.length > 0) return this.getError(notFoundProducts, 'Products are not found');

        const {rows} = await pool.query(`INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`, [userId]);
        const orderId = rows[0].id;
        for (let i = 0; i< products.length; i++) {
            let el = products[i];
            const {rows} = await pool.query(`INSERT INTO order_items (order_id, product_id, count) VALUES ($1, $2, $3);`,
                [orderId, el.id, el.count]);
        }
        await pool.query(`UPDATE orders SET total_price = ( SELECT SUM(price) FROM order_items
         JOIN products ON order_items.product_id = products.id WHERE order_id = $1) WHERE id = $1;`, [orderId])
        await nodeMailer.sendMail('ghjk');
        return this.getOk();
    }

    sendMail(){

    }
    // async addOrder(products, user) {
    //     const res = await this.createUser(user);
    //     if (res.data.length === 0) return res;
    //     const userId = res.data[0].id;
    //
    // }

    // async checkProducts(products) {
    //     const availableProducts = [];
    //     for (let i = 0; i< products.length; i++) {
    //         const {rows} = await pool.query('SELECT id FROM products WHERE id = $1 ;',[products[i].id]);
    //         if (rows.length === 0) availableProducts.push(products[i].id);
    //     }
    //     return availableProducts;
    // }
    // f(products) {
    //     const availableProducts = this.checkProducts(products);
    //     if (products.length === availableProducts.length) {
    //
    //     } else {
    //         const notFound = products.filter(el => !availableProducts.includes(el.id));
    //         this.getError(notFound, 'Products are not found');
    //     }
    // }

    getError(data = [], message) {
        return {
            status: 'error',
            data: data,
            message: message
        }
    }

    getOk(data = []) {
        return {
            status: 'ok',
            data: data,
            message: ''
        }
    }

    // checkUserInfo(name, phone, email) {
    //     let res = false;
    //     let res2 = {}
    //     if (name && name.match(/^[a-z]{2,60}$/i)) res = true;
    //     if (phone && phone.match(/^[0-9]{10,12}$/)) res = true;
    //     const regEmail = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.!#\$%&'\*\+-\/=`{\|}~\?\^]*[A-Za-z0-9]+@[a-z0-9-]{2,}\.[a-z]{2,4}$/
    //     if (email && email.length <= 60 && email.match(regEmail)) res = true;
    //     return res;
    // }
    getValidUserInfo(user) {
        const {name, phone, email} = user;
        const res2 = {};
        if (name && name.match(/^[a-z]{2,60}$/i)) res2.name = name;
        if (phone && phone.match(/^[0-9]{10,12}$/)) res2.phone = phone;
        const regEmail = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.!#\$%&'\*\+-\/=`{\|}~\?\^]*[A-Za-z0-9]+@[a-z0-9-]{2,}\.[a-z]{2,4}$/
        if (email && email.length <= 60 && email.match(regEmail)) res2.email = email;
        return res2;
    }
}

module.exports = new OrderModel();