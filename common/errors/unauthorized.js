const BaseHttpError = require('./baseHttpError.js');

class Unauthorized extends BaseHttpError {
    constructor(message) {
        super(401, message);
    }
}

module.exports = Unauthorized;
