import { getQueue } from '../config/queue';

export interface AnalyticsJobData {
  type: string;
  payload: Record<string, unknown>;
}

const analyticsQueue = getQueue('analytics');

analyticsQueue.process(async (job) => {
  // Process analytics calculations, aggregations, etc.
  // For demonstration, we just acknowledge the job
  return job.data;
});

export function enqueueAnalyticsJob(data: AnalyticsJobData) {
  return analyticsQueue.add('compute', data, { attempts: 2 });
}
