import { apiClient } from './client';
import { mockBrands } from './mock/brands';

// Get brands data based on project mode
const getBrandsData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockBrands : apiClient;
};

export const brandsAPI = {
  // Get all brands
  getAll: async (params = {}) => {
    try {
      const api = getBrandsData();
      return await api.get('/brands', { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single brand
  getById: async (id) => {
    try {
      const api = getBrandsData();
      return await api.get(`/brands/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new brand
  create: async (brandData) => {
    try {
      const api = getBrandsData();
      return await api.post('/brands/store', {
        user_id: brandData.userId,
        name: brandData.name,
        created_by: brandData.createdBy,
        is_active: brandData.isActive ?? true,
        description: brandData.description,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update brand
  update: async (id, brandData) => {
    try {
      const api = getBrandsData();
      return await api.put(`/brands/${id}`, {
        name: brandData.name,
        is_active: brandData.isActive,
        description: brandData.description,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete brand
  delete: async (id) => {
    try {
      const api = getBrandsData();
      return await api.delete(`/brands/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const api = getBrandsData();
      return await api.get('/brands/categories/');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single category
  getCategoryById: async (id) => {
    try {
      const api = getBrandsData();
      return await api.get(`/brands/categories/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const api = getBrandsData();
      return await api.post('/brands/categories/store', {
        user_id: categoryData.userId,
        name: categoryData.name,
        is_active: categoryData.isActive ?? true,
        created_by: categoryData.createdBy,
        description: categoryData.description,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const api = getBrandsData();
      return await api.put(`/brands/categories/${id}`, {
        name: categoryData.name,
        is_active: categoryData.isActive,
        description: categoryData.description,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const api = getBrandsData();
      return await api.delete(`/brands/categories/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all units
  getUnits: async () => {
    try {
      const api = getBrandsData();
      return await api.get('/brands/units/');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single unit
  getUnitById: async (id) => {
    try {
      const api = getBrandsData();
      return await api.get(`/brands/units/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create unit
  createUnit: async (unitData) => {
    try {
      const api = getBrandsData();
      return await api.post('/brands/units/store', {
        user_id: unitData.userId,
        code: unitData.code,
        name: unitData.name,
        created_by: unitData.createdBy,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update unit
  updateUnit: async (id, unitData) => {
    try {
      const api = getBrandsData();
      return await api.put(`/brands/units/${id}`, {
        code: unitData.code,
        name: unitData.name,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete unit
  deleteUnit: async (id) => {
    try {
      const api = getBrandsData();
      return await api.delete(`/brands/units/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
