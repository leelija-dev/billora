import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setTokens: (tokens) => {
        set({ 
          tokens: {
            ...get().tokens,
            ...tokens
          }
        })
      },

      setHasHydrated: (state) => {
        set({ hasHydrated: state })
      },

      // Helper function to check if user is authenticated
      checkAuth: () => {
        const { tokens, user } = get()
        const hasToken = !!tokens?.access || !!tokens?.token
        const hasUser = !!user
        const isAuthenticated = hasToken && hasUser
        
        // Update auth state if needed
        if (get().isAuthenticated !== isAuthenticated) {
          set({ isAuthenticated })
        }
        
        return isAuthenticated
      },

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          console.log('Login attempt with:', credentials)
          const response = await authService.login(credentials)
          console.log('Login response:', response)
          
          // Handle your API's token structure
          const data = response.data
          const token = data.token // Your API returns a single token
          const user = data.user
          
          set({
            user,
            company: null, // Your API doesn't return company info
            tokens: { access: token, token: token }, // Store token in both formats for compatibility
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success('Login successful!')
          return { success: true }
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          toast.error(errorMessage)
          return { success: false, error: error.response?.data }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(userData)
          toast.success(response.data.message || 'Registration successful! Please login.')
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Registration failed')
          return { success: false, error: error.response?.data }
        }
      },

      logout: async () => {
        const { user } = get()
        
        // Try to call logout API but don't wait for it since token might be invalid
        if (user?.id) {
          authService.logout(user.id).catch(err => {
            console.log('Logout API call failed (expected if token expired):', err)
          })
        }
        
        // Clear local state immediately
        set({
          user: null,
          company: null,
          tokens: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('auth-storage')
        toast.success('Logged out successfully')
      },

      refreshToken: async () => {
        const { tokens } = get()
        if (!tokens?.refresh) return false

        try {
          const response = await authService.refreshToken(tokens.refresh)
          set({
            tokens: {
              ...tokens,
              access: response.data.access,
            },
          })
          return true
        } catch (error) {
          get().logout()
          return false
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      updateCompany: (companyData) => {
        set({ company: { ...get().company, ...companyData } })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Auth store rehydrating...', state)
        
        if (state) {
          // Check authentication state after rehydration
          const hasToken = !!state.tokens?.access || !!state.tokens?.token
          const hasUser = !!state.user
          const isAuthenticated = hasToken && hasUser
          
          console.log('🔐 Rehydration check:', {
            hasToken,
            hasUser,
            isAuthenticated,
            tokens: state.tokens,
            user: state.user
          })
          
          // Update isAuthenticated based on actual data
          state.isAuthenticated = isAuthenticated
          state.hasHydrated = true
        }
        
        console.log('✅ Auth store rehydrated')
      },
    }
  )
)