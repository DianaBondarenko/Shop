const productsRepo = require('../models/productModel.js');

class ProductController {
    async getAllProducts(req, res) {
        const products = await productsRepo.getAllProducts();
        res.send(products);
    }
    async getAllProducts(req, res) {
        const products = await productsRepo.getAllProducts();
        res.send(products);
    }
    ///??
    async searchProducts(req, res) {
        const {categories} = req.query;
        console.log(categories);
        const products = await productsRepo.findByCategory(categories);
        if (products) {
            res.send(products);
        } else {
            res.status(404);
        }
    }
    async getProductDetails(req, res) {
        const {id} = req.params;
        console.log(id);
        const product = await productsRepo.getProductDetails(id);
        if (product) {
            res.send(product);
        } else {
            res.status(404);
        }
        //res.send('Detailed information about product');
    }
}

module.exports = new ProductController();