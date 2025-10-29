import express from 'express';
import type { Model, Document, Types } from 'mongoose';
import { z } from 'zod';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { requireRoles, Role } from '../middlewares/rbac';
import { getPagination } from './pagination';
import { CacheService } from '../services/cache.service';

export interface CrudOptions<T> {
  model: Model<T & Document<Types.ObjectId>>;
  resourceName: string;
  /** Zod schema for create payload */
  createSchema: z.AnyZodObject;
  /** Zod schema for update payload */
  updateSchema: z.AnyZodObject;
  defaultRole?: Role;
}

export function buildCrudRouter<T>({ model, resourceName, createSchema, updateSchema, defaultRole = 'analyst' }: CrudOptions<T>) {
  const router = express.Router();
  const idSchema = z.object({ id: z.string().length(24) });

  // List with pagination and simple filtering
  router.get('/', authenticate, requireRoles(defaultRole, 'admin', 'owner', 'manager'), async (req, res) => {
    const { page = '1', limit = '20', q } = req.query as Record<string, string>;
    const { skip, limit: take } = getPagination({ page: Number(page), limit: Number(limit) });
    const match: any = {};
    if (q) match.$text = { $search: q };
    const cache = new CacheService();
    const key = `${resourceName}:list:${JSON.stringify({ page, limit, q })}`;
    const cached = await cache.get<any>(key);
    if (cached) return res.json(cached);
    const [data, total] = await Promise.all([
      model.find(match).skip(skip).limit(take).lean(),
      model.countDocuments(match),
    ]);
    const payload = { page: Number(page), limit: take, total, data };
    await cache.set(key, payload, 30);
    res.json(payload);
  });

  // Retrieve by id
  router.get('/:id', authenticate, requireRoles(defaultRole, 'admin', 'owner', 'manager'), validate(idSchema, 'params'), async (req, res) => {
    const doc = await model.findById((req as any).params.id).lean();
    if (!doc) return res.status(404).json({ message: `${resourceName} not found` });
    res.json(doc);
  });

  // Create
  router.post('/', authenticate, requireRoles('manager', 'admin', 'owner'), validate(createSchema), async (req, res) => {
    const doc = await model.create(req.body);
    await new CacheService().invalidateByPrefix(`${resourceName}:`);
    res.status(201).json(doc);
  });

  // Update
  router.put('/:id', authenticate, requireRoles('manager', 'admin', 'owner'), validate(idSchema, 'params'), validate(updateSchema), async (req, res) => {
    const doc = await model.findByIdAndUpdate((req as any).params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: `${resourceName} not found` });
    await new CacheService().invalidateByPrefix(`${resourceName}:`);
    res.json(doc);
  });

  // Delete
  router.delete('/:id', authenticate, requireRoles('admin', 'owner'), validate(idSchema, 'params'), async (req, res) => {
    const doc = await model.findByIdAndDelete((req as any).params.id);
    if (!doc) return res.status(404).json({ message: `${resourceName} not found` });
    await new CacheService().invalidateByPrefix(`${resourceName}:`);
    res.status(204).send();
  });

  return router;
}
