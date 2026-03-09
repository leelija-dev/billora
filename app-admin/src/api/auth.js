import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './client';
import { mockAuth } from './mock/auth';

// Get auth data based on project mode
const getAuthData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockAuth : apiClient;
};

export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const api = getAuthData();
      console.log('Register API call:', {
        endpoint: '/users/store',
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          pincode: userData.pincode,
          companyName: userData.companyName || null,
          gst_number: userData.gstNumber || null,
          address: userData.address || null,
          created_by: userData.created_by,
        }
      });
      return await api.post('/users/store', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        company_name: userData.companyName || null,
        gst_number: userData.gstNumber || null,
        address: userData.address || null,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        pincode: userData.pincode,
        created_by: userData.createdBy || null,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const api = getAuthData();
      return await api.post('/users/login', {
        email,
        password,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async (userId) => {
    try {
      const api = getAuthData();
      return await api.post('/users/logout', {
        user_id: userId,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user profile
  getProfile: async (userId) => {
    try {
      const api = getAuthData();
      return await api.get(`/users/${userId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const api = getAuthData();
      return await api.put(`/users/${userId}`, userData);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy methods for backward compatibility
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  forgotPassword: async (email) => {
    try {
      const api = getAuthData();
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const api = getAuthData();
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
