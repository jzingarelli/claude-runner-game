import express from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { PlanModel } from '../../models/Plan';
import { SubscriptionModel } from '../../models/Subscription';
import { InvoiceModel } from '../../models/Invoice';

export const billingRouter = express.Router();

// Plans CRUD (admin only)
billingRouter.get('/plans', authenticate, requireRoles('admin', 'owner'), async (_req, res) => {
  const plans = await PlanModel.find().lean();
  res.json(plans);
});

billingRouter.post('/plans', authenticate, requireRoles('admin', 'owner'), validate(z.object({
  key: z.enum(['basic', 'pro', 'enterprise']),
  name: z.string(),
  priceMonthlyCents: z.number().int().positive(),
  limits: z.object({ users: z.number().int().positive(), postsPerMonth: z.number().int().positive(), storageGb: z.number().int().positive() })
})), async (req, res) => {
  const plan = await PlanModel.create(req.body);
  res.status(201).json(plan);
});

// Subscriptions
billingRouter.get('/subscriptions/:orgId', authenticate, requireRoles('manager', 'admin', 'owner'), async (req, res) => {
  const sub = await SubscriptionModel.findOne({ organizationId: req.params.orgId }).lean();
  if (!sub) return res.status(404).json({ message: 'Subscription not found' });
  res.json(sub);
});

billingRouter.post('/subscriptions', authenticate, requireRoles('manager', 'admin', 'owner'), validate(z.object({ organizationId: z.string().length(24), planKey: z.enum(['basic', 'pro', 'enterprise']) })), async (req, res) => {
  const existing = await SubscriptionModel.findOne({ organizationId: req.body.organizationId });
  if (existing) return res.status(400).json({ message: 'Subscription already exists' });
  const sub = await SubscriptionModel.create({ organizationId: req.body.organizationId, planKey: req.body.planKey, status: 'active' });
  res.status(201).json(sub);
});

// Invoices
billingRouter.get('/invoices/:orgId', authenticate, requireRoles('manager', 'admin', 'owner'), async (req, res) => {
  const invoices = await InvoiceModel.find({ organizationId: req.params.orgId }).lean();
  res.json(invoices);
});
