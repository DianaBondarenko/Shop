const orderModel = require('../models/orderModel.js');
const orderView = require('../views/orderView.js');

class OrderController {
    async createOrder(req, res) {
        const {products, user} = req.body;
        const {data} = await orderModel.createUser(user);
        const userId = data[0].id;
        const order = await orderModel.createOrder(products,userId);
        orderView.send(res, order);
        //orderView.send(res, '' + userId);
    }
}

module.exports = new OrderController();