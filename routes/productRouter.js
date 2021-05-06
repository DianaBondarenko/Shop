const express = require('express');
const productController = require('../controllers/productController.js');

const productRouter = express.Router();

productRouter.get('/search', productController.searchProducts);
productRouter.get('/:id', productController.getProductDetails);
productRouter.get('/', productController.getAllProducts);

module.exports = productRouter;
