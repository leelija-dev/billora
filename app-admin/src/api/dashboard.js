import apiClient from './client';
import { mockDashboard } from './mock/dashboard';

// Get dashboard data based on project mode
const getDashboardData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockDashboard : apiClient;
};

export const dashboardAPI = {
  getOverview: async () => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRevenueStats: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/revenue', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSalesStats: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTopProducts: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/top-products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTopCustomers: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/top-customers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentOrders: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/recent-orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInventoryAlerts: async () => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/inventory-alerts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrderStats: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/order-stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomerGrowth: async (params = {}) => {
    try {
      const api = getDashboardData();
      const response = await api.get('/dashboard/customer-growth', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
