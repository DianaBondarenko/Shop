class ProductView {
    send(response, result) {
        response.send(result);
    }
}

module.exports = new ProductView();