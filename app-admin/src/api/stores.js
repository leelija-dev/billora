import { apiClient } from './client';
import { mockStores } from './mock/stores';

// Get stores data based on project mode
const getStoresData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockStores : apiClient;
};

export const storesAPI = {
  // Get all stores for a user
  getAll: async (userId, params = {}) => {
    try {
      const api = getStoresData();
      return await api.get(`/store/${userId}`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single store
  getById: async (id) => {
    try {
      const api = getStoresData();
      return await api.get(`/store/edit/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new store
  create: async (storeData) => {
    try {
      const api = getStoresData();
      return await api.post('/store/store', {
        user_id: storeData.userId,
        name: storeData.name,
        gst: storeData.gst,
        email: storeData.email,
        logo: storeData.logo,
        mobile: storeData.mobile,
        address: storeData.address,
        city: storeData.city,
        status: storeData.status,
        created_by: storeData.createdBy,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update store
  update: async (id, storeData) => {
    try {
      const api = getStoresData();
      return await api.put(`/store/${id}`, {
        name: storeData.name,
        gst: storeData.gst,
        email: storeData.email,
        logo: storeData.logo,
        mobile: storeData.mobile,
        address: storeData.address,
        city: storeData.city,
        status: storeData.status,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete store
  delete: async (id) => {
    try {
      const api = getStoresData();
      return await api.delete(`/store/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload store logo
  uploadLogo: async (storeId, logoFile) => {
    try {
      const api = getStoresData();
      const formData = new FormData();
      formData.append('logo', {
        uri: logoFile.uri,
        type: logoFile.type || 'image/jpeg',
        name: logoFile.name || 'store-logo.jpg',
      });

      return await api.post(`/store/${storeId}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get store settings
  getSettings: async (storeId) => {
    try {
      const api = getStoresData();
      return await api.get(`/store/${storeId}/settings`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update store settings
  updateSettings: async (storeId, settings) => {
    try {
      const api = getStoresData();
      return await api.put(`/store/${storeId}/settings`, settings);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get store statistics
  getStats: async (storeId, filters = {}) => {
    try {
      const api = getStoresData();
      return await api.get(`/store/${storeId}/stats`, { params: filters });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get store users
  getUsers: async (storeId) => {
    try {
      const api = getStoresData();
      return await api.get(`/store/${storeId}/users`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add user to store
  addUser: async (storeId, userData) => {
    try {
      const api = getStoresData();
      return await api.post(`/store/${storeId}/users`, userData);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove user from store
  removeUser: async (storeId, userId) => {
    try {
      const api = getStoresData();
      return await api.delete(`/store/${storeId}/users/${userId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
