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
      const response = await api.get('/units', { params });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single unit
  getById: async (id) => {
    try {
      const api = getUnitsData();
      const response = await api.get(`/units/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new unit
  create: async (unitData) => {
    try {
      const api = getUnitsData();
      
      // Map frontend field names to API expected field names
      const payload = {
        user_id: unitData.userId || unitData.user_id,
        code: unitData.code,
        name: unitData.name,
        created_by: unitData.createdBy || unitData.userId || unitData.user_id,
      };
      
      console.log('Create Unit API payload:', payload);
      const response = await api.post('/units/store', payload);
      return response.data;
    } catch (error) {
      console.error('Create Unit API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update unit
  update: async (id, unitData) => {
    try {
      const api = getUnitsData();
      
      // Map frontend field names to API expected field names
      const payload = {
        code: unitData.code,
        name: unitData.name,
      };
      
      // Add user_id if provided (required for update)
      if (unitData.user_id) {
        payload.user_id = unitData.user_id;
      }
      
      console.log('Update Unit API payload:', payload);
      const response = await api.put(`/units/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update Unit API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete unit
  delete: async (id) => {
    try {
      const api = getUnitsData();
      const response = await api.delete(`/units/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search units (using the index endpoint with search parameter)
  search: async (query, filters = {}) => {
    try {
      const api = getUnitsData();
      const response = await api.get('/units', {
        params: { search: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};