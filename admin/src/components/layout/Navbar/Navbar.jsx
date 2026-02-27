import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { useUIStore } from '../../../store/uiStore'
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
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, company, logout } = useAuthStore()
  const { theme, toggleTheme, toggleSidebar, sidebarOpen } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', description: 'Order #12345 from John Doe', time: '5 min ago', read: false, type: 'order' },
    { id: 2, title: 'Low stock alert', description: 'Product XYZ is running low', time: '1 hour ago', read: false, type: 'warning' },
    { id: 3, title: 'Payment received', description: '$500 from ABC Corp', time: '2 hours ago', read: true, type: 'payment' },
    { id: 4, title: 'New user registered', description: 'Sarah Smith joined', time: '1 day ago', read: true, type: 'user' },
  ])

  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return '🛒'
      case 'warning': return '⚠️'
      case 'payment': return '💰'
      case 'user': return '👤'
      default: return '📌'
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed top-0 right-0 left-0 z-40 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
        style={{ left: sidebarOpen ? '256px' : '80px' }}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />

        <div className="px-4 h-full flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            >
              <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Toggle Menu
              </span>
            </motion.button>
            
            {/* Company info with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {company?.name || 'Dashboard'}
                  </h2>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 text-primary-600 dark:text-primary-400 rounded-full border border-primary-200 dark:border-primary-800"
                  >
                    {company?.plan || 'Free Plan'}
                  </motion.span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
          <div className="flex items-center space-x-2">
            {/* Search Bar - Enhanced */}
            <motion.div
              animate={{ width: searchFocused ? 300 : 200 }}
              transition={{ duration: 0.3 }}
              className="relative hidden md:block"
            >
              <input
                type="text"
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Quick search results (demo) */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Products</p>
                        <p className="text-xs text-gray-500">Search for products...</p>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Orders</p>
                        <p className="text-xs text-gray-500">Search for orders...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Fullscreen Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="hidden md:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMaximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </motion.button>

            {/* Theme Toggle with animation */}
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
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
              >
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  >
                    {unreadCount}
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
                    className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiBell className="w-4 h-4 mr-2" />
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-lg">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                        View all notifications
                      </button>
                    </div>
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
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                </motion.div>
                
                <div className="hidden md:block text-left">
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
                >
                  <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name || 'User Name'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false)
                          navigate('/profile')
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false)
                          navigate('/settings')
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <FiSettings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false)
                          navigate('/help')
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

      {/* Spacer for content */}
      <div className="h-16" />
    </>
  )
}

export default Navbar