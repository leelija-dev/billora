import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './client';

export const authAPI = {
  login: async (credentials) => {
    try {
      // Demo mode - check for demo credentials
      if (credentials.email === 'demo@mobilesaaserp.com' && credentials.password === 'demo123') {
        return {
          user: {
            id: '1',
            name: 'Demo User',
            email: 'demo@mobilesaaserp.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          token: 'demo-token-12345',
          isAuthenticated: true,
        };
      }
      
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProfile: async () => {
    try {
      // Demo mode - return demo user profile
      const token = await AsyncStorage.getItem('authToken');
      if (token === 'demo-token-12345') {
        return {
          id: '1',
          name: 'Demo User',
          email: 'demo@mobilesaaserp.com',
          role: 'admin',
          phone: '+1234567890',
          company: 'Demo Company',
          createdAt: new Date().toISOString(),
        };
      }
      
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
