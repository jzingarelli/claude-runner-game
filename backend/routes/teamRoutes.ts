/**
 * Team Routes
 */

import { Router } from 'express';
import { authenticate, requireMinRole } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.post('/', authenticate, requireMinRole(UserRole.ADMIN), (req, res) => {
  res.json({ success: true, message: 'Team created' });
});

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: { teams: [] } });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ success: true, data: { team: {} } });
});

router.put('/:id', authenticate, requireMinRole(UserRole.ADMIN), (req, res) => {
  res.json({ success: true, message: 'Team updated' });
});

router.post('/:id/members', authenticate, requireMinRole(UserRole.ADMIN), (req, res) => {
  res.json({ success: true, message: 'Member added' });
});

router.delete('/:id/members/:userId', authenticate, requireMinRole(UserRole.ADMIN), (req, res) => {
  res.json({ success: true, message: 'Member removed' });
});

export default router;
