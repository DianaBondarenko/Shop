class OrderView {
    send(response, result) {
        response.send(result);
    }
}

module.exports = new OrderView();