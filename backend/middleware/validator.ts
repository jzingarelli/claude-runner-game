/**
 * Validation Middleware
 * Request validation using express-validator and Zod
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { z, ZodSchema } from 'zod';

/**
 * Express-validator error handler
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    next();
  };
};

/**
 * Zod schema validator
 */
export const validateSchema = <T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      } else {
        res.status(400).json({
          error: {
            message: 'Invalid request data',
            code: 'INVALID_DATA',
          },
        });
      }
    }
  };
};

/**
 * Common Zod schemas
 */
export const commonSchemas = {
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  dateRange: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
};

/**
 * User validation schemas
 */
export const userSchemas = {
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
  }),
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1),
  }),
  updateProfile: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    avatar: z.string().url().optional(),
  }),
  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: commonSchemas.password,
  }),
};

/**
 * Post validation schemas
 */
export const postSchemas = {
  create: z.object({
    content: z.string().min(1).max(5000),
    platforms: z.array(
      z.object({
        platform: z.enum(['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok']),
        accountId: z.string(),
      })
    ),
    scheduledFor: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
  update: z.object({
    content: z.string().min(1).max(5000).optional(),
    status: z.enum(['draft', 'scheduled', 'published', 'archived']).optional(),
    scheduledFor: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
};

/**
 * Report validation schemas
 */
export const reportSchemas = {
  create: z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    type: z.enum(['analytics', 'performance', 'engagement', 'custom']),
    dateRange: commonSchemas.dateRange,
    metrics: z.array(z.string()).min(1),
    format: z.enum(['pdf', 'csv', 'xlsx', 'json']).default('pdf'),
  }),
};

/**
 * Team validation schemas
 */
export const teamSchemas = {
  create: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  }),
  addMember: z.object({
    userId: commonSchemas.objectId,
    role: z.enum(['viewer', 'editor', 'moderator', 'admin']),
  }),
};

/**
 * Comment validation schemas
 */
export const commentSchemas = {
  create: z.object({
    content: z.string().min(1).max(1000),
    parentId: commonSchemas.objectId.optional(),
  }),
};

export default {
  validateRequest,
  validateSchema,
  commonSchemas,
  userSchemas,
  postSchemas,
  reportSchemas,
  teamSchemas,
  commentSchemas,
};
