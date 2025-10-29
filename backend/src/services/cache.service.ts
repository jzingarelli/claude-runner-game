import type Redis from 'ioredis';
import { getRedis } from '../config/redis';

export class CacheService {
  private client: Redis;

  constructor() {
    this.client = getRedis();
  }

  async get<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidateByPrefix(prefix: string): Promise<void> {
    const stream = this.client.scanStream({ match: `${prefix}*`, count: 100 });
    const keys: string[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (resultKeys: string[]) => {
        for (const key of resultKeys) keys.push(key);
      });
      stream.on('end', async () => {
        if (keys.length) await this.client.del(keys);
        resolve();
      });
      stream.on('error', reject);
    });
  }
}
