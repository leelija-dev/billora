import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { handleApiError } from '../utils/errorHandler' // Make sure this matches the filename

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
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

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().tokens?.refresh
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          useAuthStore.getState().setTokens({ access, refresh: refreshToken })
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    handleApiError(error)
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
}

export const productsAPI = {
  list: (params) => api.get('/products/', { params }),
  create: (data) => api.post('/products/', data),
  retrieve: (id) => api.get(`/products/${id}/`),
  update: (id, data) => api.put(`/products/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
}

export const ordersAPI = {
  list: (params) => api.get('/orders/', { params }),
  create: (data) => api.post('/orders/', data),
  retrieve: (id) => api.get(`/orders/${id}/`),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/orders/${id}/`, data),
  delete: (id) => api.delete(`/orders/${id}/`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/`, { status }),
}

export const customersAPI = {
  list: (params) => api.get('/customers/', { params }),
  create: (data) => api.post('/customers/', data),
  retrieve: (id) => api.get(`/customers/${id}/`),
  update: (id, data) => api.put(`/customers/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
}

export const inventoryAPI = {
  list: (params) => api.get('/inventory/logs/', { params }),
  add: (data) => api.post('/inventory/add/', data),
  remove: (data) => api.post('/inventory/remove/', data),
  stockLevels: () => api.get('/inventory/stock-levels/'),
  lowStock: () => api.get('/inventory/low-stock/'),
}

export const invoicesAPI = {
  list: (params) => api.get('/invoices/', { params }),
  create: (data) => api.post('/invoices/', data),
  retrieve: (id) => api.get(`/invoices/${id}/`),
  update: (id, data) => api.put(`/invoices/${id}/`, data),
  delete: (id) => api.delete(`/invoices/${id}/`),
  download: (id) => api.get(`/invoices/${id}/download/`, { responseType: 'blob' }),
  send: (id) => api.post(`/invoices/${id}/send/`),
}

export const billingAPI = {
  subscription: () => api.get('/billing/subscription/'),
  plans: () => api.get('/billing/plans/'),
  payments: (params) => api.get('/billing/payments/', { params }),
  upgrade: (plan) => api.post('/billing/upgrade/', { plan }),
  cancel: () => api.post('/billing/cancel/'),
  invoices: (params) => api.get('/billing/invoices/', { params }),
}

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats/'),
  revenue: (params) => api.get('/dashboard/revenue/', { params }),
  recentOrders: () => api.get('/dashboard/recent-orders/'),
  topProducts: () => api.get('/dashboard/top-products/'),
  activity: () => api.get('/dashboard/activity/'),
}

export default api