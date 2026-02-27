import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, company, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const hasPermission = (permission) => {
    // Implement permission checking logic based on user role
    return true
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  return {
    isAuthenticated,
    user,
    company,
    logout,
    hasPermission,
    isAdmin,
  }
}