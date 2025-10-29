import express from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { StripeService } from '../../services/stripe.service';

export const stripeRouter = express.Router();

stripeRouter.post('/portal', authenticate, requireRoles('manager', 'admin', 'owner'), validate(z.object({ customerId: z.string().min(1), returnUrl: z.string().url() })), async (req, res) => {
  const svc = new StripeService();
  const session = await svc.createPortalSession(req.body.customerId, req.body.returnUrl);
  res.json({ url: session.url });
});
