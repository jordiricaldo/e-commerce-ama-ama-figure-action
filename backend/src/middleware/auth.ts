import { NextFunction, Request, Response } from 'express';
import { AuthUser, Role } from '../types.js';
import { getSessionUser, isPostgresEnabled } from '../data-store.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const tokens = new Map<string, AuthUser>();

export const requireAuth = (role?: Role) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  const authenticate = async () => {
    const user = token
      ? isPostgresEnabled() ? await getSessionUser(token) : tokens.get(token)
      : undefined;
    if (!user || (role && user.role !== role)) {
      res.status(403).json({ message: role === 'admin' ? 'Akses admin diperlukan.' : 'Silakan login terlebih dahulu.' });
      return;
    }
    req.user = user;
    next();
  };
  void authenticate().catch(next);
};