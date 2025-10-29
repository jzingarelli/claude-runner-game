/**
 * Logger Utility
 * Comprehensive logging with Winston
 */

import winston from 'winston';
import path from 'path';

/**
 * Custom log format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

/**
 * Create logger instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH || 'logs/app.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: process.env.LOG_ERROR_FILE_PATH || 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
  ],
  exitOnError: false,
});

/**
 * Log HTTP request
 */
export const logRequest = (method: string, url: string, userId?: string): void => {
  logger.info('HTTP Request', {
    method,
    url,
    userId,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log HTTP response
 */
export const logResponse = (
  method: string,
  url: string,
  statusCode: number,
  duration: number
): void => {
  logger.info('HTTP Response', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log error with context
 */
export const logError = (error: Error, context?: Record<string, unknown>): void => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log database query
 */
export const logQuery = (model: string, operation: string, duration: number): void => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('Database Query', {
      model,
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log cache operation
 */
export const logCache = (operation: string, key: string, hit: boolean): void => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('Cache Operation', {
      operation,
      key,
      hit,
      timestamp: new Date().toISOString(),
    });
  }
};

export default logger;
