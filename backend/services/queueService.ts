/**
 * Queue Service
 * Background job processing with Bull
 */

import Bull, { Queue, Job } from 'bull';
import { JobData } from '../types';
import logger from '../utils/logger';
import emailService from './emailService';

/**
 * Queue configuration
 */
const queueConfig = {
  redis: {
    host: process.env.BULL_REDIS_HOST || 'localhost',
    port: parseInt(process.env.BULL_REDIS_PORT || '6379'),
    db: parseInt(process.env.BULL_REDIS_DB || '1'),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};

/**
 * Queue Service class
 */
class QueueService {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
    this.initializeQueues();
  }

  /**
   * Initialize all queues
   */
  private initializeQueues(): void {
    // Email queue
    this.createQueue('email');

    // Analytics processing queue
    this.createQueue('analytics');

    // Report generation queue
    this.createQueue('reports');

    // Data export queue
    this.createQueue('exports');

    // Webhook delivery queue
    this.createQueue('webhooks');

    // Notification queue
    this.createQueue('notifications');

    logger.info('All queues initialized');
  }

  /**
   * Create a queue
   * @param name - Queue name
   * @returns Queue instance
   */
  private createQueue(name: string): Queue {
    const queue = new Bull(name, {
      redis: queueConfig.redis,
      defaultJobOptions: queueConfig.defaultJobOptions,
    });

    // Setup processors based on queue type
    this.setupProcessors(queue, name);

    // Setup event handlers
    this.setupEventHandlers(queue, name);

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * Setup queue processors
   */
  private setupProcessors(queue: Queue, name: string): void {
    switch (name) {
      case 'email':
        queue.process(async (job: Job) => {
          return this.processEmailJob(job);
        });
        break;

      case 'analytics':
        queue.process(async (job: Job) => {
          return this.processAnalyticsJob(job);
        });
        break;

      case 'reports':
        queue.process(async (job: Job) => {
          return this.processReportJob(job);
        });
        break;

      case 'exports':
        queue.process(async (job: Job) => {
          return this.processExportJob(job);
        });
        break;

      case 'webhooks':
        queue.process(async (job: Job) => {
          return this.processWebhookJob(job);
        });
        break;

      case 'notifications':
        queue.process(async (job: Job) => {
          return this.processNotificationJob(job);
        });
        break;
    }
  }

  /**
   * Setup event handlers for queue
   */
  private setupEventHandlers(queue: Queue, name: string): void {
    queue.on('completed', (job: Job) => {
      logger.info(`Job completed in ${name} queue:`, {
        jobId: job.id,
        type: job.data.type,
      });
    });

    queue.on('failed', (job: Job, err: Error) => {
      logger.error(`Job failed in ${name} queue:`, {
        jobId: job.id,
        type: job.data.type,
        error: err.message,
      });
    });

    queue.on('stalled', (job: Job) => {
      logger.warn(`Job stalled in ${name} queue:`, {
        jobId: job.id,
        type: job.data.type,
      });
    });

    queue.on('error', (error: Error) => {
      logger.error(`Queue error in ${name}:`, error);
    });
  }

  /**
   * Process email job
   */
  private async processEmailJob(job: Job): Promise<void> {
    const { type, to, data } = job.data;

    logger.info(`Processing email job: ${type}`);

    switch (type) {
      case 'welcome':
        await emailService.sendWelcomeEmail(to, data.name);
        break;

      case 'verification':
        await emailService.sendVerificationEmail(to, data.token);
        break;

      case 'password_reset':
        await emailService.sendPasswordResetEmail(to, data.token);
        break;

      case '2fa_code':
        await emailService.send2FACode(to, data.code);
        break;

      case 'report_ready':
        await emailService.sendReportReadyEmail(to, data.reportName, data.downloadUrl);
        break;

      case 'team_invitation':
        await emailService.sendTeamInvitation(to, data.teamName, data.inviterName, data.inviteUrl);
        break;

      case 'subscription_confirmation':
        await emailService.sendSubscriptionConfirmation(to, data.tier, data.amount);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  }

  /**
   * Process analytics job
   */
  private async processAnalyticsJob(job: Job): Promise<void> {
    logger.info('Processing analytics job:', job.data);
    // Implementation would aggregate and process analytics data
  }

  /**
   * Process report generation job
   */
  private async processReportJob(job: Job): Promise<void> {
    logger.info('Processing report job:', job.data);
    // Implementation would generate report and upload to S3
  }

  /**
   * Process data export job
   */
  private async processExportJob(job: Job): Promise<void> {
    logger.info('Processing export job:', job.data);
    // Implementation would export user data and upload to S3
  }

  /**
   * Process webhook delivery job
   */
  private async processWebhookJob(job: Job): Promise<void> {
    logger.info('Processing webhook job:', job.data);
    // Implementation would deliver webhook payload
  }

  /**
   * Process notification job
   */
  private async processNotificationJob(job: Job): Promise<void> {
    logger.info('Processing notification job:', job.data);
    // Implementation would create and send notification
  }

  /**
   * Add job to queue
   * @param queueName - Queue name
   * @param data - Job data
   * @param options - Job options
   * @returns Job instance
   */
  async addJob(
    queueName: string,
    data: JobData,
    options?: Bull.JobOptions
  ): Promise<Job> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const job = await queue.add(data, options);
    logger.info(`Job added to ${queueName} queue:`, {
      jobId: job.id,
      type: data.type,
    });

    return job;
  }

  /**
   * Get queue
   * @param name - Queue name
   * @returns Queue instance
   */
  getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  /**
   * Get job counts for a queue
   * @param queueName - Queue name
   * @returns Job counts
   */
  async getJobCounts(queueName: string): Promise<Bull.JobCounts> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return queue.getJobCounts();
  }

  /**
   * Clean completed jobs
   * @param queueName - Queue name
   * @param grace - Grace period in milliseconds
   */
  async cleanQueue(queueName: string, grace: number = 86400000): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
    logger.info(`Queue ${queueName} cleaned`);
  }

  /**
   * Pause queue
   * @param queueName - Queue name
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
    logger.info(`Queue ${queueName} paused`);
  }

  /**
   * Resume queue
   * @param queueName - Queue name
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
    logger.info(`Queue ${queueName} resumed`);
  }

  /**
   * Close all queues
   */
  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map((queue) => queue.close());
    await Promise.all(closePromises);
    logger.info('All queues closed');
  }
}

export default new QueueService();
