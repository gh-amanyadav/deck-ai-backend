const { formatErrorResponse, logError, ApiError } = require('../utils/errorHandler');

/**
 * 404 Not Found Handler
 * Catches all undefined routes
 */
function notFoundHandler(req, res, next) {
    const error = new ApiError(
        404,
        `Route not found: ${req.method} ${req.originalUrl}`
    );
    next(error);
}

/**
 * Global Error Handler
 * Handles all errors and sends appropriate response
 */
function globalErrorHandler(err, req, res, next) {
    // Log the error
    logError(err, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Format error response
    const errorResponse = formatErrorResponse(err);
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json(errorResponse);
}

module.exports = {
    notFoundHandler,
    globalErrorHandler
};
