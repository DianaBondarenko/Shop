const productModel = require('../../db/services/productService');

const productMiddleWare = (req, res, next) => {
    const {name, manufacture, categories} = req.query;
}
