import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useNotificationStore } from '../../../store/notificationStore';
import { useUIStore } from '../../../store/uiStore';
import { usePermissionStore } from '../../../store/permissionStore';
import {
  FiHome,
  FiPackage,
  FiArchive,
  FiShoppingBag,
  FiUsers,
  FiFileText,
  FiCreditCard,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiHelpCircle,
  FiBell,
  FiBox,
  FiGrid,
  FiBarChart2,
  FiTag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileMedical, FaRupeeSign, FaStore } from 'react-icons/fa';
import { TbRuler2, TbSocial } from "react-icons/tb";

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, isMobile, setIsMobile } = useUIStore();
  const { canAccess, sidebarPermissions, loading: permissionsLoading, permissionsFetched } = usePermissionStore();
  const { user } = useAuthStore();
  const { planExpireReminder } = useNotificationStore();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1080);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Auto close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [location.pathname, isMobile]);

  // Fetch sidebar permissions if not already loaded
  useEffect(() => {
    const { fetchUserPermissions } = usePermissionStore.getState();
    
    if (user?.plan_id && !permissionsFetched && !permissionsLoading) {
      fetchUserPermissions(user.id);
    }
  }, [user?.plan_id, permissionsFetched, permissionsLoading]);

  // Icon mapping for dynamic menu items
  const iconMap = {
    'dashboard': FiHome,
    'products': FiPackage,
    'categories': FiGrid,
    'brands': FiTag,
    'units': TbRuler2,
    'medicine-types': FaFileMedical,
    'stores': FaStore,
    'packages': FiBox,
    'stock': FiArchive,
    'orders': FiShoppingBag,
    'customers': FiUsers,
    'invoices': FiFileText,
    'reports': FiBarChart2,
    'plans': FiCreditCard,
    'social-link':TbSocial,
    'gst': FaRupeeSign,
    'settings': FiSettings,
  };

  // Path mapping for menu items
  const pathMap = {
    'dashboard': '/dashboard',
    'products': '/products',
    'categories': '/categories',
    'brands': '/brands',
    'units': '/units',
    'medicine-types': '/medicine-types',
    'stores': '/stores',
    'packages': '/packages',
    'stock': '/stock',
    'orders': '/orders',
    'customers': '/customers',
    'invoices': '/invoices',
    'reports': '/reports',
    'plans': '/billing',
    'social-link':"/social-link",
    'gst': '/gst',
    'settings': '/settings',
  };

  // Generate dynamic menu items from API permissions
  const menuItems = sidebarPermissions.map(permission => {
    const path = pathMap[permission.slug];
    const icon = iconMap[permission.slug] || FiSettings; // Default to Settings icon
    const badge = permission.slug === 'plans' && planExpireReminder ? '?' : null;
    
    return {
      path: path,
      name: permission.name,
      icon: icon,
      badge: badge,
      permission: null // Sidebar permissions already handle access control
    };
  });

  // Filter menu items - sidebar permissions already control what's visible
  const filteredMenuItems = menuItems.filter(item => {
    // Only filter out items that don't have a valid path
    return item.path !== undefined;
  });

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile 
            ? (sidebarOpen ? '280px' : '0px')
            : (sidebarOpen ? '256px' : '80px'),
          x: isMobile && !sidebarOpen ? '-100%' : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900 shadow-2xl z-40 overflow-hidden border-r border-gray-200/50 dark:border-gray-700/50"
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />

        {/* Logo Area */}
        <div className="relative flex items-center justify-between h-20 px-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3 overflow-hidden">
            
            
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <> 
                <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div> 
               
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col"
                >
                  <span className="font-semibold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    The Fast Bill
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400"></span>
                </motion.div>
                 </>
              )}
            </AnimatePresence>
          </div>
          
          {/* Toggle Button - Hide on mobile */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="flex-shrink-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
            >
              {sidebarOpen ? (
                <FiChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
              ) : (
                <FiChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
              )}
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-20">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative flex items-center px-3 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-500/10 to-primary-600/5 dark:from-primary-500/20 dark:to-primary-600/10 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-primary-500' : ''
                    }`} />
                    
                    {/* Notification badge for icon */}
                    {item.badge && !sidebarOpen && (
                      <span className={`absolute -top-1 -right-1 w-2 h-2 ${
                        item.badge === 'Low Stock' 
                          ? 'bg-yellow-500' 
                          : item.badge === '⚠️' 
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                      } rounded-full ring-2 ring-white dark:ring-gray-800`} />
                    )}
                  </motion.div>

                  {/* Item name */}
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
  <motion.span
    initial={{ opacity: 0, width: 0 }}
    animate={{ opacity: 1, width: 'auto' }}
    exit={{ opacity: 0, width: 0 }}
    transition={{ duration: 0.2 }}
    className="text-sm font-medium whitespace-nowrap overflow-hidden"
  >
    {item.name?.toLowerCase() === 'gst'
      ? item.name.toUpperCase()
      : item.name}
  </motion.span>
)}
                  </AnimatePresence>

                  {/* Badge for expanded state */}
                  {sidebarOpen && item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                        item.badge === 'Low Stock' 
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && !isMobile && hoveredItem === item.path && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap shadow-lg z-50"
                    >
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {/* Arrow */}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </motion.div>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section - Hide on mobile when sidebar is collapsed */}
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            {/* Quick actions - Hide on mobile */}
            {!isMobile && (
              <div className="flex justify-around mb-4 px-2">
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <FiBell className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <FiHelpCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <FiLogOut className="w-4 h-4" />
                </motion.button>
              </div>
            )}

           
          </motion.div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;