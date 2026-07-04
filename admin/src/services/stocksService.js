import { apiClient } from './apiClient';

export const stocksAPI = {
  // Get all stocks with search and filters
  getAll: (search = '', page = 1, filters = {}) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.append('search', search.trim().replace(/\s+/g, '-'));
    }
    
    if (page) {
      params.append('page', page);
    }
    
    // Add filter parameters
    if (filters.stock) {
      params.append('stock', filters.stock);
    }
    
    if (filters.product) {
      params.append('product', filters.product);
    }
    
    if (filters.seller) {
      params.append('seller', filters.seller);
    }
    
    const queryString = params.toString();
   
    const url = queryString ? `/stocks?${queryString}` : '/stocks';
    
    return apiClient.get(url);
  },

  // Get single stock
  getById: (id) => {
    return apiClient.get(`/stocks/${id}`)
  },
  // In your stocksAPI object
deleteStockQuantity: (id, userId, quantity) => {
  console.log('📦 Stocks API - Removing stock from:', id, 'User:', userId, 'Quantity:', quantity)
  return apiClient.post(`/stocks/delete-stock/${id}`, { 
    user_id: userId, 
    quantity: quantity 
  })
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
