const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const playerRoutes = require('./routes/playerRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');

/**
 * Initialize Express application
 */
const app = express();

/**
 * Security Middleware
 */
app.use(helmet()); // Set security headers

/**
 * CORS Configuration
 */
app.use(cors({
    origin: '*', // Configure based on your needs
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Request Logging
 */
if (config.isDevelopment) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

/**
 * Body Parser Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

/**
 * API Routes
 */
app.use('/api/players', playerRoutes);

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Clash Royale API Proxy',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            playerInfo: '/api/players/:playerTag',
            battlelog: '/api/players/:playerTag/battlelog'
        }
    });
});

/**
 * Error Handling Middleware
 */
app.use(notFoundHandler);
app.use(globalErrorHandler);

/**
 * Start Server
 */
function startServer() {
    const PORT = config.port;

    app.listen(PORT, () => {
        console.log('===========================================');
        console.log(`🚀 Server started successfully`);
        console.log(`📡 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Server running on port: ${PORT}`);
        console.log(`🌐 Local URL: http://localhost:${PORT}`);
        console.log(`✅ Health check: http://localhost:${PORT}/health`);
        console.log('===========================================');
    });
}

// Start the server
startServer();

module.exports = app;
