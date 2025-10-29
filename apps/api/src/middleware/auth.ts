import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser, UserRole } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser & { id: string };
}

/**
 * Verify access token and attach user to request
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization?.split(' ');
  const token = auth?.[0] === 'Bearer' ? auth[1] : undefined;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = Object.assign(user.toObject(), { id: user.id }) as any;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Require at least one of the given roles
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const has = req.user.roles.some((r) => roles.includes(r as UserRole));
    if (!has) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
