const orderRepo = require('../repos/order_repo.js');

exports.createOrder = async function(req, res) {
    const {products, user} = req.body;
    const order = await orderRepo.createOrder(products,user);
    res.send(order);
    //console.log(products, user);
    //res.send('Create order');
}