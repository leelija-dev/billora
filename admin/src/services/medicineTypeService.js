import { apiClient } from './apiClient';

export const medicineTypeAPI = {
  // Get all medicine types for a user
  getAll: (userId) => {
    return apiClient.get(`/medicine-type/${userId}`)
  },

  // Get single medicine type
  getById: (id) => {
    return apiClient.get(`/medicine-type/edit/${id}`)
  },

  // Create medicine type
  create: (medicineTypeData) => {
    return apiClient.post('/medicine-type/store', medicineTypeData)
  },

  // Update medicine type
  update: (id, medicineTypeData) => {
    return apiClient.put(`/medicine-type/update/${id}`, medicineTypeData)
  },

  // Delete medicine type
  delete: (id) => {
    return apiClient.delete(`/medicine-type/delete/${id}`)
  },
}

// Export as default for consistency
const medicineTypeService = medicineTypeAPI
export default medicineTypeService
