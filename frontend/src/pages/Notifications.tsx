import { Layout } from '../components/Layout';
import { useNotifications } from '../hooks/useNotifications';
import { format } from 'date-fns';

export const Notifications = () => {
  const { notifications, isLoading, markAsRead } = useNotifications();

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-4 ${
                  !notification.isRead ? 'border-l-4 border-indigo-600' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="ml-4 text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
