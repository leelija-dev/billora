// import axios from 'axios'
// import { useAuthStore } from '../store/authStore'
// import { handleApiError } from '../utils/errorHandler' // Make sure this matches the filename

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().tokens?.access
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor for error handling and token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     // Handle 401 Unauthorized errors (token expired)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = useAuthStore.getState().tokens?.refresh
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
//             refresh: refreshToken,
//           })
          
//           const { access } = response.data
//           useAuthStore.getState().setTokens({ access, refresh: refreshToken })
          
//           originalRequest.headers.Authorization = `Bearer ${access}`
//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         // Refresh failed - logout user
//         useAuthStore.getState().logout()
//         window.location.href = '/login'
//         return Promise.reject(refreshError)
//       }
//     }

//     // Handle other errors
//     handleApiError(error)
//     return Promise.reject(error)
//   }
// )

// // API endpoints
// export const authAPI = {
//   login: (credentials) => api.post('/auth/login/', credentials),
//   register: (data) => api.post('/auth/register/', data),
//   refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
//   logout: () => api.post('/auth/logout/'),
//   me: () => api.get('/auth/me/'),
// }

// export const productsAPI = {
//   list: (params) => api.get('/products/', { params }),
//   create: (data) => api.post('/products/', data),
//   retrieve: (id) => api.get(`/products/${id}/`),
//   update: (id, data) => api.put(`/products/${id}/`, data),
//   partialUpdate: (id, data) => api.patch(`/products/${id}/`, data),
//   delete: (id) => api.delete(`/products/${id}/`),
// }

// export const ordersAPI = {
//   list: (params) => api.get('/orders/', { params }),
//   create: (data) => api.post('/orders/', data),
//   retrieve: (id) => api.get(`/orders/${id}/`),
//   update: (id, data) => api.put(`/orders/${id}/`, data),
//   partialUpdate: (id, data) => api.patch(`/orders/${id}/`, data),
//   delete: (id) => api.delete(`/orders/${id}/`),
//   updateStatus: (id, status) => api.patch(`/orders/${id}/`, { status }),
// }

// export const customersAPI = {
//   list: (params) => api.get('/customers/', { params }),
//   create: (data) => api.post('/customers/', data),
//   retrieve: (id) => api.get(`/customers/${id}/`),
//   update: (id, data) => api.put(`/customers/${id}/`, data),
//   partialUpdate: (id, data) => api.patch(`/customers/${id}/`, data),
//   delete: (id) => api.delete(`/customers/${id}/`),
// }

// export const inventoryAPI = {
//   list: (params) => api.get('/inventory/logs/', { params }),
//   add: (data) => api.post('/inventory/add/', data),
//   remove: (data) => api.post('/inventory/remove/', data),
//   stockLevels: () => api.get('/inventory/stock-levels/'),
//   lowStock: () => api.get('/inventory/low-stock/'),
// }

// export const invoicesAPI = {
//   list: (params) => api.get('/invoices/', { params }),
//   create: (data) => api.post('/invoices/', data),
//   retrieve: (id) => api.get(`/invoices/${id}/`),
//   update: (id, data) => api.put(`/invoices/${id}/`, data),
//   delete: (id) => api.delete(`/invoices/${id}/`),
//   download: (id) => api.get(`/invoices/${id}/download/`, { responseType: 'blob' }),
//   send: (id) => api.post(`/invoices/${id}/send/`),
// }

// export const billingAPI = {
//   subscription: () => api.get('/billing/subscription/'),
//   plans: () => api.get('/billing/plans/'),
//   payments: (params) => api.get('/billing/payments/', { params }),
//   upgrade: (plan) => api.post('/billing/upgrade/', { plan }),
//   cancel: () => api.post('/billing/cancel/'),
//   invoices: (params) => api.get('/billing/invoices/', { params }),
// }

// export const dashboardAPI = {
//   stats: () => api.get('/dashboard/stats/'),
//   revenue: (params) => api.get('/dashboard/revenue/', { params }),
//   recentOrders: () => api.get('/dashboard/recent-orders/'),
//   topProducts: () => api.get('/dashboard/top-products/'),
//   activity: () => api.get('/dashboard/activity/'),
// }

// export default api


import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { handleApiError } from '../utils/errorHandler'

// Import mock services - FIX THE IMPORT PATHS
import { mockAuth } from './mockData/mockAuth'  // Changed from * as mockAuth
import { mockProductService } from './mockData/mockProducts'
import { mockOrderService } from './mockData/mockOrders'
import { mockCustomerService } from './mockData/mockCustomers'
import { mockInventoryService } from './mockData/mockInventory'
import { mockInvoiceService } from './mockData/mockInvoices'
import { mockDashboardService } from './mockData/mockDashboard'
import { mockBillingService } from './mockData/mockBilling'

// Get data source from env
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const MOCK_API_DELAY = parseInt(import.meta.env.VITE_MOCK_API_DELAY) || 800

// Create axios instance for real API
const realApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
realApi.interceptors.request.use(
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
realApi.interceptors.response.use(
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
          return realApi(originalRequest)
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

// Mock API wrapper with delay simulation
const mockApiWrapper = (fn) => {
  return async (...args) => {
    console.log(`[Mock API] Calling ${fn.name || 'mock function'}`, args)
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY))
    try {
      const result = fn(...args)
      console.log(`[Mock API] Response:`, result)
      return { data: result }
    } catch (error) {
      console.error(`[Mock API] Error:`, error)
      throw {
        response: {
          status: 400,
          data: { message: error.message }
        }
      }
    }
  }
}

// Select API based on data source
const useMockApi = DATA_SOURCE === 'mock'
console.log(`🔧 API Mode: ${useMockApi ? 'MOCK' : 'REAL'} (${DATA_SOURCE})`)

// Auth endpoints - FIXED: using mockAuth directly, not mockAuth.mockAuth
export const authAPI = {
  login: useMockApi 
    ? mockApiWrapper((credentials) => {
        console.log('Mock login attempt with:', credentials)
        return mockAuth.login(credentials.email, credentials.password)
      })
    : (credentials) => realApi.post('/auth/login/', credentials),
    
  register: useMockApi
    ? mockApiWrapper((data) => mockAuth.register(data))
    : (data) => realApi.post('/auth/register/', data),
    
  refresh: useMockApi
    ? mockApiWrapper((refreshToken) => mockAuth.refreshToken(refreshToken))
    : (refresh) => realApi.post('/auth/refresh/', { refresh }),
    
  logout: useMockApi
    ? mockApiWrapper(() => ({ success: true }))
    : () => realApi.post('/auth/logout/'),
    
  me: useMockApi
    ? mockApiWrapper(() => mockAuth.getCurrentUser())
    : () => realApi.get('/auth/me/'),
}

// Products endpoints
export const productsAPI = {
  list: useMockApi
    ? mockApiWrapper((params) => mockProductService.list(params))
    : (params) => realApi.get('/products/', { params }),
    
  create: useMockApi
    ? mockApiWrapper((data) => mockProductService.create(data))
    : (data) => realApi.post('/products/', data),
    
  retrieve: useMockApi
    ? mockApiWrapper((id) => mockProductService.get(id))
    : (id) => realApi.get(`/products/${id}/`),
    
  update: useMockApi
    ? mockApiWrapper((id, data) => mockProductService.update(id, data))
    : (id, data) => realApi.put(`/products/${id}/`, data),
    
  delete: useMockApi
    ? mockApiWrapper((id) => mockProductService.delete(id))
    : (id) => realApi.delete(`/products/${id}/`),
}

// Orders endpoints
export const ordersAPI = {
  list: useMockApi
    ? mockApiWrapper((params) => mockOrderService.list(params))
    : (params) => realApi.get('/orders/', { params }),
    
  create: useMockApi
    ? mockApiWrapper((data) => mockOrderService.create(data))
    : (data) => realApi.post('/orders/', data),
    
  retrieve: useMockApi
    ? mockApiWrapper((id) => mockOrderService.get(id))
    : (id) => realApi.get(`/orders/${id}/`),
    
  updateStatus: useMockApi
    ? mockApiWrapper((id, status) => mockOrderService.updateStatus(id, status))
    : (id, status) => realApi.patch(`/orders/${id}/`, { status }),
}

// Customers endpoints
export const customersAPI = {
  list: useMockApi
    ? mockApiWrapper((params) => mockCustomerService.list(params))
    : (params) => realApi.get('/customers/', { params }),
    
  create: useMockApi
    ? mockApiWrapper((data) => mockCustomerService.create(data))
    : (data) => realApi.post('/customers/', data),
    
  retrieve: useMockApi
    ? mockApiWrapper((id) => mockCustomerService.get(id))
    : (id) => realApi.get(`/customers/${id}/`),
    
  update: useMockApi
    ? mockApiWrapper((id, data) => mockCustomerService.update(id, data))
    : (id, data) => realApi.put(`/customers/${id}/`, data),
    
  delete: useMockApi
    ? mockApiWrapper((id) => mockCustomerService.delete(id))
    : (id) => realApi.delete(`/customers/${id}/`),
}

// Inventory endpoints
export const inventoryAPI = {
  list: useMockApi
    ? mockApiWrapper((params) => mockInventoryService.list(params))
    : (params) => realApi.get('/inventory/logs/', { params }),
    
  add: useMockApi
    ? mockApiWrapper((data) => mockInventoryService.addStock(data))
    : (data) => realApi.post('/inventory/add/', data),
    
  remove: useMockApi
    ? mockApiWrapper((data) => mockInventoryService.removeStock(data))
    : (data) => realApi.post('/inventory/remove/', data),
    
  lowStock: useMockApi
    ? mockApiWrapper(() => mockInventoryService.getLowStock())
    : () => realApi.get('/inventory/low-stock/'),
}

// Dashboard endpoints
export const dashboardAPI = {
  stats: useMockApi
    ? mockApiWrapper(() => mockDashboardService.getStats())
    : () => realApi.get('/dashboard/stats/'),
    
  revenue: useMockApi
    ? mockApiWrapper((params) => mockDashboardService.getRevenueData(params?.period))
    : (params) => realApi.get('/dashboard/revenue/', { params }),
    
  recentOrders: useMockApi
    ? mockApiWrapper(() => mockDashboardService.getRecentOrders())
    : () => realApi.get('/dashboard/recent-orders/'),
    
  topProducts: useMockApi
    ? mockApiWrapper(() => mockDashboardService.getTopProducts())
    : () => realApi.get('/dashboard/top-products/'),
    
  activity: useMockApi
    ? mockApiWrapper(() => mockDashboardService.getActivityFeed())
    : () => realApi.get('/dashboard/activity/'),
}

// Billing endpoints
export const billingAPI = {
  subscription: useMockApi
    ? mockApiWrapper(() => mockBillingService.getSubscription())
    : () => realApi.get('/billing/subscription/'),
    
  plans: useMockApi
    ? mockApiWrapper(() => mockBillingService.getPlans())
    : () => realApi.get('/billing/plans/'),
    
  payments: useMockApi
    ? mockApiWrapper((params) => mockBillingService.getPayments(params))
    : (params) => realApi.get('/billing/payments/', { params }),
    
  upgrade: useMockApi
    ? mockApiWrapper((plan) => mockBillingService.upgrade(plan))
    : (plan) => realApi.post('/billing/upgrade/', { plan }),
    
  cancel: useMockApi
    ? mockApiWrapper(() => mockBillingService.cancel())
    : () => realApi.post('/billing/cancel/'),
}

// Invoices endpoints
export const invoicesAPI = {
  list: useMockApi
    ? mockApiWrapper((params) => mockInvoiceService.list(params))
    : (params) => realApi.get('/invoices/', { params }),
    
  create: useMockApi
    ? mockApiWrapper((data) => mockInvoiceService.create(data))
    : (data) => realApi.post('/invoices/', data),
    
  retrieve: useMockApi
    ? mockApiWrapper((id) => mockInvoiceService.get(id))
    : (id) => realApi.get(`/invoices/${id}/`),
    
  update: useMockApi
    ? mockApiWrapper((id, data) => mockInvoiceService.update(id, data))
    : (id, data) => realApi.put(`/invoices/${id}/`, data),
    
  markAsPaid: useMockApi
    ? mockApiWrapper((id) => mockInvoiceService.markAsPaid(id))
    : (id) => realApi.post(`/invoices/${id}/mark-paid/`),
}

const mockClient = {
  get: (url, config) => {
    const params = config?.params

    if (url === '/products/') return productsAPI.list(params)
    if (url?.startsWith('/products/') && url !== '/products/') {
      const id = url.replace('/products/', '').replace(/\/$/, '')
      return productsAPI.retrieve(id)
    }

    if (url === '/orders/') return ordersAPI.list(params)
    if (url?.startsWith('/orders/') && url !== '/orders/') {
      const id = url.replace('/orders/', '').replace(/\/$/, '')
      return ordersAPI.retrieve(id)
    }

    if (url === '/customers/') return customersAPI.list(params)
    if (url?.startsWith('/customers/') && url !== '/customers/') {
      const id = url.replace('/customers/', '').replace(/\/$/, '')
      return customersAPI.retrieve(id)
    }

    if (url === '/inventory/logs/') return inventoryAPI.list(params)
    if (url === '/inventory/low-stock/') return inventoryAPI.lowStock()

    if (url === '/invoices/') return invoicesAPI.list(params)
    if (url?.startsWith('/invoices/') && url !== '/invoices/') {
      const id = url.replace('/invoices/', '').replace(/\/$/, '')
      return invoicesAPI.retrieve(id)
    }

    if (url === '/dashboard/stats/') return dashboardAPI.stats()
    if (url === '/dashboard/revenue/') return dashboardAPI.revenue(params)
    if (url === '/dashboard/recent-orders/') return dashboardAPI.recentOrders()
    if (url === '/dashboard/top-products/') return dashboardAPI.topProducts()
    if (url === '/dashboard/activity/') return dashboardAPI.activity()

    return Promise.reject(new Error(`Mock API route not implemented: GET ${url}`))
  },
  post: (url, data) => {
    if (url === '/products/') return productsAPI.create(data)
    if (url === '/orders/') return ordersAPI.create(data)
    if (url === '/customers/') return customersAPI.create(data)
    if (url === '/inventory/add/') return inventoryAPI.add(data)
    if (url === '/inventory/remove/') return inventoryAPI.remove(data)
    if (url === '/invoices/') return invoicesAPI.create(data)

    if (url === '/auth/login/') return authAPI.login(data)
    if (url === '/auth/register/') return authAPI.register(data)
    if (url === '/auth/refresh/') return authAPI.refresh(data?.refresh)
    if (url === '/auth/logout/') return authAPI.logout()

    if (url?.startsWith('/invoices/') && url?.endsWith('/mark-paid/')) {
      const id = url.replace('/invoices/', '').replace('/mark-paid/', '').replace(/\/$/, '')
      return invoicesAPI.markAsPaid(id)
    }

    return Promise.reject(new Error(`Mock API route not implemented: POST ${url}`))
  },
  put: (url, data) => {
    if (url?.startsWith('/products/')) {
      const id = url.replace('/products/', '').replace(/\/$/, '')
      return productsAPI.update(id, data)
    }
    if (url?.startsWith('/customers/')) {
      const id = url.replace('/customers/', '').replace(/\/$/, '')
      return customersAPI.update(id, data)
    }
    return Promise.reject(new Error(`Mock API route not implemented: PUT ${url}`))
  },
  patch: (url, data) => {
    if (url?.startsWith('/orders/')) {
      const id = url.replace('/orders/', '').replace(/\/$/, '')
      return ordersAPI.updateStatus(id, data?.status)
    }
    return Promise.reject(new Error(`Mock API route not implemented: PATCH ${url}`))
  },
  delete: (url) => {
    if (url?.startsWith('/products/')) {
      const id = url.replace('/products/', '').replace(/\/$/, '')
      return productsAPI.delete(id)
    }
    if (url?.startsWith('/customers/')) {
      const id = url.replace('/customers/', '').replace(/\/$/, '')
      return customersAPI.delete(id)
    }
    return Promise.reject(new Error(`Mock API route not implemented: DELETE ${url}`))
  },
 }

 export default (useMockApi ? mockClient : realApi)