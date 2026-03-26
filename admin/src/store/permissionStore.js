import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

// Permission constants for type safety and scalability
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

export const usePermissionStore = create(
  persist(
    (set, get) => ({
      user: null,
      plan: null,
      permissions: [],
      loading: false,
      error: null,
      permissionsFetched: false,
      lastFetched: null, // Track when permissions were last fetched
      retryCount: 0, // Track retry attempts
      maxRetries: 3, // Maximum retry attempts

      // Set user data from login
      setUser: (userData) => {
        set({ 
          user: userData,
          error: null,
          retryCount: 0 // Reset retry count on new user
        })
      },

      // Fetch user plan and permissions with retry logic
      fetchUserPermissions: async (userId, retryAttempt = 0) => {
        try {
          const state = get()
          
          // Prevent duplicate fetches
          if (state.loading && retryAttempt === 0) {
            console.log('🔄 Permission fetch already in progress, skipping duplicate request')
            return
          }

          set({ loading: true, error: null })
          
          const { user } = get()
          
          if (!user?.plan_id) {
            console.warn('⚠️ No plan_id found for user')
            set({ 
              loading: false,
              permissionsFetched: true,
              lastFetched: new Date().toISOString()
            })
            return
          }
          
          console.log(`🔐 Fetching permissions (attempt ${retryAttempt + 1}/${state.maxRetries + 1})`)
          
          // Get user plan details
          const planResponse = await authService.getPlanDetails(user.plan_id)
          
          if (planResponse.data?.status && planResponse.data?.['Single Plan']) {
            const planData = planResponse.data['Single Plan']
            
            // Try to get permissions from different possible fields
            let permissions = planResponse.data.permissionNames || []
            
            // If permissionNames is empty, try to extract from features
            if (permissions.length === 0 && planData.features) {
              console.log('📦 permissionNames is empty, checking features:', planData.features)
              
              // Check if features contain permission objects
              const featurePermissions = planData.features.filter(feature => 
                feature && (feature.slug || feature.permission_name)
              )
              
              if (featurePermissions.length > 0) {
                permissions = featurePermissions.map(feature => ({
                  id: feature.id,
                  permission_name: feature.permission_name || feature.name,
                  slug: feature.slug,
                  description: feature.description
                }))
                console.log('✅ Extracted permissions from features:', permissions)
              }
            }
            
            // Validate permissions structure
            const validatedPermissions = permissions.filter(p => 
              p && typeof p === 'object' && p.slug && typeof p.slug === 'string'
            )
            
            if (validatedPermissions.length !== permissions.length) {
              console.warn(`⚠️ Filtered out ${permissions.length - validatedPermissions.length} invalid permissions`)
            }
            
            set({
              plan: planData,
              permissions: validatedPermissions,
              loading: false,
              permissionsFetched: true,
              lastFetched: new Date().toISOString(),
              retryCount: 0,
              error: null
            })
            
            // Update user with permissions
            if (user) {
              set({
                user: {
                  ...user,
                  permissions: validatedPermissions,
                  plan: planData
                }
              })
            }
            
            console.log(`✅ Successfully loaded ${validatedPermissions.length} permissions`)
          } else {
            throw new Error('Invalid plan response structure')
          }
        } catch (error) {
          console.error(`❌ Failed to fetch user permissions (attempt ${retryAttempt + 1}):`, error)
          
          const state = get()
          
          // Implement retry logic
          if (retryAttempt < state.maxRetries) {
            console.log(`🔄 Retrying permission fetch in ${1000 * (retryAttempt + 1)}ms...`)
            
            setTimeout(() => {
              get().fetchUserPermissions(userId, retryAttempt + 1)
            }, 1000 * (retryAttempt + 1))
            
            set({ retryCount: retryAttempt + 1 })
            return
          }
          
          // Max retries reached, set error state
          set({ 
            error: `Failed to fetch permissions after ${state.maxRetries + 1} attempts: ${error.message}`,
            loading: false,
            permissionsFetched: true,
            lastFetched: new Date().toISOString(),
            retryCount: state.maxRetries
          })
        }
      },

      // Check if user has specific permission
      hasPermission: (permissionSlug) => {
        const { permissions } = get()
        if (!permissionSlug || typeof permissionSlug !== 'string') {
          console.warn('⚠️ Invalid permission slug provided:', permissionSlug)
          return false
        }
        return permissions.some(permission => permission.slug === permissionSlug)
      },

      // Check if user can access specific feature with improved mapping
      canAccess: (feature) => {
        const { permissions } = get()
        
        if (!feature || typeof feature !== 'string') {
          console.warn('⚠️ Invalid feature provided:', feature)
          return false
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
        if (!requiredPermission) {
          console.warn(`⚠️ No permission mapping found for feature: ${feature}`)
          return false // Default to deny for unmapped features
        }
        
        return get().hasPermission(requiredPermission)
      },

      // Check if user has any of the specified permissions
      hasAnyPermission: (permissionSlugs) => {
        if (!Array.isArray(permissionSlugs)) {
          console.warn('⚠️ hasAnyPermission expects an array of permission slugs')
          return false
        }
        return permissionSlugs.some(slug => get().hasPermission(slug))
      },

      // Check if user has all of the specified permissions
      hasAllPermissions: (permissionSlugs) => {
        if (!Array.isArray(permissionSlugs)) {
          console.warn('⚠️ hasAllPermissions expects an array of permission slugs')
          return false
        }
        return permissionSlugs.every(slug => get().hasPermission(slug))
      },

      // Check if user belongs to a permission group
      hasPermissionGroup: (groupName) => {
        const groupPermissions = PERMISSION_GROUPS[groupName?.toUpperCase()]
        if (!groupPermissions) {
          console.warn(`⚠️ Unknown permission group: ${groupName}`)
          return false
        }
        return get().hasAllPermissions(groupPermissions)
      },

      // Get user's effective permission level
      getPermissionLevel: () => {
        const { permissions } = get()
        const permissionSlugs = permissions.map(p => p.slug)
        
        if (get().hasPermissionGroup('ENTERPRISE')) return 'ENTERPRISE'
        if (get().hasPermissionGroup('PREMIUM')) return 'PREMIUM'
        if (get().hasPermissionGroup('STANDARD')) return 'STANDARD'
        if (get().hasPermissionGroup('BASIC')) return 'BASIC'
        return 'NONE'
      },

      // Refresh permissions (force refetch)
      refreshPermissions: async () => {
        const { user } = get()
        if (user?.id) {
          console.log('🔄 Refreshing permissions...')
          await get().fetchUserPermissions(user.id)
        }
      },

      // Check if permissions need refresh (older than 5 minutes)
      needsRefresh: () => {
        const { lastFetched, permissionsFetched } = get()
        if (!lastFetched || !permissionsFetched) return true
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        return new Date(lastFetched) < fiveMinutesAgo
      },

      // Get current user with permissions
      getCurrentUser: () => {
        return get().user
      },

      // Clear permissions on logout
      clearPermissions: () => {
        set({
          user: null,
          plan: null,
          permissions: [],
          loading: false,
          error: null,
          permissionsFetched: false,
          lastFetched: null,
          retryCount: 0
        })
      }
    }),
    {
      name: 'permission-storage',
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        permissions: state.permissions,
        permissionsFetched: state.permissionsFetched,
        lastFetched: state.lastFetched
      })
    }
  )
)
