import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Comment } from '../../models/Comment';
import { validate } from '../../middleware/validate';

export const commentsRouter = Router();

const createSchema = z.object({
  postId: z.string().min(1),
  authorId: z.string().min(1),
  text: z.string().min(1),
});

const updateSchema = z.object({ text: z.string().min(1) });

commentsRouter.post('/', validate(createSchema), async (req: Request, res: Response) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

commentsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Comment.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Comment.countDocuments(),
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

commentsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

commentsRouter.patch('/:id', validate(updateSchema), async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

commentsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});
