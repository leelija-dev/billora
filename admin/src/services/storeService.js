import { apiClient } from './apiClient';

export const storeAPI = {
  // Get store/shop by user ID
  getByUserId: (userId, search = '') => {
    const params = search ? { search } : {}
    return apiClient.get(`/store/${userId}`, { params })
  },

  // Register/save store/shop
  create: (storeData) => {
    // For FormData, set the correct headers
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
    // For FormData, set the correct headers
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