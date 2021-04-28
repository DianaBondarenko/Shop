const pool = require('./pool.js');
const nodeMailer = require('./nodemailer.js');

class OrderModel {
    /////
    // async createOrder(products, userId) {
    //     const notFoundProducts = [];
    //     for (let i = 0; i < products.length; i++) {
    //         const {rows} = await pool.query('SELECT id FROM products WHERE id = $1 ;', [products[i].id]);
    //         if (rows.length === 0) notFoundProducts.push(products[i].id);
    //     }
    //     if (notFoundProducts.length > 0) return this.getError(notFoundProducts, 'Products are not found');
    //
    //     const {rows} = await pool.query(`INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`, [userId]);
    //     const orderId = rows[0].id;
    //     for (let i = 0; i < products.length; i++) {
    //         let el = products[i];
    //         const {rows} = await pool.query(`INSERT INTO order_items (order_id, product_id, count) VALUES ($1, $2, $3);`,
    //             [orderId, el.id, el.count]);
    //     }
    //     const order = await pool.query(`UPDATE orders SET total_price = ( SELECT SUM(price*count) FROM order_items
    //      JOIN products ON order_items.product_id = products.id WHERE order_id = $1) WHERE id = $1 RETURNING *;`, [orderId])
    //     //await nodeMailer.sendMail(user, products);
    //     return this.getOk();
    // }
    async addOrder(products, user) {
        try {
            const res = await this.createUser(user);
            if (res.status === 'error') return res;
            const userInfo = res.data[0];
            const availability = await this.checkAvailableProducts(products);
            if (availability.status === 'error') return availability;
            const {data} = await this.insertItems(products, userInfo.id);
            const orderInfo = data;
            await nodeMailer.sendMail(userInfo, orderInfo);
        } catch (er) {console.log('Some error in db:', er)}
        return this.getOk();
    }

    async createUser(user) {
        const {name, phone, email} = this.getValidUserInfo(user);
        if (!name || !phone) return this.getError([], 'User info is not valid');
        try {
            const {rows} = await pool.query(`SELECT * FROM users WHERE phone = '${phone}';`);
            if (rows.length > 0) return this.getOk(rows);
        } catch (e) {}
        const {rows} = await pool.query(`INSERT INTO users (name,phone,email) VALUES ($1, $2, $3) RETURNING *;`,
            [name, phone, email]);
        return this.getOk(rows);
    }

    async checkAvailableProducts(products) {
        const notFoundProducts = [];
        const notEnoughProducts = []
        for (let i = 0; i < products.length; i++) {
            const {rows} = await pool.query('SELECT id, amount FROM products WHERE id = $1;', [products[i].id]);
            if (rows.length <= 0) notFoundProducts.push(products[i].id)
            else if (rows[0].amount < products[i].count) notEnoughProducts.push(products[i]);
        }
        if (notFoundProducts.length > 0) return this.getError(notFoundProducts, 'Products are not found');
        if (notEnoughProducts.length > 0) return this.getError(notEnoughProducts, 'Not enough products');
        return this.getOk();
    }

    async insertItems(products, userId) {
        const orderInfo = await pool.query(`INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`, [userId]);
        const orderId = orderInfo.rows[0].id;
        const values = products.map(el => `(${orderId},${el.id}, ${el.count})`).join(',');
        await pool.query(`INSERT INTO order_items (order_id, product_id, count) VALUES ${values};`)
        await pool.query(`UPDATE orders SET total_price = ( SELECT SUM(price*count) FROM order_items 
        JOIN products ON order_items.product_id = products.id WHERE order_id = $1) WHERE id = $1;`, [orderId]);
        const {rows} = await pool.query(`SELECT *, count*price AS price_for_item FROM order_items 
        JOIN products ON order_items.product_id = products.id JOIN orders ON order_items.order_id = orders.id WHERE order_id = $1;`, [orderId]);
        return this.getOk(rows);
    }

    //////
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
    getValidUserInfo(user) {
        const {name, phone, email} = user;
        const res2 = {};
        if (name && name.match(/^[a-z]{2,60}$/i)) res2.name = name;
        if (phone && phone.match(/^[0-9]{10,12}$/)) res2.phone = phone;
        const regEmail = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.!#\$%&'\*\+-\/=`{\|}~\?\^]*[A-Za-z0-9]+@[a-z0-9-]{2,}\.[a-z]{2,4}$/
        if (email && email.length <= 60 && email.match(regEmail)) res2.email = email;
        return res2;
    }

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
    /////
    // checkUserInfo(name, phone, email) {
    //     let res = false;
    //     let res2 = {}
    //     if (name && name.match(/^[a-z]{2,60}$/i)) res = true;
    //     if (phone && phone.match(/^[0-9]{10,12}$/)) res = true;
    //     const regEmail = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.!#\$%&'\*\+-\/=`{\|}~\?\^]*[A-Za-z0-9]+@[a-z0-9-]{2,}\.[a-z]{2,4}$/
    //     if (email && email.length <= 60 && email.match(regEmail)) res = true;
    //     return res;
    // }
}

module.exports = new OrderModel();