import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware to authenticate requests using JWT from cookies
 * Attaches userId to request object if valid token is present
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const payload = verifyToken(token);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    next(error);
  }
};
