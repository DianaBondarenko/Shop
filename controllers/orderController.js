const orderModel = require('../models/orderModel.js');

class OrderController {
    async createOrder(req, res) {
        const {products, user} = req.body;
        const userId = await orderModel.createUser(user);
        const order = await orderModel.createOrder(products,userId);
        res.send(''+userId);
        //res.send(order);

        //console.log(products, user);
        //res.send('Create order');
    }
}

module.exports = new OrderController();