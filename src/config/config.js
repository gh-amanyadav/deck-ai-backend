require('dotenv').config();

/**
 * Validate required environment variables
 */
function validateConfig() {
  const requiredEnvVars = ['CLASH_ROYALE_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

// Validate configuration on startup
validateConfig();

/**
 * Application configuration
 */
const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Clash Royale API configuration
  clashRoyale: {
    apiKey: process.env.CLASH_ROYALE_API_KEY,
    baseUrl: process.env.CLASH_ROYALE_BASE_URL || 'https://api.clashroyale.com/v1',
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '10000', 10),
  },

  // Security configuration
  jwtSecret: process.env.JWT_SECRET,

  // Feature flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
