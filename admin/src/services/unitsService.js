import { apiClient } from './apiClient';

export const unitsAPI = {
  // Get all units
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return apiClient.get('/units', { params })
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
