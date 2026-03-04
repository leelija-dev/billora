import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

// Get API URL from environment or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
const DATA_SOURCE = process.env.EXPO_PUBLIC_DATA_SOURCE || 'mock';
const MOCK_API_DELAY = parseInt(process.env.EXPO_PUBLIC_MOCK_API_DELAY) || 800;

// Import mock services
import { mockAuth } from './mockData/mockAuth';
import { mockProductService } from './mockData/mockProducts';
import { mockOrderService } from './mockData/mockOrders';
import { mockCustomerService } from './mockData/mockCustomers';
import { mockInventoryService } from './mockData/mockInventory';
import { mockInvoiceService } from './mockData/mockInvoices';
import { mockDashboardService } from './mockData/mockDashboard';
import { mockBillingService } from './mockData/mockBilling';

// Create axios instance for real API
const realApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
realApi.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
realApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          await SecureStore.setItemAsync('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return realApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Mock API wrapper with delay simulation
const mockApiWrapper = (fn) => {
  return async (...args) => {
    console.log(`[Mock API] Calling ${fn.name || 'mock function'}`, args);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    try {
      const result = fn(...args);
      console.log(`[Mock API] Response:`, result);
      return { data: result };
    } catch (error) {
      console.error(`[Mock API] Error:`, error);
      throw {
        response: {
          status: 400,
          data: { message: error.message }
        }
      };
    }
  };
};

// Select API based on data source
const useMockApi = DATA_SOURCE === 'mock';
console.log(`🔧 API Mode: ${useMockApi ? 'MOCK' : 'REAL'} (${DATA_SOURCE})`);

// Auth endpoints
export const authAPI = {
  login: useMockApi
    ? mockApiWrapper((credentials) => mockAuth.login(credentials.email, credentials.password))
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
    
  updateProfile: useMockApi
    ? mockApiWrapper((userData) => mockAuth.updateProfile(userData))
    : (userData) => realApi.put('/auth/profile/', userData),

  changePassword: useMockApi
    ? mockApiWrapper((passwordData) => mockAuth.changePassword(passwordData))
    : (passwordData) => realApi.post('/auth/change-password/', passwordData),
};

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
};

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
};

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
};

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
};

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
};

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
};

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

  delete: useMockApi
    ? mockApiWrapper((id) => mockInvoiceService.delete(id))
    : (id) => realApi.delete(`/invoices/${id}/`),
};

export default useMockApi ? null : realApi;