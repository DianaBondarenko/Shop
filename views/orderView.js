class OrderView {
    send(response, result) {
        response.json(result);
    }
}

module.exports = new OrderView();