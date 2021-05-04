const pool = require('./pool.js');
const nodeMailer = require('./nodemailer.js');
const Unauthorized = require('../common/errors/unauthorized.js');
const NotFound = require('../common/errors/notFound.js');

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
    // async addOrder(products, user) {
    //     try {
    //         const res = await this.createUser(user);
    //         if (res.status === 'error') return res;
    //         const userInfo = res.data[0];
    //         const valid = this.validateProducts(products)
    //         if(valid.status === 'error') return valid;
    //         const availability = await this.checkAvailableProducts(products);
    //         if (availability.status === 'error') return availability;
    //         const {data} = await this.insertItems(products, userInfo.id);
    //         const orderInfo = data;
    //         await nodeMailer.sendMail(userInfo, orderInfo);
    //     } catch (er) {
    //         return this.getError([],er.message) ;
    //         console.log('Some error in db:', er)
    //     }
    //     return this.getOk();
    // }
    async addOrder(products, user) {
        try {
            if (user.isAuthenticated === 'false') return new Unauthorized('User is unauthorized');
            const availability = await this.checkAvailableProducts(products);
            if (availability.success === 'false') return availability;
            const {data} = await this.insertItems(products, user.id);
            await nodeMailer.sendMail(user, data);
        } catch (er) {return er}
        return this.getSuccess();
    }

    async getUser(phone) {
        const {rows} = await pool.query(`SELECT * FROM users WHERE phone= '${phone}';`)
        return rows[0];
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
            if (rows.length <= 0) notFoundProducts.push({id: products[i].id})
            else if (rows[0].amount < products[i].count) notEnoughProducts.push(products[i]);
        }
        if (notFoundProducts.length > 0) return new NotFound('Products are not found');
        if (notEnoughProducts.length > 0) return new NotFound('Not enough products');
        return this.getSuccess();
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
        return this.getSuccess(rows);
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

    // getValidUserInfo(user) {
    //     const res = {};
    //     if (!user||! user instanceof Object) return res;
    //     const {name, phone, email} = user;
    //     if (name && name.match(/^[a-z]{2,60}$/i)) res.name = name;
    //     if (phone && phone.match(/^[0-9]{10,12}$/)) res.phone = phone;
    //     const regEmail = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.!#\$%&'\*\+-\/=`{\|}~\?\^]*[A-Za-z0-9]+@[a-z0-9-]{2,}\.[a-z]{2,4}$/
    //     if (email && email.length <= 60 && email.match(regEmail)) res.email = email;
    //     return res;
    // }
    // validateProducts(products) {
    //     const res = this.getError([], 'Not valid products info');
    //     if (!products||! Array.isArray(products)) return res;
    //     if (products.find(el => !el instanceof Object || !el.id  || isNaN(Number(el.id))|| !el.count ||isNaN(Number(el.count)))) {
    //         return res;
    //     }
    //     return this.getOk();
    // }

    getError(data = [], message) {
        return {
            status: 'error',
            data: data,
            message: message
        }
    }
    // getOk(data = []) {
    //     return {
    //         status: 'ok',
    //         data: data,
    //         message: ''
    //     }
    // }
    getSuccess(data = []) {
        return {
            success: 'true',
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