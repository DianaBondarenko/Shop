const express = require('express');
const productController = require('../controllers/productController.js');
const searchDTO = require('../common/DTOs/searchDTO.js');
const detailsDTO = require('../common/DTOs/detailsDTO.js');
const validator = require('express-joi-validation').createValidator({});

const productRouter = express.Router();

productRouter.get('/search', validator.query(searchDTO), productController.searchProducts);
productRouter.get('/:id', validator.params(detailsDTO), productController.getProductDetails);
productRouter.get('/', productController.getAllProducts);

module.exports = productRouter;
