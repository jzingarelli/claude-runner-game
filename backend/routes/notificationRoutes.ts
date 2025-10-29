/**
 * Notification Routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: { notifications: [] } });
});

router.get('/unread', authenticate, (req, res) => {
  res.json({ success: true, data: { unread: 0 } });
});

router.put('/:id/read', authenticate, (req, res) => {
  res.json({ success: true, message: 'Notification marked as read' });
});

router.put('/read-all', authenticate, (req, res) => {
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
