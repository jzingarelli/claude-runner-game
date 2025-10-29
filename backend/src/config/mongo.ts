import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * Connects to MongoDB using the provided connection string.
 */
export async function connectMongo(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== 'production',
    });
    logger.info('Connected to MongoDB');
    return conn;
  } catch (err) {
    logger.error(`Mongo connection error: ${(err as Error).message}`);
    throw err;
  }
}
