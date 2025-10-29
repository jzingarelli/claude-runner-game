/**
 * Main Server File
 * Initializes Express app with all middleware and routes
 */

import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDatabase, setupDatabaseEvents } from './config/database';
import { getRedisClient } from './config/redis';
import websocketService from './services/websocketService';
import queueService from './services/queueService';
import routes from './routes';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger, { logRequest, logResponse } from './utils/logger';

// Load environment variables
dotenv.config();

/**
 * Initialize Express application
 */
const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

/**
 * Middleware setup
 */

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  logRequest(req.method, req.url, (req as any).user?.id);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logResponse(req.method, req.url, res.statusCode, duration);
  });

  next();
});

// Rate limiting (apply to API routes)
app.use(`/api/${API_VERSION}`, apiLimiter);

/**
 * API Routes
 */
app.use(`/api/${API_VERSION}`, routes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Analytics Platform API',
    version: API_VERSION,
    documentation: `/api/${API_VERSION}/docs`,
    health: `/api/${API_VERSION}/health`,
  });
});

/**
 * Error handlers (must be last)
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Initialize services and start server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();
    setupDatabaseEvents();

    // Initialize Redis
    const redisClient = getRedisClient();
    logger.info('Redis client initialized');

    // Initialize WebSocket server
    websocketService.initialize(server);

    // Initialize queue service (already initialized on import)
    logger.info('Queue service ready');

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`API available at http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Close HTTP server
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Close WebSocket connections
  websocketService.close();

  // Close queue connections
  await queueService.closeAll();

  // Exit process
  setTimeout(() => {
    logger.info('Graceful shutdown completed');
    process.exit(0);
  }, 5000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

export { app, server };
