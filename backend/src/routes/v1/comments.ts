import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { CommentModel } from '../../models/Comment';

const createSchema = z.object({
  postId: z.string().length(24),
  authorId: z.string().length(24),
  content: z.string().min(1).max(2000),
});

const updateSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
});

export const commentsRouter = buildCrudRouter({
  model: CommentModel,
  resourceName: 'comment',
  createSchema,
  updateSchema,
});
