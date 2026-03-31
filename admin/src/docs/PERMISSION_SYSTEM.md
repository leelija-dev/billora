# Permission System Documentation

## Overview

This is a comprehensive, scalable permission system that provides role-based access control (RBAC) for the application. It includes caching, retry logic, error handling, and easy-to-use hooks and components.

## Features

- ✅ **Permission-based access control** with granular permissions
- ✅ **Retry logic** with exponential backoff for failed API calls
- ✅ **Smart caching** with automatic refresh (5-minute TTL)
- ✅ **Permission groups** (BASIC, STANDARD, PREMIUM, ENTERPRISE)
- ✅ **Custom hooks** for easy permission checking
- ✅ **Component guards** for conditional rendering
- ✅ **Route protection** with upgrade prompts
- ✅ **Error handling** with user-friendly messages
- ✅ **Type safety** with permission constants
- ✅ **Debugging tools** for development

## Architecture

### Core Components

1. **Permission Store** (`src/store/permissionStore.js`)
   - Central state management for permissions
   - Caching and persistence
   - API integration with retry logic

2. **Permission Hooks** (`src/hooks/usePermissions.js`)
   - Easy-to-use hooks for permission checking
   - Memoized for performance
   - Type-safe permission constants

3. **Permission Guard** (`src/components/features/Permissions/PermissionGuard.jsx`)
   - Conditional rendering components
   - Higher-order components
   - Specialized guards (FeatureGuard, RoleGuard)

4. **Protected Route** (`src/components/features/Auth/ProtectedRoute.jsx`)
   - Route-level protection
   - Auto-refresh capabilities
   - User-friendly error states

## Usage Examples

### Basic Permission Checking

```jsx
import { usePermission, PERMISSIONS } from '../../hooks/usePermissions'

function StockManagement() {
  const { canAccess } = usePermission(PERMISSIONS.STOCK_MANAGEMENT)
  
  if (!canAccess) {
    return <div>Access Denied</div>
  }
  
  return <StockContent />
}
```

### Feature Access Checking

```jsx
import { useFeatureAccess } from '../../hooks/usePermissions'

function InvoiceButton() {
  const { hasAccess } = useFeatureAccess('bill-generation')
  
  if (!hasAccess) return null
  
  return <button>Create Invoice</button>
}
```

### Multiple Permissions

```jsx
import { usePermissions } from '../../hooks/usePermissions'

function AdminPanel() {
  const { all } = usePermissions([
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.SYSTEM_SETTINGS
  ])
  
  if (!all) return <AccessDenied />
  
  return <AdminContent />
}
```

### Permission Groups

```jsx
import { usePermissionGroup } from '../../hooks/usePermissions'

function PremiumFeatures() {
  const { hasGroup } = usePermissionGroup('PREMIUM')
  
  if (!hasGroup) {
    return <UpgradePrompt />
  }
  
  return <PremiumContent />
}
```

### Component Guards

```jsx
import { PermissionGuard, FeatureGuard } from '../../components/features/Permissions/PermissionGuard'

function Dashboard() {
  return (
    <div>
      {/* Always visible */}
      <BasicStats />
      
      {/* Requires stock-management permission */}
      <PermissionGuard permissions={[PERMISSIONS.STOCK_MANAGEMENT]}>
        <StockOverview />
      </PermissionGuard>
      
      {/* Requires bill-generation permission */}
      <FeatureGuard feature="bill-generation">
        <InvoiceWidget />
      </FeatureGuard>
    </div>
  )
}
```

### Higher-Order Components

```jsx
import { withPermissionGuard, withFeatureGuard } from '../../components/features/Permissions/PermissionGuard'

// Wrap components with permission guards
const ProtectedSettings = withPermissionGuard(Settings, [PERMISSIONS.SETTINGS])
const ProtectedBilling = withFeatureGuard(Billing, 'billing-generation')

function App() {
  return (
    <Routes>
      <Route path="/settings" element={<ProtectedSettings />} />
      <Route path="/billing" element={<ProtectedBilling />} />
    </Routes>
  )
}
```

### Navigation with Permissions

```jsx
import { useNavigationPermissions } from '../../hooks/usePermissions'

function Sidebar() {
  const { navigationItems } = useNavigationPermissions()
  
  return (
    <nav>
      {navigationItems.map(item => (
        <NavLink key={item.path} to={item.path}>
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}
```

## Permission Constants

### Individual Permissions

```javascript
export const PERMISSIONS = {
  STOCK_MANAGEMENT: 'stock-management',
  BILL_GENERATION: 'bill-generation',
  REPORTS: 'reports',
  CUSTOMER_MANAGEMENT: 'customer-management',
  PRODUCT_MANAGEMENT: 'product-management',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  UNITS: 'units',
  STORES: 'stores'
}
```

### Permission Groups

```javascript
export const PERMISSION_GROUPS = {
  BASIC: [PERMISSIONS.DASHBOARD],
  STANDARD: [PERMISSIONS.DASHBOARD, PERMISSIONS.PRODUCT_MANAGEMENT, PERMISSIONS.CUSTOMER_MANAGEMENT],
  PREMIUM: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.PRODUCT_MANAGEMENT,
    PERMISSIONS.CUSTOMER_MANAGEMENT,
    PERMISSIONS.STOCK_MANAGEMENT,
    PERMISSIONS.BILL_GENERATION,
    PERMISSIONS.REPORTS
  ],
  ENTERPRISE: Object.values(PERMISSIONS)
}
```

## Store Methods

### Core Methods

- `hasPermission(slug)` - Check single permission
- `canAccess(feature)` - Check feature access
- `hasAnyPermission(slugs)` - Check if user has any of the permissions
- `hasAllPermissions(slugs)` - Check if user has all permissions
- `hasPermissionGroup(groupName)` - Check permission group membership
- `getPermissionLevel()` - Get user's permission level (BASIC/STANDARD/PREMIUM/ENTERPRISE)

### Utility Methods

- `refreshPermissions()` - Force refresh permissions
- `needsRefresh()` - Check if permissions need refresh (older than 5 minutes)
- `clearPermissions()` - Clear all permission data (logout)

## Route Protection

### Basic Route Protection

```jsx
<Route path="/stock" element={
  <ProtectedRoute feature="stock-management">
    <Inventory />
  </ProtectedRoute>
} />
```

### Advanced Route Protection

```jsx
<Route path="/admin" element={
  <ProtectedRoute 
    requiredPermission={PERMISSIONS.SYSTEM_SETTINGS}
    showUpgradePrompt={true}
  >
    <AdminPanel />
  </ProtectedRoute>
} />
```

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors** - Automatic retry with exponential backoff
2. **Invalid Permissions** - Validation and filtering
3. **Missing Data** - Graceful fallbacks
4. **User Feedback** - Clear error messages and actions

## Performance Optimizations

1. **Memoization** - All hooks are memoized for performance
2. **Caching** - Permissions cached with 5-minute TTL
3. **Duplicate Prevention** - Prevents multiple simultaneous fetches
4. **Lazy Loading** - Permissions fetched only when needed

## Debugging

Use the debug hook for development:

```jsx
import { usePermissionDebug } from '../../hooks/usePermissions'

function DebugPanel() {
  const { debugInfo, refreshPermissions } = usePermissionDebug()
  
  return (
    <div>
      <h3>Permission Debug Info</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      <button onClick={refreshPermissions}>Refresh</button>
    </div>
  )
}
```

## Best Practices

### 1. Use Permission Constants

Always use the `PERMISSIONS` constants instead of strings:

```jsx
// ✅ Good
const { canAccess } = usePermission(PERMISSIONS.STOCK_MANAGEMENT)

// ❌ Bad
const { canAccess } = usePermission('stock-management')
```

### 2. Use Appropriate Guards

- **PermissionGuard** - For component-level protection
- **FeatureGuard** - For feature-based protection
- **ProtectedRoute** - For route-level protection

### 3. Handle Loading States

Always handle loading states for better UX:

```jsx
function MyComponent() {
  const { canAccess, loading } = usePermission(PERMISSIONS.STOCK_MANAGEMENT)
  
  if (loading) return <Spinner />
  if (!canAccess) return <AccessDenied />
  
  return <Content />
}
```

### 4. Use Permission Groups

For complex permission requirements, use permission groups:

```jsx
// Instead of checking multiple permissions
const { all } = usePermissions([
  PERMISSIONS.PRODUCT_MANAGEMENT,
  PERMISSIONS.CUSTOMER_MANAGEMENT,
  PERMISSIONS.STOCK_MANAGEMENT
])

// Use permission groups
const { hasGroup } = usePermissionGroup('PREMIUM')
```

## Migration Guide

### From Basic Permission Checking

```jsx
// Before
function MyComponent() {
  const { canAccess } = usePermissionStore()
  const hasAccess = canAccess('stock-management')
  // ...
}

// After
function MyComponent() {
  const { canAccess } = usePermission(PERMISSIONS.STOCK_MANAGEMENT)
  // ...
}
```

### From Manual Route Protection

```jsx
// Before
<Route path="/stock" element={
  isAuthenticated && hasPermission('stock-management') ? 
    <Inventory /> : <Navigate to="/login" />
} />

// After
<Route path="/stock" element={
  <ProtectedRoute feature="stock-management">
    <Inventory />
  </ProtectedRoute>
} />
```

## Troubleshooting

### Common Issues

1. **Infinite Loading** - Check if `permissionsFetched` flag is set correctly
2. **Permissions Not Updating** - Use `refreshPermissions()` to force refresh
3. **Route Not Protected** - Ensure `ProtectedRoute` is properly configured
4. **Component Still Shows** - Check if you're using the correct permission constant

### Debug Steps

1. Check console for permission-related logs
2. Use `usePermissionDebug()` hook to inspect state
3. Verify API response structure
4. Check permission constants mapping

## Future Enhancements

- [ ] Role-based inheritance
- [ ] Time-based permissions
- [ ] Conditional permissions
- [ ] Permission audit logging
- [ ] Real-time permission updates
- [ ] Permission templates
