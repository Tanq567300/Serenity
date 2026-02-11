const config = require('../config');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: config.env === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
