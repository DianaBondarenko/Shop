const BaseHttpError = require('./baseHttpError.js');

class Forbidden extends BaseHttpError {
    constructor(message) {
        super(403, message);
    }
}

module.exports = Forbidden;
