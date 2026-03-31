import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePermissionsGuard } from '../../../hooks/usePermissions'
import LoadingSpinner from '../../common/Spinner/Spinner'
import EmptyState from '../../common/EmptyState/EmptyState'
import { FiLock, FiShield, FiAlertTriangle } from 'react-icons/fi'

const PermissionGuard = ({ 
  children, 
  permissions, 
  requireAll = true,
  fallback = null,
  showAccessDenied = true,
  loadingComponent = null,
  deniedMessage = null,
  deniedTitle = null,
  deniedIcon = null
}) => {
  const { canRender, loading, error } = usePermissionsGuard(permissions, requireAll)

  // Show loading state
  if (loading) {
    if (loadingComponent) {
      return loadingComponent
    }
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <EmptyState
          icon={FiAlertTriangle}
          title="Permission Error"
          description={error}
          size="small"
        />
      </div>
    )
  }

  // Show content if user has permissions
  if (canRender) {
    return <>{children}</>
  }

  // Show fallback or access denied message
  if (fallback) {
    return <>{fallback}</>
  }

  if (showAccessDenied) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center p-8"
        >
          <EmptyState
            icon={deniedIcon || FiLock}
            title={deniedTitle || 'Access Denied'}
            description={
              deniedMessage || 
              `You don't have the required permissions to access this content.`
            }
            size="small"
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return null
}

// Specialized guards for common use cases
export const FeatureGuard = ({ 
  feature, 
  children, 
  ...props 
}) => {
  const FeatureGuardWrapper = ({ children: wrapperChildren }) => {
    const { hasAccess, loading } = usePermissionsGuard([feature])
    
    if (loading) {
      return props.loadingComponent || (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="md" />
        </div>
      )
    }
    
    if (!hasAccess) {
      return props.fallback || (
        <EmptyState
          icon={FiShield}
          title="Feature Not Available"
          description={`This feature is not included in your current plan.`}
          size="small"
        />
      )
    }
    
    return <>{wrapperChildren}</>
  }
  
  return <FeatureGuardWrapper>{children}</FeatureGuardWrapper>
}

export const RoleGuard = ({ 
  role, 
  children, 
  ...props 
}) => {
  const RoleGuardWrapper = ({ children: wrapperChildren }) => {
    const { hasGroup, loading } = usePermissionsGuard([role])
    
    if (loading) {
      return props.loadingComponent || (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="md" />
        </div>
      )
    }
    
    if (!hasGroup) {
      return props.fallback || (
        <EmptyState
          icon={FiLock}
          title="Access Denied"
          description={`This content requires ${role} level access or higher.`}
          size="small"
        />
      )
    }
    
    return <>{wrapperChildren}</>
  }
  
  return <RoleGuardWrapper>{children}</RoleGuardWrapper>
}

// Higher-order component for wrapping existing components
export const withPermissionGuard = (Component, permissions, requireAll = true) => {
  return (props) => (
    <PermissionGuard 
      permissions={permissions} 
      requireAll={requireAll}
      showAccessDenied={false}
    >
      <Component {...props} />
    </PermissionGuard>
  )
}

// Higher-order component for feature-based guarding
export const withFeatureGuard = (Component, feature) => {
  return (props) => (
    <FeatureGuard feature={feature} showAccessDenied={false}>
      <Component {...props} />
    </FeatureGuard>
  )
}

export default PermissionGuard
