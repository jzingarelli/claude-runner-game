import express from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { FileService } from '../../services/file.service';

export const filesRouter = express.Router();

filesRouter.post('/presign', authenticate, validate(z.object({ contentType: z.string().min(1), extension: z.string().optional() })), async (req, res) => {
  const service = new FileService();
  const link = await service.createPresignedUpload(req.body.contentType, req.body.extension);
  res.json(link);
});
