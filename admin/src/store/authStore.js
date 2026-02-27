import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (tokens) => {
        set({ 
          tokens: {
            ...get().tokens,
            ...tokens
          }
        })
      },

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          console.log('Login attempt with:', credentials)
          const response = await authAPI.login(credentials)
          console.log('Login response:', response)
          
          const { access, refresh, user, company } = response.data
          
          set({
            user,
            company,
            tokens: { access, refresh },
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

      register: async (companyData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register(companyData)
          toast.success(response.data.message || 'Registration successful! Please login.')
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Registration failed')
          return { success: false, error: error.response?.data }
        }
      },

      logout: () => {
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
          const response = await authAPI.refresh(tokens.refresh)
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
      getStorage: () => localStorage,
    }
  )
)