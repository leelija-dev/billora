import { apiClient } from './apiClient';

export const categoriesAPI = {
  // Get all categories
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return apiClient.get('/categories', { params })
  },

  // Get single category
  getById: (id) => {
    return apiClient.get(`/categories/${id}`)
  },

  // Create category
  create: (categoryData) => {
    return apiClient.post('/categories/store', categoryData)
  },

  // Update category
  update: (id, categoryData) => {
    return apiClient.put(`/categories/${id}`, categoryData)
  },

  // Delete category
  delete: (id) => {
    return apiClient.delete(`/categories/${id}`)
  },
}
