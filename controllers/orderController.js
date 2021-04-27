const orderRepo = require('../models/orderModel.js');

class OrderController {
    async createOrder(req, res) {
        const {products, user} = req.body;
        const order = await orderRepo.createOrder(products,user);
        res.send(order);
        //console.log(products, user);
        //res.send('Create order');
    }
}

module.exports = new OrderController();