import React, { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'
import { useUIStore } from './store/uiStore'
import { setupAxiosInterceptors } from './services/axiosConfig'

function App() {
  const { theme } = useUIStore()
  const { logout } = useAuthStore()

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