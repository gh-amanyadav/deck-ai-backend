/**
 * Custom error classes and error handling utilities
 */

/**
 * Base API Error class
 */
class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends ApiError {
    constructor(message = 'Bad Request', details = null) {
        super(400, message, details);
    }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends ApiError {
    constructor(message = 'Access Denied', details = null) {
        super(403, message, details);
    }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends ApiError {
    constructor(message = 'Resource Not Found', details = null) {
        super(404, message, details);
    }
}

/**
 * Too Many Requests Error (429)
 */
class RateLimitError extends ApiError {
    constructor(message = 'Too Many Requests', details = null) {
        super(429, message, details);
    }
}

/**
 * Internal Server Error (500)
 */
class InternalServerError extends ApiError {
    constructor(message = 'Internal Server Error', details = null) {
        super(500, message, details);
    }
}

/**
 * Service Unavailable Error (503)
 */
class ServiceUnavailableError extends ApiError {
    constructor(message = 'Service Temporarily Unavailable', details = null) {
        super(503, message, details);
    }
}

/**
 * Map Clash Royale API error to custom error class
 * @param {object} error - Axios error object
 * @returns {ApiError} Mapped error instance
 */
function mapClashRoyaleError(error) {
    if (!error.response) {
        // Network error or timeout
        return new ServiceUnavailableError(
            'Unable to reach Clash Royale API',
            { originalError: error.message }
        );
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || data?.reason || 'An error occurred';
    const errorDetails = {
        reason: data?.reason,
        type: data?.type,
        detail: data?.detail
    };

    switch (status) {
        case 400:
            return new BadRequestError(errorMessage, errorDetails);
        case 403:
            return new ForbiddenError(errorMessage, errorDetails);
        case 404:
            return new NotFoundError(errorMessage, errorDetails);
        case 429:
            return new RateLimitError(errorMessage, errorDetails);
        case 503:
            return new ServiceUnavailableError(errorMessage, errorDetails);
        case 500:
        default:
            return new InternalServerError(errorMessage, errorDetails);
    }
}

/**
 * Format error response for API
 * @param {Error} error - Error object
 * @returns {object} Formatted error response
 */
function formatErrorResponse(error) {
    if (error instanceof ApiError) {
        return {
            success: false,
            error: {
                message: error.message,
                statusCode: error.statusCode,
                ...(error.details && { details: error.details })
            }
        };
    }

    // Unknown error
    return {
        success: false,
        error: {
            message: 'An unexpected error occurred',
            statusCode: 500
        }
    };
}

/**
 * Log error with appropriate level
 * @param {Error} error - Error to log
 * @param {object} context - Additional context
 */
function logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        name: error.name,
        message: error.message,
        ...(error instanceof ApiError && { statusCode: error.statusCode }),
        ...(error.stack && { stack: error.stack }),
        ...context
    };

    if (error instanceof ApiError && error.statusCode < 500) {
        // Client errors - less verbose
        console.warn('[Client Error]', JSON.stringify(errorInfo, null, 2));
    } else {
        // Server errors - full details
        console.error('[Server Error]', JSON.stringify(errorInfo, null, 2));
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    RateLimitError,
    InternalServerError,
    ServiceUnavailableError,
    mapClashRoyaleError,
    formatErrorResponse,
    logError
};
