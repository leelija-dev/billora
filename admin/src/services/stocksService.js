import { apiClient } from './apiClient';

export const stocksAPI = {
  // Get all stocks with search
 getAll: (search = '', page = 1) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.append('search', search.trim().replace(/\s+/g, '-'));
    }
    
    if (page) {
      params.append('page', page);
    }
    const queryString = params.toString();
   
    const url = queryString ? `/stocks?${queryString}` : '/stocks';
    
    return apiClient.get(url);
  },

  // Get single stock
  getById: (id) => {
    return apiClient.get(`/stocks/${id}`)
  },

 // Create stock with FormData support
  create: (stockData) => {
    // Check if we're sending FormData
    if (stockData instanceof FormData) {
      return apiClient.post('/stocks/store', stockData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    // Regular JSON data
    return apiClient.post('/stocks/store', stockData)
  },

  // Update stock with FormData support
  update: (id, stockData) => {
    console.log('Stocks API - Updating stock:', id, stockData)
    if (stockData instanceof FormData) {
      return apiClient.post(`/stocks/${id}`, stockData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return apiClient.post(`/stocks/${id}`, stockData)
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
