const express = require('express');
const productsController = require('../controllers/productsConroller.js');

const productsRouter = express.Router();
const productId = /\/\d+/;

productsRouter.use('/search', productsController.searchProducts);
productsRouter.use(productId, productsController.detailedProductInfo);
productsRouter.use('/', productsController.getAllProducts);

module.exports = productsRouter;