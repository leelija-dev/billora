import apiClient from './client';

export const ordersAPI = {
  getOrders: async (params = {}) => {
    try {
      const response = await apiClient.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrder: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await apiClient.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await apiClient.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrderStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/orders/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchOrders: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/orders/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateInvoice: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}/invoice`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
