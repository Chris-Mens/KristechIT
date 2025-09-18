const express = require('express');
const router = express.Router();
const { checkHealth } = require('../config/database');

// Health check endpoint
router.get('/', async (req, res) => {
    try {
        const dbHealth = await checkHealth();
        
        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            services: {
                database: dbHealth,
                api: {
                    status: 'healthy',
                    message: 'API is running normally'
                }
            }
        };

        // If database is unhealthy, set overall status to degraded
        if (dbHealth.status === 'unhealthy') {
            healthStatus.status = 'degraded';
        }

        const statusCode = healthStatus.status === 'ok' ? 200 : 503;
        res.status(statusCode).json(healthStatus);
        
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            message: 'Health check failed',
            error: process.env.NODE_ENV !== 'production' ? error.message : 'Internal error'
        });
    }
});

// Detailed system info (development only)
router.get('/system', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'System information not available in production'
        });
    }

    res.json({
        node: {
            version: process.version,
            platform: process.platform,
            arch: process.arch,
            uptime: process.uptime(),
            memory: process.memoryUsage()
        },
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
