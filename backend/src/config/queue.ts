import Bull, { Queue } from 'bull';
import { getRedis } from './redis';

export type QueueName = 'email' | 'analytics' | 'exports';

const queues: Record<QueueName, Queue> = {
  email: new Bull('email', { createClient: () => getRedis() as unknown as any }),
  analytics: new Bull('analytics', { createClient: () => getRedis() as unknown as any }),
  exports: new Bull('exports', { createClient: () => getRedis() as unknown as any }),
};

export function getQueue(name: QueueName): Queue {
  return queues[name];
}
