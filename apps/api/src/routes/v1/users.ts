import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../../models/User';
import { validate } from '../../middleware/validate';
import { authenticate, requireRole } from '../../middleware/auth';

export const usersRouter = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  roles: z.array(z.enum(['owner', 'admin', 'manager', 'analyst', 'viewer'])).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
  roles: z.array(z.enum(['owner', 'admin', 'manager', 'analyst', 'viewer'])).optional(),
});

/**
 * Create a new user
 */
usersRouter.post('/', authenticate, requireRole('admin', 'owner'), validate(createUserSchema), async (req: Request, res: Response) => {
  try {
    const { email, name, password, roles } = req.body as z.infer<typeof createUserSchema>;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash, roles: roles as UserRole[] | undefined });
    res.status(201).json(sanitize(user));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * List users with pagination
 */
usersRouter.get('/', authenticate, requireRole('admin', 'owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    res.json({ items: items.map(sanitize), page, limit, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * Get a user by id
 */
usersRouter.get('/:id', authenticate, requireRole('admin', 'owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(sanitize(user));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * Update user by id
 */
usersRouter.patch('/:id', authenticate, requireRole('admin', 'owner'), validate(updateUserSchema), async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body as z.infer<typeof updateUserSchema> & { password?: string };
    const update: Partial<IUser> & { passwordHash?: string } = { ...rest } as any;
    if (password) update.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(sanitize(user));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * Delete user by id
 */
usersRouter.delete('/:id', authenticate, requireRole('admin', 'owner'), async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

function sanitize(user: IUser) {
  const { passwordHash, __v, ...json } = user.toObject({ versionKey: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...rest } = json as any;
  delete (rest as any).passwordHash;
  return rest;
}
