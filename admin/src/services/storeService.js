import { apiClient } from './apiClient';

export const storeAPI = {
  // Get store by user ID
  getByUserId: (userId, search = '') => {
    const params = search ? { search } : {}
    return apiClient.get(`/store/${userId}`, { params })
  },

  // Create store
  create: (storeData) => {
    return apiClient.post('/store/store', storeData)
  },

  // Get single store for editing
  getById: (id) => {
    return apiClient.get(`/store/edit/${id}`)
  },

  // Update store
  update: (id, storeData) => {
    return apiClient.put(`/store/${id}`, storeData)
  },

  // Delete store
  delete: (id) => {
    return apiClient.delete(`/store/${id}`)
  },
}
