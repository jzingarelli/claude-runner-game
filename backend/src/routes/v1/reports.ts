import { z } from 'zod';
import express from 'express';
import { buildCrudRouter } from '../../utils/crudRouter';
import { ReportModel } from '../../models/Report';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';

const createSchema = z.object({
  name: z.string().min(1),
  ownerId: z.string().length(24),
  teamId: z.string().length(24).optional(),
  filters: z.record(z.any()).default({}),
  schedule: z.object({ cron: z.string(), timezone: z.string().optional() }).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  filters: z.record(z.any()).optional(),
  schedule: z.object({ cron: z.string(), timezone: z.string().optional() }).optional(),
  status: z.enum(['draft', 'scheduled', 'running', 'completed', 'failed']).optional(),
  outputUrl: z.string().url().optional(),
});

export const reportsRouter = express.Router();

reportsRouter.use('/', buildCrudRouter({
  model: ReportModel,
  resourceName: 'report',
  createSchema,
  updateSchema,
}));

reportsRouter.post('/:id/run', authenticate, requireRoles('manager', 'admin', 'owner'), validate(z.object({ id: z.string().length(24) }), 'params'), async (req, res) => {
  const report = await ReportModel.findByIdAndUpdate(req.params.id, { $set: { status: 'running' } }, { new: true });
  if (!report) return res.status(404).json({ message: 'Report not found' });
  // In a real system we'd enqueue a job; here we mark as completed
  await ReportModel.updateOne({ _id: report._id }, { $set: { status: 'completed' } });
  res.json({ message: 'Report executed', reportId: report._id });
});
