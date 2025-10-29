import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth';

export type Role = 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer';

export function requireRoles(...allowed: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const roles = req.user?.roles ?? [];
    const authorized = roles.some((r) => allowed.includes(r as Role));
    if (!authorized) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
