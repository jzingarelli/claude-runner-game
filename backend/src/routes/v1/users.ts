import express from 'express';
import { z } from 'zod';
import { UserModel } from '../../models/User';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { getPagination } from '../../utils/pagination';

export const usersRouter = express.Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roles: z.array(z.enum(['owner', 'admin', 'manager', 'analyst', 'viewer'])).default(['viewer']),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  roles: z.array(z.enum(['owner', 'admin', 'manager', 'analyst', 'viewer'])).optional(),
});

usersRouter.get('/', authenticate, requireRoles('analyst', 'manager', 'admin', 'owner'), async (req, res) => {
  const { page = '1', limit = '20', q } = req.query as Record<string, string>;
  const { skip, limit: take } = getPagination({ page: Number(page), limit: Number(limit) });
  const match: any = {};
  if (q) match.$text = { $search: q };
  const [data, total] = await Promise.all([
    UserModel.find(match, { passwordHash: 0 }).skip(skip).limit(take).lean(),
    UserModel.countDocuments(match),
  ]);
  res.json({ page: Number(page), limit: take, total, data });
});

usersRouter.get('/:id', authenticate, requireRoles('analyst', 'manager', 'admin', 'owner'), async (req, res) => {
  const user = await UserModel.findById(req.params.id, { passwordHash: 0 }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

usersRouter.post('/', authenticate, requireRoles('admin', 'owner'), validate(createUserSchema), async (req, res) => {
  const user = await UserModel.create(req.body);
  const safe = { id: user._id, email: user.email, name: user.name, roles: user.roles };
  res.status(201).json(safe);
});

usersRouter.put('/:id', authenticate, requireRoles('admin', 'owner'), validate(updateUserSchema), async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, projection: { passwordHash: 0 } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

usersRouter.delete('/:id', authenticate, requireRoles('admin', 'owner'), async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
});
