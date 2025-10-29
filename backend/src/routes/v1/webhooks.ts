import express from 'express';
import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { WebhookEndpointModel } from '../../models/WebhookEndpoint';
import { validate } from '../../middlewares/validate';

const createSchema = z.object({
  ownerId: z.string().length(24),
  url: z.string().url(),
  secret: z.string().min(16),
  eventTypes: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
});

const updateSchema = z.object({
  url: z.string().url().optional(),
  secret: z.string().min(16).optional(),
  eventTypes: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
});

export const webhooksRouter = express.Router();

webhooksRouter.use('/endpoints', buildCrudRouter({
  model: WebhookEndpointModel,
  resourceName: 'webhook endpoint',
  createSchema,
  updateSchema,
}));

// Inbound webhook handler example (Stripe, etc.)
webhooksRouter.post('/inbound/:provider', validate(z.object({ provider: z.string().min(1) }), 'params'), async (req, res) => {
  // For demo: accept and log
  res.status(200).json({ received: true, provider: req.params.provider });
});
