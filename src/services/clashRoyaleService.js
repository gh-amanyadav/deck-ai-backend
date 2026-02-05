const axios = require('axios');
const config = require('../config/config');
const { mapClashRoyaleError, logError } = require('../utils/errorHandler');

/**
 * Create axios instance configured for Clash Royale API
 */
const clashRoyaleClient = axios.create({
    baseURL: config.clashRoyale.baseUrl,
    timeout: config.clashRoyale.timeout,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor - Add API key to all requests
 */
clashRoyaleClient.interceptors.request.use(
    (requestConfig) => {
        // Add authorization header
        requestConfig.headers.Authorization = `Bearer ${config.clashRoyale.apiKey}`;

        // Log request in development
        if (config.isDevelopment) {
            console.log(`[API Request] ${requestConfig.method.toUpperCase()} ${requestConfig.url}`);
        }

        return requestConfig;
    },
    (error) => {
        logError(error, { context: 'Request Interceptor' });
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors consistently
 */
clashRoyaleClient.interceptors.response.use(
    (response) => {
        // Log successful response in development
        if (config.isDevelopment) {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Map API error to custom error class
        const mappedError = mapClashRoyaleError(error);

        // Log the error
        logError(mappedError, {
            context: 'Clash Royale API',
            url: error.config?.url,
            method: error.config?.method
        });

        return Promise.reject(mappedError);
    }
);

/**
 * Clash Royale API Service
 */
class ClashRoyaleService {
    /**
     * Get player information by player tag
     * @param {string} encodedPlayerTag - URL-encoded player tag
     * @returns {Promise<object>} Player data
     */
    async getPlayerInfo(encodedPlayerTag) {
        try {
            const response = await clashRoyaleClient.get(`/players/${encodedPlayerTag}`);
            return response.data;
        } catch (error) {
            // Error is already mapped and logged by interceptor
            throw error;
        }
    }

    /**
     * Get player battle log
     * @param {string} encodedPlayerTag - URL-encoded player tag
     * @returns {Promise<object>} Battle log data
     */
    async getPlayerBattlelog(encodedPlayerTag) {
        try {
            const response = await clashRoyaleClient.get(`/players/${encodedPlayerTag}/battlelog`);
            return response.data;
        } catch (error) {
            // Error is already mapped and logged by interceptor
            throw error;
        }
    }

    /**
     * Health check - Verify API is accessible
     * @returns {Promise<boolean>} API health status
     */
    async healthCheck() {
        try {
            // Make a simple request to verify API is reachable
            // Using a known endpoint with minimal data
            await clashRoyaleClient.get('/');
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new ClashRoyaleService();
