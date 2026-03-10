import { apiClient } from './client';
import { mockCategories } from './mock/categories';

// Get categories data based on project mode
const getCategoriesData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockCategories : apiClient;
};

export const categoriesAPI = {
  // Get all categories
  getAll: async (params = {}) => {
    try {
      const api = getCategoriesData();
      const response = await api.get('/categories', { params });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single category
  getById: async (id) => {
    try {
      const api = getCategoriesData();
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new category
   create: async (categoryData) => {
    try {
      const api = getCategoriesData();
      
      // Map frontend field names to API expected field names
      const payload = {
        user_id: categoryData.userId || categoryData.user_id,
        name: categoryData.name,
        is_active: categoryData.isActive ?? true,
        created_by: categoryData.createdBy || categoryData.userId || categoryData.user_id,
        description: categoryData.description || '',
      };
      
      console.log('Create API payload:', payload);
      const response = await api.post('/categories/store', payload);
      return response.data;
    } catch (error) {
      console.error('Create API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const api = getCategoriesData();
      
      // Map frontend field names to API expected field names
      const payload = {
        name: categoryData.name,
        is_active: categoryData.isActive ?? categoryData.is_active,
        description: categoryData.description || '',
      };
      
      // Add user_id if provided (required for update)
      if (categoryData.user_id) {
        payload.user_id = categoryData.user_id;
      }
      
      console.log('Update API payload:', payload);
      const response = await api.put(`/categories/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update API error:', error.response?.data || error.message);
      throw error;
    }
  },


  // Delete category
  delete: async (id) => {
    try {
      const api = getCategoriesData();
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search categories (using the index endpoint with search parameter)
  search: async (query, filters = {}) => {
    try {
      const api = getCategoriesData();
      const response = await api.get('/categories', {
        params: { search: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
