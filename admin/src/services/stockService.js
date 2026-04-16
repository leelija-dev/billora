import { apiClient } from './apiClient';

export const stockAPI = {
  // Get all stocks with search
  getAll: (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get(`/stocks${params}`);
  },

  // Get single stock by id
  getById: (id) => {
    return apiClient.get(`/stocks/${id}`);
  },

  // Create new stock
  create: (stockData) => {
    return apiClient.post('/stocks/store', stockData);
  },

  // Update stock
  update: (id, stockData) => {
    return apiClient.put(`/stocks/${id}`, stockData);
  },

  // Delete stock
  delete: (id) => {
    return apiClient.delete(`/stocks/${id}`);
  },

  // Add stock to existing
  addStock: (id, userId, quantity) => {
    return apiClient.post(`/stocks/add-stock/${id}`, { 
      user_id: userId,
      quantity: quantity 
    });
  },
};

export default stockAPI;
