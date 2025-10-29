/**
 * Webhook Routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Webhook created' });
});

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: { webhooks: [] } });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ success: true, data: { webhook: {} } });
});

router.delete('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Webhook deleted' });
});

export default router;
