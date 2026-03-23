import { apiClient } from './apiClient';

export const unitsAPI = {
  // Get all units with pagination
  getAll: (page = 1, filters = {}) => {
    const params = new URLSearchParams()
    
    if (page) params.append('page', page)
    if (filters.search) params.append('search', filters.search)
    
    return apiClient.get(`/units?${params.toString()}`)
  },

  // Get single unit
  getById: (id) => {
    return apiClient.get(`/units/${id}`)
  },

  // Create unit
  create: (unitData) => {
    return apiClient.post('/units/store', unitData)
  },

  // Update unit
  update: (id, unitData) => {
    return apiClient.put(`/units/${id}`, unitData)
  },

  // Delete unit
  delete: (id) => {
    return apiClient.delete(`/units/${id}`)
  },
}

// Export as default for consistency
const unitsService = unitsAPI
export default unitsService
