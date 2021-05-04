const BaseHttpError = require('./baseHttpError.js');

class NotFound extends BaseHttpError {
    constructor(message) {
        super(404, message);
    }
}

module.exports = NotFound;