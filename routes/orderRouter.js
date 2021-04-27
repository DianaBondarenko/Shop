const express = require('express');
const orderController = require('../controllers/orderController.js');

const orderRouter = express.Router();

orderRouter.use('/', orderController.createOrder);

module.exports = orderRouter;