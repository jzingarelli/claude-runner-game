import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { PermissionModel } from '../../models/Permission';

const createSchema = z.object({
  key: z.string().min(3),
  description: z.string().optional(),
});

const updateSchema = z.object({
  description: z.string().optional(),
});

export const permissionsRouter = buildCrudRouter({
  model: PermissionModel,
  resourceName: 'permission',
  createSchema,
  updateSchema,
  defaultRole: 'admin',
});
