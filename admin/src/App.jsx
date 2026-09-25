// src/App.js
import React, { useEffect, useRef } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { setupAutoNotificationListener } from './services/notificationListener';
import { useNotificationStore } from './store/notificationStore';
import CustomToast from './components/common/CustomToast/CustomToast';

function App() {
  const { theme } = useUIStore();
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const authChecked = useRef(false);
useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/session-token', {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.token) {
          localStorage.setItem('auth_token', data.token);
        }
      })
      .catch((err) => console.error('❌ session-token fetch failed:', err));
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // ✅ Only check auth once
    if (!authChecked.current) {
      authChecked.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  // Setup notification listener
  useEffect(() => {
    const cleanup = setupAutoNotificationListener((event) => {
      console.log("🔔 New order notification received:", event);
      
      const newNotification = {
        id: `order-${event.order_id}-${Date.now()}`,
        title: event.title || 'New Order',
        description: event.message || 'You have a new order',
        type: 'order',
        priority: 'high',
        read: false,
        time: event.order_time || new Date().toISOString(),
        data: {
          orderId: event.order_id,
          link: `/orders/${event.order_id}`,
        },
      };

      // Add notification to store (this updates the UI)
      addNotification(newNotification);

      // Show custom green toast with title, time, and message
      if (window.showCustomToast) {
        window.showCustomToast({
          title: event.title || 'New Order',
          message: event.message || 'You have a new order',
          time: event.order_time || new Date().toLocaleString(),
          duration: 5000
        });
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [addNotification]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AppRoutes />
      <CustomToast />
    </div>
  );
}

export default App;

// import React, { useEffect } from 'react'
// import AppRoutes from './routes/AppRoutes'
// import { useAuthStore } from './store/authStore'
// import { useUIStore } from './store/uiStore'
// import { setupAxiosInterceptors } from './services/axiosConfig'

// function App() {
//   const { theme } = useUIStore()
//   const { logout } = useAuthStore()

//   // // Debug: Log environment variables
//   // console.log('🔧 Environment Variables:')
//   // console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
//   // console.log('VITE_DATA_SOURCE:', import.meta.env.VITE_DATA_SOURCE)
//   // console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME)

//   useEffect(() => {
//     // Apply theme to root element
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [theme])

//   useEffect(() => {
//     // Setup axios interceptors
//     setupAxiosInterceptors(logout)
//   }, [logout])

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       <AppRoutes />
//     </div>
//   )
// }

// export default App