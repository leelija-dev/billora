import { apiClient } from './apiClient';

export const stocksAPI = {
  // Get all stocks
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return apiClient.get('/stocks', { params })
  },

  // Get single stock
  getById: (id) => {
    return apiClient.get(`/stocks/${id}`)
  },

  // Create stock
  create: (stockData) => {
    return apiClient.post('/stocks/store', stockData)
  },

  // Update stock
  update: (id, stockData) => {
    return apiClient.put(`/stocks/${id}`, stockData)
  },

  // Delete stock
  delete: (id) => {
    return apiClient.delete(`/stocks/${id}`)
  },

  // Add stock / update stock
  addStock: (id, quantity) => {
    return apiClient.post(`/stocks/add-stock/${id}`, { quantity })
  },
}
