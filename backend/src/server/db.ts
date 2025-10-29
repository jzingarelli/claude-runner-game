import mongoose from 'mongoose';
import { logger } from './logger';

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/esm_analytics';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info('Mongo connected');
}
