const express = require('express');
const productsController = require('../controllers/productsConroller.js');

const productsRouter = express.Router();
const productId = /\/\d+/;

productsRouter.use('/search', productsController.searchProducts);
productsRouter.use('/:id', productsController.getProductDetails);
productsRouter.use('/', productsController.getAllProducts);

module.exports = productsRouter;