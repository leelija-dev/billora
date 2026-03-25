import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, hasHydrated, checkAuth } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (hasHydrated) {
      // Check authentication state after hydration
      const isAuth = checkAuth()
      console.log('🔐 ProtectedRoute - Auth check after hydration:', { isAuth, hasHydrated })
      setIsChecking(false)
    }
  }, [hasHydrated, checkAuth])

  // Show loading while hydrating or checking
  if (isLoading || !hasHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  console.log('🔐 ProtectedRoute - Final decision:', { isAuthenticated, hasHydrated })

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute