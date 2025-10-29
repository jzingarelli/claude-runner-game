/**
 * Authentication Middleware
 * JWT verification and user authentication
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, TokenPayload, UserRole } from '../types';
import User from '../models/User';
import logger from '../utils/logger';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'No authentication token provided',
          code: 'AUTH_TOKEN_MISSING',
        },
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Check token type
    if (decoded.type !== 'access') {
      res.status(401).json({
        error: {
          message: 'Invalid token type',
          code: 'INVALID_TOKEN_TYPE',
        },
      });
      return;
    }

    // Fetch user
    const user = await User.findById(decoded.userId).select('+role +teamId');
    if (!user) {
      res.status(401).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      });
      return;
    }

    // Check if user is locked
    if (user.isLocked()) {
      res.status(403).json({
        error: {
          message: 'Account is locked due to too many failed login attempts',
          code: 'ACCOUNT_LOCKED',
        },
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId?.toString(),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        },
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: {
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        },
      });
    } else {
      logger.error('Authentication error:', error);
      res.status(500).json({
        error: {
          message: 'Authentication failed',
          code: 'AUTH_ERROR',
        },
      });
    }
  }
};

/**
 * Require specific roles
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            required: roles,
            current: req.user.role,
          },
        },
      });
      return;
    }

    next();
  };
};

/**
 * Require minimum role level
 */
export const requireMinRole = (minRole: UserRole) => {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.VIEWER]: 1,
    [UserRole.EDITOR]: 2,
    [UserRole.MODERATOR]: 3,
    [UserRole.ADMIN]: 4,
    [UserRole.SUPER_ADMIN]: 5,
  };

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        },
      });
      return;
    }

    const userRoleLevel = roleHierarchy[req.user.role];
    const minRoleLevel = roleHierarchy[minRole];

    if (userRoleLevel < minRoleLevel) {
      res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            minimumRequired: minRole,
            current: req.user.role,
          },
        },
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    await authenticate(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export default {
  authenticate,
  requireRole,
  requireMinRole,
  optionalAuth,
};
