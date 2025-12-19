import useSWR from 'swr';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Notification } from '../types';
import { socketService } from '../services/socket';

export const useNotifications = () => {
  const { data, error, mutate } = useSWR<{ notifications: Notification[] }>(
    '/notifications',
    () => api.get('/notifications'),
    {
      revalidateOnFocus: false
    }
  );

  // Real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      mutate((current) => {
        if (!current) return { notifications: [notification] };
        return { notifications: [notification, ...current.notifications] };
      }, false);
      toast.success('New notification received!');
    };

    socketService.on('notification:new', handleNewNotification);

    return () => {
      socketService.off('notification:new', handleNewNotification);
    };
  }, [mutate]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      mutate((current) => {
        if (!current) return current;
        return {
          notifications: current.notifications.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        };
      }, false);
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
    }
  };

  const unreadCount = data?.notifications.filter((n) => !n.isRead).length || 0;

  return {
    notifications: data?.notifications || [],
    unreadCount,
    isLoading: !error && !data,
    isError: error,
    markAsRead,
    mutate
  };
};
