import Notification, { INotification } from '../models/Notification';

/**
 * Data access layer for Notification operations
 */
export class NotificationRepository {
  async create(data: {
    userId: string;
    taskId: string;
    message: string;
  }): Promise<INotification> {
    return await Notification.create(data);
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
  }

  async countUnread(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, isRead: false });
  }
}
