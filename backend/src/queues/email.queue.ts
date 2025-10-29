import { getQueue } from '../config/queue';
import { EmailService } from '../services/email.service';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
}

const emailQueue = getQueue('email');

emailQueue.process(async (job) => {
  const svc = new EmailService();
  await svc.send(job.data as EmailJobData);
});

export function enqueueEmail(data: EmailJobData) {
  return emailQueue.add('sendEmail', data, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
}
