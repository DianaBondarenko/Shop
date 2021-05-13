const express = require('express');
const orderController = require('../controllers/orderController.js');
const authMiddleWare = require('../common/middleware/authMiddleWare.js');
const authDTO = require('../common/DTOs/authDTO.js');
const orderDTO = require('../common/DTOs/orderDTO.js');
const validator = require('express-joi-validation').createValidator({});

const orderRouter = express.Router();

orderRouter.post('/', validator.headers(authDTO), authMiddleWare, validator.body(orderDTO), orderController.createOrder);

module.exports = orderRouter;
