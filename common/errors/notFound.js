const BaseHttpError = require('./baseHttpError.js');

class NotFound extends BaseHttpError {
    constructor(message, data = []) {
        super(404, message);
        this.data = data;
    }
}

module.exports = NotFound;
