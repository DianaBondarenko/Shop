const express = require('express');
const productController = require('../controllers/productController.js');

const productRouter = express.Router();

productRouter.use('/search', productController.searchProducts);
productRouter.use('/:id', productController.getProductDetails);
productRouter.use('/', productController.getAllProducts);

module.exports = productRouter;