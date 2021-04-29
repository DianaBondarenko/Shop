const productModel = require('../models/productModel.js');
const productView = require('../views/productView.js');

class ProductController {
    async getAllProducts(req, res) {
        const products = await productModel.getAllProducts();
        productView.send(res, products);
    }

    async searchProducts(req, res) {
        const {name, manufacture, categories} = req.query;
        const products = await productModel.search(name,manufacture,categories);
        /////
        // let products = {};
        // if ((name||manufacture)&categories) {
        //     products = await productModel.findByNameManufactureInCategory(name,manufacture,categories);
        // }
        // else if (name||manufacture) {
        //     products = await productModel.findByNameManufacture(name,manufacture);
        // }
        // else if (categories) {
        //     products = await productModel.findByCategory(categories);
        // }
        // switch (true) {
        //     case (name!=undefined||manufacture!=undefined&categories!=undefined)==true:
        //         console.log('getNameManCategories');
        //         products = await productModel.findByNameManufactureInCategory(name,manufacture,categories);
        //         break;
        //     case name!=undefined||manufacture!=undefined:
        //         console.log('getNameMan');
        //         products = await productModel.findByNameManufacture(name,manufacture);
        //         break;
        //     case categories!=undefined:
        //         console.log('getByCategories');
        //         products = await productModel.findByCategory(categories);
        //         break;
        // }
        productView.send(res, products);
    }
    async getProductDetails(req, res) {
        const {id} = req.params;
        const product = await productModel.getProductDetails(id);
        productView.send(res,product);
    }
}

module.exports = new ProductController();