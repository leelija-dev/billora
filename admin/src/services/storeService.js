import { apiClient } from './apiClient';

export const storeAPI = {
  // Get store/shop by user ID
  getByUserId: (userId, search = '') => {
    const params = search ? { search } : {}
    return apiClient.get(`/store/${userId}`, { params })
  },

  // Register/save store/shop
  create: (storeData) => {
    return apiClient.post('/store/store', storeData)
  },

  // Edit/show shop (POST method)
  getEditData: (userId) => {
    return apiClient.post(`/store/edit/${userId}`)
  },

  // Update shop
  update: (id, storeData) => {
    return apiClient.put(`/store/${id}`, storeData)
  },

  // Delete shop
  delete: (id) => {
    return apiClient.delete(`/store/${id}`)
  },
}

// Export as default for consistency
const storeService = storeAPI
export default storeService
