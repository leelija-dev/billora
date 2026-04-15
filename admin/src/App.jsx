import React, { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'
import { useUIStore } from './store/uiStore'
import { setupAxiosInterceptors } from './services/axiosConfig'

function App() {
  const { theme } = useUIStore()
  const { logout } = useAuthStore()

  // // Debug: Log environment variables
  // console.log('🔧 Environment Variables:')
  // console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  // console.log('VITE_DATA_SOURCE:', import.meta.env.VITE_DATA_SOURCE)
  // console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME)

  useEffect(() => {
    // Apply theme to root element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Setup axios interceptors
    setupAxiosInterceptors(logout)
  }, [logout])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AppRoutes />
    </div>
  )
}

export default App