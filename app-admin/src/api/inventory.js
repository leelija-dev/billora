import apiClient from './client';

export const inventoryAPI = {
  getInventory: async (params = {}) => {
    try {
      const response = await apiClient.get('/inventory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStockItem: async (id) => {
    try {
      const response = await apiClient.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStock: async (id, stockData) => {
    try {
      const response = await apiClient.put(`/inventory/${id}`, stockData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStockMovements: async (params = {}) => {
    try {
      const response = await apiClient.get('/inventory/movements', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createStockMovement: async (movementData) => {
    try {
      const response = await apiClient.post('/inventory/movements', movementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLowStockItems: async () => {
    try {
      const response = await apiClient.get('/inventory/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInventoryStats: async () => {
    try {
      const response = await apiClient.get('/inventory/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  adjustStock: async (id, adjustmentData) => {
    try {
      const response = await apiClient.post(`/inventory/${id}/adjust`, adjustmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  transferStock: async (transferData) => {
    try {
      const response = await apiClient.post('/inventory/transfer', transferData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
