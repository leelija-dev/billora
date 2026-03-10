import { apiClient } from './client';
import { mockUnits } from './mock/units';

// Get units data based on project mode
const getUnitsData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockUnits : apiClient;
};

export const unitsAPI = {
  // Get all units
  getAll: async (params = {}) => {
    try {
      const api = getUnitsData();
      const response = await api.get('/brands/units', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single unit
  getById: async (id) => {
    try {
      const api = getUnitsData();
      const response = await api.get(`/brands/units/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new unit
  create: async (unitData) => {
    try {
      const api = getUnitsData();
      const response = await api.post('/brands/units/store', {
        user_id: unitData.userId,
        code: unitData.code,
        name: unitData.name,
        created_by: unitData.createdBy,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update unit
  update: async (id, unitData) => {
    try {
      const api = getUnitsData();
      const response = await api.put(`/brands/units/${id}`, {
        code: unitData.code,
        name: unitData.name,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete unit
  delete: async (id) => {
    try {
      const api = getUnitsData();
      const response = await api.delete(`/brands/units/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search units (using the index endpoint with search parameter)
  search: async (query, filters = {}) => {
    try {
      const api = getUnitsData();
      const response = await api.get('/brands/units', {
        params: { search: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
