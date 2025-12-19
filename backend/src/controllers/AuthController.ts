import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/AuthService';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);

      res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.login(req.body);
      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);

      res.status(200).json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      clearTokenCookie(res);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getUserById(req.userId!);
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.updateProfile(req.userId!, req.body);
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.authService.getAllUsers();
      res.status(200).json({
        success: true,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  };
}
