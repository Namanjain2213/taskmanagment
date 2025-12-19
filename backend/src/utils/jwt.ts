import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface JwtPayload {
  userId: string;
}

/**
 * Generate JWT token for user authentication
 * @param userId - User ID to encode in token
 * @returns Signed JWT token
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Set JWT token as HttpOnly cookie in response
 * @param res - Express response object
 * @param token - JWT token to set
 */
export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/**
 * Clear authentication cookie
 * @param res - Express response object
 */
export const clearTokenCookie = (res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
};
