import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getUserNotifications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notifications = await this.notificationService.getUserNotifications(req.userId!);
      res.status(200).json({
        success: true,
        data: { notifications }
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await this.notificationService.markAsRead(req.params.id);
      res.status(200).json({
        success: true,
        data: { notification }
      });
    } catch (error) {
      next(error);
    }
  };
}
