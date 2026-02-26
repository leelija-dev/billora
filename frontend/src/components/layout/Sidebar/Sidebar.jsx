import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useUIStore } from '../../../store/uiStore'
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
} from 'react-icons/fi'

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, isMobile, setIsMobile } = useUIStore()
  const location = useLocation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile])

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar()
    }
  }, [location.pathname, isMobile])

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FiHome },
    { path: '/products', name: 'Products', icon: FiPackage },
    { path: '/inventory', name: 'Inventory', icon: FiArchive },
    { path: '/orders', name: 'Orders', icon: FiShoppingBag },
    { path: '/customers', name: 'Customers', icon: FiUsers },
    { path: '/invoices', name: 'Invoices', icon: FiFileText },
    { path: '/billing', name: 'Billing', icon: FiCreditCard },
    { path: '/settings', name: 'Settings', icon: FiSettings },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-800
          shadow-xl transition-all duration-300 ease-in-out z-30
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                SaaS ERP
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            </div>
          )}
          
          {/* Toggle Button - Hide on mobile */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? (
                <FiChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <FiChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center px-4 py-3 mx-2 my-1
                  rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <span className="sidebar-tooltip group-hover:scale-100">
                    {item.name}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Company Name
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Free Plan
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar