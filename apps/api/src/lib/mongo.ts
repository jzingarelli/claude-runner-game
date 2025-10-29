import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from './logger';

export async function connectMongo(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(env.MONGO_URI, { autoIndex: true });
  logger.info({ msg: 'Mongo connected', host: conn.connection.host });
  return conn;
}
