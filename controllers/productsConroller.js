const pg = require('pg');
exports.getAllProducts = function(req, res) {

    res.send('All products');
}
exports.searchProducts = function (req, res) {
    res.send('Search products');
}
exports.detailedProductInfo = function (req, res) {
    res.send('Detailed information about product');
}