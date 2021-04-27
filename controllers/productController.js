const productModel = require('../models/productModel.js');

class ProductController {
    async getAllProducts(req, res) {
        const products = await productModel.getAllProducts();
        res.send(products);
    }
    async getAllProducts(req, res) {
        const products = await productModel.getAllProducts();
        res.send(products);
    }
    ///??
    async searchProducts(req, res) {
        const {name, categories, manufacture} = req.query;
        //const products = await productsRepo.findByCategory(categories);
        //const products = await productModel.findByName(name);
        //const products = await productModel.findByManufacture(manufacture);
        //const products = await productModel.findByNameInCategory(name,categories);
        //const products = await productModel.findByManufactureInCategory(manufacture,categories);
        //const products = await productModel.findByNameManufacture(name,manufacture);
        const products = await productModel.findByNameManufactureInCategory(name,manufacture,categories);
        if (products) {
            res.send(products);
        } else {
            res.status(404);
        }
    }
    async getProductDetails(req, res) {
        const {id} = req.params;
        console.log(id);
        const product = await productModel.getProductDetails(id);
        if (product) {
            res.send(product);
        } else {
            res.status(404);
        }
        //res.send('Detailed information about product');
    }
}

module.exports = new ProductController();