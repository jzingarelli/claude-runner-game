import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { PostModel } from '../../models/Post';

const createSchema = z.object({
  authorId: z.string().length(24),
  content: z.string().min(1).max(5000),
  mediaUrls: z.array(z.string().url()).default([]),
  scheduledAt: z.string().datetime().optional(),
  platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'other']),
});

const updateSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const postsRouter = buildCrudRouter({
  model: PostModel,
  resourceName: 'post',
  createSchema,
  updateSchema,
});
