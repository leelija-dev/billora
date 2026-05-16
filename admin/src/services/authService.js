import { apiClient } from './apiClient';

export const authService = {
  checkSession: async () => {
    try {
      const response = await apiClient.get('/users/check-session');
      return response.data;
    } catch (error) {
      return { status: false, message: 'Not authenticated' };
    }
  },

  login: async (credentials) => {
    try {
      // Fetch CSRF cookie
      await apiClient.get('/sanctum/csrf-cookie');
      
      // Attempt login
      const response = await apiClient.post('/users/login', credentials);
      
      // Only proceed if login was successful
      if (response.data && response.data.status) {
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        return response;
      } else {
        // Login failed but no error thrown
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // Don't store anything on error
      console.error('Login error:', error.response?.data || error.message);
      
      // Clear any partial state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Throw a clean error for the UI
      throw {
        message: error.response?.data?.message || error.message || 'Login failed',
        status: error.response?.status
      };
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/users/logout');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Still return success to clear local state
      return { data: { status: true } };
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/edit/${userId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put(`/users/update/${userData.id}`, userData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put(`/users/update-password/${passwordData.id}`, passwordData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPlanDetails: async (planId) => {
    try {
      console.log(' Fetching plan details for plan:', planId);
      const response = await apiClient.get(`/plans/${planId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch plan details:', error);
      // Return a default response so the app doesn't break
      return {
        data: {
          status: true,
          'Single Plan': {
            id: planId,
            name: 'Basic Plan',
            features: []
          },
          permissionNames: [],
          customer_sidebar_permission: []
        }
      };
    }
  },
};

