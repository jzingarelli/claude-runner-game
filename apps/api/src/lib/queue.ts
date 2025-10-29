import Queue from 'bull';
import { env } from '../config/env';

export const emailQueue = new Queue('email', env.REDIS_URL);
export const analyticsQueue = new Queue('analytics', env.REDIS_URL);
export const exportQueue = new Queue('export', env.REDIS_URL);

// Example processors could be added here or in dedicated files
// emailQueue.process(async (job) => { /* send email */ });
