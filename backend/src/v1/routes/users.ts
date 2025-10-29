import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { User } from '../../models/User';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, requireRole('admin', 'manager'), async (_req: Request, res: Response) => {
  const users = await User.find().select('email name role createdAt');
  res.json({ data: users });
});

usersRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('email name role createdAt');
  if (!user) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data: user });
});

usersRouter.post('/', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  const { email, name, role } = req.body;
  if (!email || !name || !role) return res.status(400).json({ error: { message: 'Invalid input' } });
  const user = await User.create({ email, name, passwordHash: '!' , role});
  res.status(201).json({ data: user });
});

usersRouter.patch('/:id', requireAuth, requireRole('admin', 'manager'), async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data: user });
});

usersRouter.delete('/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: { message: 'Not found' } });
  res.status(204).end();
});
