import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const setupAxiosInterceptors = (logoutCallback) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().tokens?.access
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshSuccessful = await useAuthStore.getState().refreshToken()
          if (refreshSuccessful) {
            const newToken = useAuthStore.getState().tokens?.access
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          logoutCallback()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}

export default api