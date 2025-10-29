import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Post, IPost } from '../../models/Post';
import { validate } from '../../middleware/validate';

export const postsRouter = Router();

const createSchema = z.object({
  authorId: z.string().min(1),
  content: z.string().min(1),
  scheduledAt: z.string().datetime().optional(),
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'instagram', 'tiktok']),
});

const updateSchema = z.object({
  content: z.string().min(1).optional(),
  scheduledAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
});

postsRouter.post('/', validate(createSchema), async (req: Request, res: Response) => {
  try {
    const data = req.body as z.infer<typeof createSchema>;
    const post = await Post.create({ ...data, scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

postsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

postsRouter.patch('/:id', validate(updateSchema), async (req: Request, res: Response) => {
  try {
    const data = req.body as z.infer<typeof updateSchema>;
    const update: Partial<IPost> = { ...data } as any;
    if (data.scheduledAt) (update as any).scheduledAt = new Date(data.scheduledAt);
    if (data.publishedAt) (update as any).publishedAt = new Date(data.publishedAt);
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

postsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});
