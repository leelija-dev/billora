import { useCallback, useMemo } from 'react'
import { usePermissionStore, PERMISSIONS, PERMISSION_GROUPS } from '../store/permissionStore'

/**
 * Hook for checking individual permissions
 */
export const usePermission = (permission) => {
  const { hasPermission, loading, error } = usePermissionStore()
  
  const canAccess = useMemo(() => {
    if (loading) return false
    return hasPermission(permission)
  }, [hasPermission, permission, loading])

  return { canAccess, loading, error }
}

/**
 * Hook for checking feature access
 */
export const useFeatureAccess = (feature) => {
  const { canAccess, loading, error } = usePermissionStore()
  
  const hasAccess = useMemo(() => {
    if (loading) return false
    return canAccess(feature)
  }, [canAccess, feature, loading])

  return { hasAccess, loading, error }
}

/**
 * Hook for checking multiple permissions
 */
export const usePermissions = (permissions) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, loading, error } = usePermissionStore()
  
  const results = useMemo(() => {
    if (loading) return {
      all: false,
      any: false,
      individual: {}
    }

    return {
      all: hasAllPermissions(permissions),
      any: hasAnyPermission(permissions),
      individual: permissions.reduce((acc, perm) => {
        acc[perm] = hasPermission(perm)
        return acc
      }, {})
    }
  }, [hasPermission, hasAllPermissions, hasAnyPermission, permissions, loading])

  return results
}

/**
 * Hook for permission groups
 */
export const usePermissionGroup = (groupName) => {
  const { hasPermissionGroup, getPermissionLevel, loading, error } = usePermissionStore()
  
  const groupInfo = useMemo(() => {
    if (loading) return {
      hasGroup: false,
      level: 'NONE',
      permissions: []
    }

    return {
      hasGroup: hasPermissionGroup(groupName),
      level: getPermissionLevel(),
      permissions: PERMISSION_GROUPS[groupName?.toUpperCase()] || []
    }
  }, [hasPermissionGroup, getPermissionLevel, groupName, loading])

  return groupInfo
}

/**
 * Hook for permission-based component rendering
 */
export const usePermissionsGuard = (requiredPermissions, requireAll = true) => {
  const { hasAllPermissions, hasAnyPermission, loading, error } = usePermissionStore()
  
  const canRender = useMemo(() => {
    if (loading) return false
    
    if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
      return true // No permissions required
    }

    return requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)
  }, [hasAllPermissions, hasAnyPermission, requiredPermissions, requireAll, loading])

  return { canRender, loading, error }
}

/**
 * Hook for permission-based navigation
 */
export const useNavigationPermissions = () => {
  const { canAccess, loading, error } = usePermissionStore()
  
  const navigationItems = useMemo(() => {
    if (loading) return []

    const items = [
      { path: '/dashboard', name: 'Dashboard', permission: PERMISSIONS.DASHBOARD },
      { path: '/products', name: 'Products', permission: PERMISSIONS.PRODUCT_MANAGEMENT },
      { path: '/categories', name: 'Categories', permission: PERMISSIONS.CATEGORIES },
      { path: '/units', name: 'Units', permission: PERMISSIONS.UNITS },
      { path: '/stores', name: 'Stores', permission: PERMISSIONS.STORES },
      { path: '/stock', name: 'Stock', permission: PERMISSIONS.STOCK_MANAGEMENT },
      { path: '/orders', name: 'Orders', permission: PERMISSIONS.ORDERS },
      { path: '/customers', name: 'Customers', permission: PERMISSIONS.CUSTOMER_MANAGEMENT },
      { path: '/invoices', name: 'Invoices', permission: PERMISSIONS.BILL_GENERATION },
      { path: '/reports', name: 'Reports', permission: PERMISSIONS.REPORTS },
      { path: '/billing', name: 'Billing', permission: PERMISSIONS.BILL_GENERATION },
      { path: '/settings', name: 'Settings', permission: PERMISSIONS.SETTINGS },
    ]

    return items.filter(item => !item.permission || canAccess(item.permission))
  }, [canAccess, loading])

  return { navigationItems, loading, error }
}

/**
 * Hook for permission debugging and monitoring
 */
export const usePermissionDebug = () => {
  const { 
    user, 
    permissions, 
    plan, 
    loading, 
    error, 
    lastFetched, 
    needsRefresh,
    refreshPermissions 
  } = usePermissionStore()

  const debugInfo = useMemo(() => ({
    user: user ? {
      id: user.id,
      email: user.email,
      planId: user.plan_id
    } : null,
    plan: plan ? {
      id: plan.id,
      name: plan.name,
      slug: plan.slug
    } : null,
    permissions: {
      count: permissions.length,
      slugs: permissions.map(p => p.slug),
      details: permissions
    },
    loading,
    error,
    lastFetched,
    needsRefresh: needsRefresh(),
    permissionLevel: usePermissionStore.getState().getPermissionLevel()
  }), [user, plan, permissions, loading, error, lastFetched, needsRefresh])

  return {
    debugInfo,
    refreshPermissions
  }
}

// Export constants for easy access
export { PERMISSIONS, PERMISSION_GROUPS }
