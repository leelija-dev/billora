import apiClient from './client';

export const customersAPI = {
  getCustomers: async (params = {}) => {
    try {
      const response = await apiClient.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomer: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await apiClient.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchCustomers: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/customers/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomerOrders: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/customers/${id}/orders`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomerStats: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
