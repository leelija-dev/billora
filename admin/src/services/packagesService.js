import { apiClient } from './apiClient';

export const packagesAPI = {
  // Get all packages for a user
  getAll: (userId, page = 1, filters = {}) => {
    const params = new URLSearchParams()
    
    if (page) params.append('page', page)
    if (filters.search) params.append('search', filters.search)
    
    return apiClient.get(`/packages-cost/${userId}?${params.toString()}`)
  },

  // Get single package
  getById: (id) => {
    return apiClient.get(`/packages-cost/edit/${id}`)
  },

  // Create package
  create: (userId, packageData) => {
    return apiClient.post(`/packages-cost/store/${userId}`, packageData)
  },

  // Update package
  update: (id, packageData) => {
    return apiClient.put(`/packages-cost/update/${id}`, packageData)
  },

  // Delete package
  delete: (id) => {
    return apiClient.delete(`/packages-cost/delete/${id}`)
  },
}

// Export as default for consistency
const packagesService = packagesAPI
export default packagesService
