import { apiClient } from './apiClient';

export const storeAPI = {
  // Get store/shop by user ID with enhanced filters
  getByUserId: (userId, filters = {}) => {
    const params = new URLSearchParams()
    
    // Add search parameter
    if (filters.search) {
      params.append('search', filters.search)
    }
    
    // Add status filter (0 or 1)
    if (filters.status !== undefined && filters.status !== '' && filters.status !== null) {
      const statusValue = Number(filters.status)
      if (!isNaN(statusValue) && (statusValue === 0 || statusValue === 1)) {
        params.append('status', statusValue)
      }
    }
    
    // Add date range filters
    if (filters.start_date) {
      params.append('start_date', filters.start_date)
    }
    if (filters.end_date) {
      params.append('end_date', filters.end_date)
    }
    
    // Add type filter if needed
    if (filters.type) {
      params.append('type', filters.type)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/store/${userId}?${queryString}` : `/store/${userId}`
    
    console.log('📡 API Request URL:', url)
    
    return apiClient.get(url)
  },

  // Register/save store/shop
  create: (storeData) => {
    return apiClient.post('/store/store', storeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Edit/show shop (GET method)
  getEditData: (userId) => {
    return apiClient.get(`/store/edit/${userId}`)
  },

  // Update shop
  update: (id, storeData) => {
    return apiClient.post(`/store/${id}`, storeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete shop
  delete: (id) => {
    return apiClient.delete(`/store/${id}`)
  },
}

// Export as default for consistency
const storeService = storeAPI
export default storeService