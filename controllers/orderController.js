const orderModel = require('../models/orderModel.js');
const orderView = require('../views/orderView.js');
const nodeMailer = require('../models/nodemailer.js')

class OrderController {
    async createOrder(req, res) {
        const {products, user} = req.body;
        const result = await orderModel.createUser(user);
        if (result.data.length === 0) orderView.send(res, result);
        else {
            const userId = result.data[0].id;
            const order = await orderModel.createOrder(products, userId);
            orderView.send(res, order);
        }

        // const order = await orderModel.addOrder(products, user);
        // orderView.send(res, order);

        //orderView.send(res, '' + userId);
    }
}

module.exports = new OrderController();