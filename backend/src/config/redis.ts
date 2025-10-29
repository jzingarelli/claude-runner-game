import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let redisClient: Redis | null = null;

/**
 * Initializes and returns a singleton Redis client.
 */
export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: env.REDIS_HOST,
      port: Number(env.REDIS_PORT),
      password: env.REDIS_PASSWORD,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
    redisClient.on('error', (err) => logger.error(`Redis error: ${(err as Error).message}`));
    redisClient.on('connect', () => logger.info('Connected to Redis'));
  }
  return redisClient;
}
