import express from 'express';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

export const v2AnalyticsRouter = express.Router();

// Example of a v2-only endpoint with enhanced summary
v2AnalyticsRouter.get('/insights', authenticate, requireRoles('analyst', 'manager', 'admin', 'owner'), async (_req, res) => {
  res.json({ message: 'Enhanced analytics insights (v2)' });
});
