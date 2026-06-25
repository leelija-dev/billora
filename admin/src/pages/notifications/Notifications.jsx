import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiUser,
  FiX,
  FiRefreshCw,
  FiTrash2,
  FiFilter,
} from 'react-icons/fi';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button/Button';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuthStore();
  const {
    notifications,
    initializeNotifications,
    updateNotification,
    clearNotifications,
    loading,
    error,
  } = useNotificationStore();

  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      initializeNotifications(user.id);
    }
  }, [user?.id, initializeNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await initializeNotifications(user.id);
      toast.success('Notifications refreshed');
    } catch (error) {
      toast.error('Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = (notification) => {
    try {
      updateNotification({ ...notification, read: true });
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = () => {
    try {
      // Mark all notifications as read
      notifications.forEach((notification) => {
        if (!notification.read) {
          updateNotification({ ...notification, read: true });
        }
      });

      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleClearAll = () => {
    clearNotifications();
    toast.success('All notifications cleared');
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'order':
        return <FiCheckCircle className="w-6 h-6 text-blue-500" />;
      case 'warning':
      case 'expiry':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'payment':
        return <FiInfo className="w-6 h-6 text-green-500" />;
      case 'user':
        return <FiUser className="w-6 h-6 text-purple-500" />;
      default:
        return <FiBell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'order':
        return 'from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10';
      case 'warning':
      case 'expiry':
        return 'from-yellow-500/10 to-yellow-600/5 dark:from-yellow-500/20 dark:to-yellow-600/10';
      case 'payment':
        return 'from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-600/10';
      case 'user':
        return 'from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/10';
      default:
        return 'from-gray-500/10 to-gray-600/5 dark:from-gray-500/20 dark:to-gray-600/10';
    }
  };

  // Combine notifications (now unified from service)
  const allNotifications = Array.isArray(notifications) ? notifications : [];

  // Filter notifications
  const filteredNotifications = allNotifications.filter((n) => {
    // Filter by read status
    if (filter === 'unread' && n.read) return false;
    if (filter === 'read' && !n.read) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        n.title?.toLowerCase().includes(query) ||
        n.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <FiBell className="w-7 h-7 text-primary-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-sm font-medium">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with your notifications
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              icon={FiRefreshCw}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                icon={FiCheckCircle}
              >
                Mark all as read
              </Button>
            )}
            {allNotifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                icon={FiTrash2}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
            />
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.read && handleMarkAsRead(notification)}
                className={`p-4 md:p-5 rounded-xl border cursor-pointer transition-all ${
                  !notification.read
                    ? `bg-gradient-to-r ${getNotificationColor(
                        notification.type
                      )} border-primary-200 dark:border-primary-800`
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      !notification.read
                        ? 'bg-white/50 dark:bg-gray-700/50 shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold ${
                          !notification.read
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {notification.priority === 'high' && !notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full animate-pulse mt-2" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {notification.time}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification);
                          }}
                          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FiBell}
            title={
              searchQuery
                ? 'No matching notifications'
                : filter === 'unread'
                ? 'No unread notifications'
                : filter === 'read'
                ? 'No read notifications'
                : 'No notifications yet'
            }
            description={
              searchQuery
                ? 'Try adjusting your search terms'
                : "We'll notify you when something important happens"
            }
            action={
              searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              ) : null
            }
          />
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
