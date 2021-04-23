const pg = require('pg');
const productsRepo = require('../repos/products_repo.js')

exports.getAllProducts =  async function(req, res) {
    const products = await productsRepo.getAllProducts();
    res.send(products)
    //res.send('All products');
}
exports.searchProducts = function (req, res) {
    res.send('Search products');
}
exports.detailedProductInfo = function (req, res) {
    res.send('Detailed information about product');
}