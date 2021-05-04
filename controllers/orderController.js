const orderModel = require('../models/orderModel.js');
const orderView = require('../views/orderView.js');

class OrderController {
    async createOrder(req, res) {
        const {products} = req.body;
        const order = await orderModel.addOrder(products, res.locals.user);
        orderView.send(res, order);
    }
}

module.exports = new OrderController();