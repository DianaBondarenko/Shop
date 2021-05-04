const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ? err.statusCode : 500;
    res.status(err.statusCode).json({
        success: false,
        message: err.message || 'Server error'
    });
}
module.exports = errorHandler;