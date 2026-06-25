import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { useNotificationStore } from '../../../store/notificationStore';
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiSettings,
  FiHelpCircle,
  FiSearch,
  FiMaximize2,
  FiMinimize2,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, company, logout } = useAuthStore();
  const { theme, toggleTheme, toggleSidebar, sidebarOpen, isMobile } = useUIStore();
  const { 
    notifications, 
    initializeNotifications,
    updateNotification,
    loading,
    error,
    clearNotifications 
  } = useNotificationStore();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [markAsReadLoading, setMarkAsReadLoading] = useState(false);

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Initialize notifications on component mount
  useEffect(() => {
    if (user?.id) {
      initializeNotifications(user.id);
    }
  }, [user?.id, initializeNotifications]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔥 Sync logout across apps
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout-event") {
        logout();
        navigate('/login');
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [logout, navigate]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleLogout = () => {
    clearNotifications(); // Clear notifications on logout
    logout();
    localStorage.setItem("logout-event", Date.now().toString());
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'order':
        return <FiCheckCircle className="w-5 h-5 text-blue-500" />;
      case 'warning':
      case 'expiry':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'payment':
        return <FiInfo className="w-5 h-5 text-green-500" />;
      case 'user':
        return <FiUser className="w-5 h-5 text-purple-500" />;
      default:
        return <FiBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type?.toLowerCase()) {
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

  // Combine notifications from store (now unified)
  const allNotifications = Array.isArray(notifications) ? notifications.map(notification => ({
    id: notification.id || notification._id,
    title: notification.title || 'Notification',
    description: notification.message || notification.description || '',
    time: notification.time || notification.createdAt 
      ? new Date(notification.createdAt).toLocaleDateString() 
      : 'Just now',
    read: notification.read || false,
    type: notification.type || 'info',
    priority: notification.priority || 'normal',
    data: notification,
    icon: notification.icon
  })) : [];

  // Sort notifications by priority and time
  const sortedNotifications = [...allNotifications].sort((a, b) => {
    // Priority order: high > normal > low
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by read status (unread first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    
    return 0;
  });

  // Filter notifications based on search
  const filteredNotifications = sortedNotifications.filter(n => 
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = sortedNotifications.filter(n => !n.read).length;

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setMarkAsReadLoading(true);
    try {
      // Mark each notification as read
      const unreadNotifications = sortedNotifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        if (notification.id === 'plan-expiry') {
          // Update plan expiry reminder in store
          updateNotification({ 
            ...notification, 
            read: true,
            planExpireReminder: {
              ...planExpireReminder,
              read: true
            }
          });
        } else {
          // Update regular notification
          updateNotification({ ...notification, read: true });
        }
      }
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    } finally {
      setMarkAsReadLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notification) => {
    try {
      if (notification.id === 'plan-expiry') {
        updateNotification({ 
          ...notification, 
          read: true,
          planExpireReminder: {
            ...planExpireReminder,
            read: true
          }
        });
      } else {
        updateNotification({ ...notification, read: true });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification);
    }
    
    // Navigate based on notification type
    if (notification.data?.link) {
      navigate(notification.data.link);
    } else if (notification.type === 'order' && notification.data?.orderId) {
      navigate(`/orders/${notification.data.orderId}`);
    } else if (notification.type === 'payment' && notification.data?.transactionId) {
      navigate(`/payments/${notification.data.transactionId}`);
    }
    
    setShowNotifications(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 transition-all duration-200 ease-in-out right-0 left-0 z-40 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
        style={{ 
          left: !isMobile && sidebarOpen ? '256px' : !isMobile && !sidebarOpen ? '80px' : '0px'
        }}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />

        <div className="px-3 md:px-4 h-full flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group lg:hidden"
            >
              {sidebarOpen ? (
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
            
            {/* Company info - Hide on mobile when search is open */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center space-x-3 ${showMobileSearch ? 'hidden lg:flex' : 'flex'}`}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base md:text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate max-w-[150px] md:max-w-none">
                    {company?.name || 'Dashboard'}
                  </h2>
                </div>
                <p className="hidden lg:block text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Mobile Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            {/* Search Bar - Desktop */}
            <motion.div
              animate={{ width: searchFocused ? 300 : 200 }}
              transition={{ duration: 0.3 }}
              className="relative hidden lg:block"
            >
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </motion.div>

            {/* Fullscreen Toggle - Hide on mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="hidden lg:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMaximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    // Optionally auto-mark as read when opening
                    // markAllAsRead();
                  }
                }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
              >
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiBell className="w-4 h-4 mr-2" />
                          Notifications
                          <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                            {sortedNotifications.length}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2">
                          {loading && (
                            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                          )}
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              disabled={markAsReadLoading}
                              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium disabled:opacity-50"
                            >
                              {markAsReadLoading ? 'Marking...' : 'Mark all as read'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notifications List */}
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center">
                        <FiAlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
                      </div>
                    ) : (
                      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-3 md:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${
                                !notification.read 
                                  ? `bg-gradient-to-r ${getNotificationColor(notification.type)}` 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                                  !notification.read 
                                    ? 'bg-white/50 dark:bg-gray-700/50 shadow-sm' 
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {notification.title}
                                    </p>
                                    {notification.priority === 'high' && !notification.read && (
                                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {notification.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-1.5">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                      {notification.time}
                                    </p>
                                    {!notification.read && (
                                      <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400">
                                        New
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {!notification.read && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2" />
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <FiBell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {searchQuery ? 'No matching notifications found' : 'No notifications yet'}
                            </p>
                            {!searchQuery && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                We\'ll notify you when something important happens
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    {sortedNotifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button 
                          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 py-1.5 rounded-lg transition-colors"
                          onClick={() => {
                            navigate('/notifications');
                            setShowNotifications(false);
                          }}
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 md:pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 text-sm md:text-base">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                </motion.div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {user?.name || 'User Name'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block"
                >
                  <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 md:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* User Info Header - Mobile only */}
                    <div className="md:hidden p-4 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name || 'User Name'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiSettings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/help');
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiHelpCircle className="w-4 h-4 text-gray-500" />
                        <span>Help & Support</span>
                      </motion.button>

                      <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            ref={mobileSearchRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-lg md:hidden"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for content */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;