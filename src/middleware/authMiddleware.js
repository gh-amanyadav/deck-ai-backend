const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { ApiError } = require('../utils/errorHandler');

/**
 * JWT Authentication Middleware
 * Verifies the JWT token in the Authorization header
 */
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access denied. No token provided.');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Access denied. Invalid token format.');
        }

        if (!config.jwtSecret) {
            console.error('JWT_SECRET is not defined in configuration');
            throw new ApiError(500, 'Internal server error. Authentication configuration missing.');
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Attach user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new ApiError(401, 'Invalid token.'));
        } else if (error.name === 'TokenExpiredError') {
            next(new ApiError(401, 'Token expired.'));
        } else {
            next(error);
        }
    }
};

module.exports = authMiddleware;
