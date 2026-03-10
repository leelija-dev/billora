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
      const response = await api.post('/categories/store', {
        user_id: categoryData.userId,
        name: categoryData.name,
        is_active: categoryData.isActive ?? true,
        created_by: categoryData.createdBy,
        description: categoryData.description,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const api = getCategoriesData();
      const response = await api.put(`/categories/${id}`, {
        name: categoryData.name,
        is_active: categoryData.isActive,
        description: categoryData.description,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
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
