import apiClient from './client';

export const productsAPI = {
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchProducts: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/products/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductCategories: async () => {
    try {
      const response = await apiClient.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStock: async (id, stockData) => {
    try {
      const response = await apiClient.patch(`/products/${id}/stock`, stockData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
