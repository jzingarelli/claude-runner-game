import { Queue } from 'bull';
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const emailQueue = new Queue('email', process.env.REDIS_URL || 'redis://localhost:6379');
export const analyticsQueue = new Queue('analytics', process.env.REDIS_URL || 'redis://localhost:6379');
export const exportQueue = new Queue('export', process.env.REDIS_URL || 'redis://localhost:6379');

export function initQueues(): void {
  // Placeholders for processors registration (can be extended next phases)
  emailQueue.process(async () => { /* send email */ });
  analyticsQueue.process(async () => { /* compute analytics */ });
  exportQueue.process(async () => { /* generate export */ });
}
