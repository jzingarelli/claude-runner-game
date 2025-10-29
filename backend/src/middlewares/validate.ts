import type { NextFunction, Response } from 'express';
import type { AnyZodObject, ZodError } from 'zod';
import type { AuthRequest } from './auth';

export function validate(schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse((req as any)[source]);
      (req as any)[source] = parsed;
      next();
    } catch (err) {
      const zerr = err as ZodError;
      return res.status(400).json({ message: 'Validation error', errors: zerr.flatten() });
    }
  };
}
