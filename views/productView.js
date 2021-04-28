class ProductView {
    send(response, result) {
        response.json(result);
    }
}

module.exports = new ProductView();