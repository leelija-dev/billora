import { apiClient } from './apiClient';

export const stocksAPI = {
  // Get all stocks with search
  getAll: (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get(`/stocks${params}`);
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
    console.log(' Stocks API - Updating stock:', id, stockData)
    return apiClient.put(`/stocks/${id}`, stockData)
  },

  // Delete stock
  delete: (id, userId) => {
    console.log(' Stocks API - Deleting stock:', id, 'User ID:', userId)
    return apiClient.delete(`/stocks/${id}`, { 
      data: { user_id: userId }
    })
  },

  // Add stock / update stock
  addStock: (id, userId, quantity) => {
    console.log(' Stocks API - Adding stock to:', id, 'User:', userId, 'Quantity:', quantity)
    return apiClient.post(`/stocks/add-stock/${id}`, { 
      user_id: userId, 
      quantity: quantity 
    })
  },
}
