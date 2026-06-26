import { apiClient } from './apiClient';

export const categoriesAPI = {
  // Get all categories with pagination and search
  getAll: (page = 1, filters = {}) => {
    const params = new URLSearchParams()
    
    if (page) params.append('page', page)
    if (filters.search) params.append('search', filters.search)
    
    // Handle status filter - convert to proper format
    if (filters.status !== undefined && filters.status !== '') {
      // Ensure status is sent as a number (0 or 1)
      const statusValue = Number(filters.status)
      if (!isNaN(statusValue)) {
        params.append('status', statusValue)
      }
    }
    
    // Also support other filters if needed
    if (filters.name) params.append('name', filters.name)
    if (filters.description) params.append('description', filters.description)
    if (filters.slug) params.append('slug', filters.slug)
    
    console.log('API Request URL:', `/categories?${params.toString()}`)
    
    return apiClient.get(`/categories?${params.toString()}`)
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

// Export as default for consistency
const categoriesService = categoriesAPI
export default categoriesService