import { NotificationRepository } from '../repositories/NotificationRepository';
import { INotification } from '../models/Notification';
import { NotFoundError } from '../utils/errors';

/**
 * Business logic for notification management
 */
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  /**
   * Get all notifications for a user
   * @param userId - User ID
   * @returns List of notifications
   */
  async getUserNotifications(userId: string): Promise<INotification[]> {
    return await this.notificationRepository.findByUserId(userId);
  }

  /**
   * Mark notification as read
   * @param notificationId - Notification ID
   * @returns Updated notification
   */
  async markAsRead(notificationId: string): Promise<INotification> {
    const notification = await this.notificationRepository.markAsRead(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  }

  /**
   * Get count of unread notifications
   * @param userId - User ID
   * @returns Count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.countUnread(userId);
  }
}
