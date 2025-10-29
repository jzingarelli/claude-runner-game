import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema<any>, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      const details = result.error.flatten();
      return res.status(400).json({ error: 'ValidationError', details });
    }
    // replace with parsed data to coerce types
    (req as any)[property] = result.data;
    next();
  };
}
