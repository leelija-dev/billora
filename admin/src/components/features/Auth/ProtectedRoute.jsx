import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { usePermissionStore, PERMISSIONS } from '../../../store/permissionStore'
import { useFeatureAccess, usePermissionDebug } from '../../../hooks/usePermissions'
import LoadingSpinner from '../../../components/common/Spinner/Spinner'
import EmptyState from '../../../components/common/EmptyState/EmptyState'
import { FiLock, FiShield, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  feature,
  fallbackPath = '/unauthorized',
  requireAll = true,
  showUpgradePrompt = true
}) => {
  const location = useLocation()
  const { isAuthenticated, isLoading, hasHydrated, checkAuth, hasActivePlan } = useAuthStore()
  
  console.log('🔍 ProtectedRoute - Current path:', location.pathname)
  console.log('🔍 ProtectedRoute - Auth state:', { isAuthenticated, isLoading, hasHydrated })
  const { 
    user, 
    permissions, 
    sidebarPermissions,
    loading: permissionLoading, 
    fetchUserPermissions, 
    permissionsFetched,
    needsRefresh,
    refreshPermissions,
    error: permissionError
  } = usePermissionStore()
  
  // Only use feature access if feature is provided
  const featureAccess = feature ? useFeatureAccess(feature) : { hasAccess: true, loading: false, error: null }
  const { hasAccess, loading: featureLoading, error: featureError } = featureAccess
  const { debugInfo } = usePermissionDebug()
  const [isChecking, setIsChecking] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (hasHydrated) {
      const isAuth = checkAuth()
      setIsChecking(false)
    }
  }, [hasHydrated, checkAuth])

  // Auto-refresh permissions if needed
  useEffect(() => {
    if (isAuthenticated && needsRefresh() && !permissionLoading && !refreshing) {
      console.log('� Auto-refreshing stale permissions...')
      refreshPermissions()
    }
  }, [isAuthenticated, needsRefresh, permissionLoading, refreshing])

  // Fetch permissions if not loaded and user has plan_id
  useEffect(() => {
    if (!permissionsFetched && user?.plan_id && !permissionLoading) {
      fetchUserPermissions(user.id)
    }
  }, [permissionsFetched, user?.plan_id, permissionLoading, fetchUserPermissions, user?.id])

  // Manual refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshPermissions()
    } finally {
      setRefreshing(false)
    }
  }

  // If no user, redirect to login (even if still loading or not hydrated)
  if (!isAuthenticated && !isLoading) {
    console.log('🔄 Redirecting to login - User not authenticated, current path:', location.pathname)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user is authenticated but doesn't have active plan, redirect to login
  if (isAuthenticated && location.pathname !== '/login') {
    let hasActivePlanStatus = false;
    
    if (hasHydrated) {
      hasActivePlanStatus = hasActivePlan();
      console.log('🔍 Using hydrated store for plan check:', hasActivePlanStatus);
    } else {
      const authState = useAuthStore.getState();
      hasActivePlanStatus = authState.hasActivePlanFromStorage();
      console.log('🔍 Using localStorage for plan check:', hasActivePlanStatus);
      console.log('🔍 User data from localStorage:', {
        user: authState.user,
        plan_id: authState.user?.plan_id,
        is_active: authState.user?.is_active
      });
    }
    
    if (!hasActivePlanStatus) {
      console.log('🔄 Redirecting to login - User authenticated but no active plan, current path:', location.pathname)
      return <Navigate to="/login" state={{ from: location }} replace />
    } else {
      console.log('✅ User has active plan, allowing access')
    }
  }

  // If still loading auth, show spinner
  if (isLoading || (isChecking && !isAuthenticated)) {
    console.log('🔄 Still loading auth...', { isLoading, isAuthenticated, hasHydrated, isChecking })
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If permissions are still loading, show spinner
  if (permissionLoading || (feature && featureLoading)) {
    console.log('🔄 Loading permissions...')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading permissions...</p>
        </div>
      </div>
    )
  }

  // Show permission error state
  if (permissionError || featureError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <EmptyState
          icon={FiAlertTriangle}
          title="Permission Error"
          description={permissionError || featureError || 'Failed to verify permissions'}
          action={
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Permissions'}</span>
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          }
        />
      </div>
    )
  }

  // Check specific permission
  if (requiredPermission) {
    const hasPermission = permissions.some(p => p.slug === requiredPermission)
    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <EmptyState
            icon={FiLock}
            title="Access Denied"
            description={`You don't have permission to access this feature. Required permission: ${requiredPermission}`}
            action={
              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
                {showUpgradePrompt && (
                  <button
                    onClick={() => window.location.href = '/billing'}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
            }
          />
        </div>
      )
    }
  }

  // Check feature access
  if (feature) {
    // Handle special hide-with-stock logic
    if (feature === 'hide-with-stock') {
      const hasStockPermission = permissions.some(p => p.slug === PERMISSIONS.STOCK_MANAGEMENT)
      if (hasStockPermission) {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <EmptyState
              icon={FiLock}
              title="Access Denied"
              description="Users with stock management permissions cannot access this feature."
              action={
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
              }
            />
          </div>
        )
      }
      // If user doesn't have stock permission, allow access
      return children || <Outlet />
    }

    const permissionMap = {
      'stock-management': PERMISSIONS.STOCK_MANAGEMENT,
      'billing': PERMISSIONS.BILL_GENERATION,
      'reports': PERMISSIONS.REPORTS,
      'customers': PERMISSIONS.CUSTOMER_MANAGEMENT,
      'products': PERMISSIONS.PRODUCT_MANAGEMENT,
      'invoices': PERMISSIONS.BILL_GENERATION,
      'bill-generation': PERMISSIONS.BILL_GENERATION,
      'dashboard': PERMISSIONS.DASHBOARD,
      'settings': PERMISSIONS.SETTINGS,
      'orders': PERMISSIONS.ORDERS,
      'categories': PERMISSIONS.CATEGORIES,
      'units': PERMISSIONS.UNITS,
      'stores': PERMISSIONS.STORES
    }
    
    const requiredPermission = permissionMap[feature]
    
    // Allow access to features that are available in the user's sidebar API
    const hasBasicAccess = sidebarPermissions.some(p => p.slug === feature)
    
    // Debug logging for billing access
    if (feature === 'billing') {
      console.log('🔍 Billing access check:', {
        feature,
        requiredPermission,
        hasAccess,
        hasBasicAccess,
        sidebarPermissions: sidebarPermissions.map(p => p.slug)
      })
    }
    
    if (requiredPermission && !hasAccess && !hasBasicAccess) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <EmptyState
            icon={FiShield}
            title="Feature Not Available"
            description={`This feature is not included in your current plan. Upgrade your plan to access ${feature}.`}
            action={
              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
                {showUpgradePrompt && (
                  <button
                    onClick={() => window.location.href = '/billing'}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
            }
          />
        </div>
      )
    }
  }

  // If children prop is provided, render it, otherwise render Outlet
  return children || <Outlet />
}

export default ProtectedRoute