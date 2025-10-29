import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import { Comment } from '../../models/Comment';

export const commentsRouter = Router();

commentsRouter.get('/post/:postId', requireAuth, async (req: Request, res: Response) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
  res.json({ data: comments });
});

commentsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  const { postId, body } = req.body;
  // @ts-ignore
  const authorId = req.user!.id;
  if (!postId || !body) return res.status(400).json({ error: { message: 'Invalid input' } });
  const comment = await Comment.create({ postId, authorId, body });
  res.status(201).json({ data: comment });
});

commentsRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) return res.status(404).json({ error: { message: 'Not found' } });
  res.status(204).end();
});
