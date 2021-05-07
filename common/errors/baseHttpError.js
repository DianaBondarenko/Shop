class BaseHttpError {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = BaseHttpError;
