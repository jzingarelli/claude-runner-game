import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  logger.error('Request error', { status, message, stack: err.stack });
  res.status(status).json({ error: { message, status } });
}
