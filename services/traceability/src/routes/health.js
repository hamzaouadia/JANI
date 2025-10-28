const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  const healthCheck = {
    service: 'JANI Traceability Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.mongodb = {
        status: 'connected',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      };
    } else {
      healthCheck.mongodb = {
        status: 'disconnected',
        readyState: mongoose.connection.readyState
      };
      healthCheck.status = 'degraded';
    }

    // Check if we can perform a simple database operation
    const dbCheck = await mongoose.connection.db.admin().ping();
    healthCheck.mongodb.ping = dbCheck.ok === 1 ? 'success' : 'failed';

    res.status(healthCheck.status === 'healthy' ? 200 : 503).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.mongodb = {
      status: 'error',
      error: error.message
    };
    
    res.status(503).json(healthCheck);
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  const TraceabilityEvent = require('../models/TraceabilityEvent');
  
  const healthCheck = {
    service: 'JANI Traceability Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  };

  try {
    // MongoDB connection check
    if (mongoose.connection.readyState === 1) {
      healthCheck.checks.mongodb = {
        status: 'healthy',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      };
      
      // Database ping
      const dbCheck = await mongoose.connection.db.admin().ping();
      healthCheck.checks.mongodb.ping = dbCheck.ok === 1 ? 'success' : 'failed';
    } else {
      healthCheck.checks.mongodb = {
        status: 'unhealthy',
        readyState: mongoose.connection.readyState
      };
      healthCheck.status = 'degraded';
    }

    // Database operations check
    try {
      const eventCount = await TraceabilityEvent.countDocuments();
      healthCheck.checks.database_operations = {
        status: 'healthy',
        eventCount,
        message: 'Database operations working correctly'
      };
    } catch (dbError) {
      healthCheck.checks.database_operations = {
        status: 'unhealthy',
        error: dbError.message
      };
      healthCheck.status = 'degraded';
    }

    // Memory usage check
    const memoryUsage = process.memoryUsage();
    const memoryThreshold = 1024 * 1024 * 1024; // 1GB
    healthCheck.checks.memory = {
      status: memoryUsage.heapUsed < memoryThreshold ? 'healthy' : 'warning',
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
    };

    // Environment variables check
    const requiredEnvVars = ['MONGO_URI'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    healthCheck.checks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'warning',
      missingVariables: missingEnvVars,
      nodeVersion: process.version
    };

    res.status(healthCheck.status === 'healthy' ? 200 : 503).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.error = error.message;
    
    res.status(503).json(healthCheck);
  }
});

// Readiness check (for Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    // Check if the service is ready to handle requests
    if (mongoose.connection.readyState === 1) {
      // Test a simple database operation
      await mongoose.connection.db.admin().ping();
      
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        reason: 'database not connected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      reason: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (for Kubernetes/Docker)
router.get('/live', (req, res) => {
  // Simple liveness check - if we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;