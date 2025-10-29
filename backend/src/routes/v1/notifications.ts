import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { NotificationModel } from '../../models/Notification';

const createSchema = z.object({
  userId: z.string().length(24),
  type: z.string().min(1),
  title: z.string().min(1),
  body: z.string().optional(),
});

const updateSchema = z.object({
  read: z.boolean().optional(),
});

export const notificationsRouter = buildCrudRouter({
  model: NotificationModel,
  resourceName: 'notification',
  createSchema,
  updateSchema,
});
