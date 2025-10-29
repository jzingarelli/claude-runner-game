/**
 * Comment Routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Comment created' });
});

router.get('/post/:postId', authenticate, (req, res) => {
  res.json({ success: true, data: { comments: [] } });
});

router.put('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Comment updated' });
});

router.delete('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Comment deleted' });
});

export default router;
