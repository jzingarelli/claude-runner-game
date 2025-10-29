import express from 'express';
import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { AnalyticsEventModel } from '../../models/AnalyticsEvent';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';

const createSchema = z.object({
  userId: z.string().length(24).optional(),
  postId: z.string().length(24).optional(),
  type: z.string().min(1),
  platform: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  occurredAt: z.string().datetime(),
});

const updateSchema = z.object({
  metadata: z.record(z.any()).optional(),
});

export const analyticsRouter = express.Router();

// CRUD for events
analyticsRouter.use('/events', buildCrudRouter({
  model: AnalyticsEventModel,
  resourceName: 'analytics event',
  createSchema,
  updateSchema,
}));

// Aggregation example endpoint
analyticsRouter.get('/summary', authenticate, requireRoles('analyst', 'manager', 'admin', 'owner'), validate(z.object({ from: z.string().datetime(), to: z.string().datetime(), platform: z.string().optional() }), 'query'), async (req, res) => {
  const { from, to, platform } = req.query as any;
  const match: any = { occurredAt: { $gte: new Date(from), $lte: new Date(to) } };
  if (platform) match.platform = platform;
  const pipeline = [
    { $match: match },
    { $group: { _id: { type: '$type' }, count: { $sum: 1 } } },
    { $project: { _id: 0, type: '$_id.type', count: 1 } },
  ];
  const data = await AnalyticsEventModel.aggregate(pipeline);
  res.json({ range: { from, to }, data });
});
