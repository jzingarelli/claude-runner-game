/**
 * Subscription Routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create', authenticate, (req, res) => {
  res.json({ success: true, message: 'Subscription created' });
});

router.post('/cancel', authenticate, (req, res) => {
  res.json({ success: true, message: 'Subscription canceled' });
});

router.post('/update', authenticate, (req, res) => {
  res.json({ success: true, message: 'Subscription updated' });
});

router.get('/current', authenticate, (req, res) => {
  res.json({ success: true, data: { subscription: {} } });
});

router.get('/invoices', authenticate, (req, res) => {
  res.json({ success: true, data: { invoices: [] } });
});

router.post('/webhook', (req, res) => {
  res.json({ success: true });
});

export default router;
