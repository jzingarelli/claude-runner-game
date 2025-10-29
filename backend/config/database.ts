/**
 * Database Configuration
 * MongoDB connection setup with retry logic and event handlers
 */

import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * Database connection options
 */
const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4, // Use IPv4
};

/**
 * Connect to MongoDB with retry logic
 * @param retries - Number of connection retry attempts
 */
export const connectDatabase = async (retries = 5): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social_analytics';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, options);
      logger.info('MongoDB connected successfully');
      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        logger.error('Max retries reached. Exiting...');
        process.exit(1);
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      logger.info(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Setup database event handlers
 */
export const setupDatabaseEvents = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

/**
 * Check database health
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const state = mongoose.connection.readyState;
    // 1 = connected, 2 = connecting
    return state === 1 || state === 2;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default {
  connectDatabase,
  disconnectDatabase,
  setupDatabaseEvents,
  checkDatabaseHealth,
};
