import { getQueue } from '../config/queue';

export interface ExportJobData {
  reportId: string;
  format: 'csv' | 'xlsx' | 'pdf';
}

const exportsQueue = getQueue('exports');

exportsQueue.process(async (job) => {
  // Generate export files and upload to S3 in a real implementation
  return { ok: true, ...job.data };
});

export function enqueueExport(data: ExportJobData) {
  return exportsQueue.add('export', data, { attempts: 2 });
}
