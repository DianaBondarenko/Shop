const pg = require('pg');
const productsRepo = require('../repos/products_repo.js');

exports.getAllProducts =  async function(req, res) {
    const products = await productsRepo.getAllProducts();
    res.send(products);
    //res.send('All products');
}

////////////////???????????/
exports.searchProducts = async function (req, res) {
    const {categories} = req.query;
    console.log(categories);
    const products = await productsRepo.findByCategory(categories);
    if (products) {
        res.send(products);
    } else {
        res.status(404);
    }
    //res.send('Search products');
}
exports.getProductDetails = async function (req, res) {
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