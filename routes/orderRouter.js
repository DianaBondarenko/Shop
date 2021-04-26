const express = require('express');
const orderController = require('../controllers/orderConroller.js');

const orderRouter = express.Router();

orderRouter.post('/', orderController.createOrder);

module.exports = orderRouter;