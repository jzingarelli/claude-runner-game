import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import { Post } from '../../models/Post';

export const postsRouter = Router();

postsRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json({ data: posts });
});

postsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  const { content, scheduledAt } = req.body;
  if (!content) return res.status(400).json({ error: { message: 'Content required' } });
  // @ts-ignore - user added by auth
  const authorId = req.user!.id;
  const post = await Post.create({ authorId, content, scheduledAt });
  res.status(201).json({ data: post });
});

postsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data: post });
});

postsRouter.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data: post });
});

postsRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: { message: 'Not found' } });
  res.status(204).end();
});
