import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Resource not found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isKnownError = err instanceof Error;
  const status = (isKnownError && (err as any).status) || 500;
  const message = isKnownError ? err.message : 'Internal Server Error';
  if (status >= 500) {
    logger.error(`Unhandled error: ${message}`);
  }
  res.status(status).json({ message });
}
