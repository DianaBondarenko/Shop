class OrderView {
    okObj = {
       status: 'ok',
       data: [],
       message: ''
    }
    erObj = {
        status: 'error',
        data: [],
        message: ''
    }
    send(res, obj) {
        res.send(obj);
    }
}