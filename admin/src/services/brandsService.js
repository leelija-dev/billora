import { apiClient } from './apiClient';

export const brandsAPI = {
  // Get all brands
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return apiClient.get('/brands', { params })
  },

  // Get single brand
  getById: (id) => {
    return apiClient.get(`/brands/${id}`)
  },

  // Create brand
  create: (brandData) => {
    return apiClient.post('/brands/store', brandData)
  },

  // Update brand
  update: (id, brandData) => {
    return apiClient.post(`/brands/${id}`, brandData)
  },

  // Delete brand
  delete: (id) => {
    return apiClient.delete(`/brands/${id}`)
  },
}
