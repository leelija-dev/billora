import { apiClient } from './apiClient';

export const authService = {
  login: async (credentials) => {
    try {
      console.log(' Attempting login with credentials:', { email: credentials.email });
      const response = await apiClient.post('/users/login', credentials);
      console.log(' Login successful:', response.data);
      return response;
    } catch (error) {
      console.error(' Login failed:', error);
      throw error.response?.data || error.message;
    }
  },

  register: async (companyData) => {
    try {
      console.log(' Attempting registration with data:', { 
        name: companyData.name, 
        email: companyData.email, 
        phone: companyData.phone 
      });
      const response = await apiClient.post('/users/store', companyData);
      console.log(' Registration successful:', response.data);
      return response;
    } catch (error) {
      console.error(' Registration failed:', error);
      throw error.response?.data || error.message;
    }
  },

  logout: async (userId) => {
    try {
      console.log(' Attempting logout for user:', userId);
      const response = await apiClient.post('/users/logout', { user_id: userId });
      console.log(' Logout successful');
      return response;
    } catch (error) {
      console.error(' Logout failed:', error);
      throw error.response?.data || error.message;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      console.log(' Attempting token refresh');
      const response = await apiClient.post('/auth/refresh/', { refresh: refreshToken });
      console.log(' Token refresh successful');
      return response;
    } catch (error) {
      console.error(' Token refresh failed:', error);
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: async () => {
    try {
      console.log(' Fetching current user');
      const response = await apiClient.get('/auth/me/');
      console.log(' Current user fetched:', response.data);
      return response;
    } catch (error) {
      console.error(' Failed to fetch current user:', error);
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      console.log(' Updating profile with data:', userData);
      const response = await apiClient.put('/auth/profile/', userData);
      console.log(' Profile updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(' Failed to update profile:', error);
      throw error.response?.data || error.message;
    }
  },

  changePassword: async (passwordData) => {
    try {
      console.log(' Attempting password change');
      const response = await apiClient.post('/auth/change-password/', passwordData);
      console.log(' Password changed successfully');
      return response;
    } catch (error) {
      console.error(' Failed to change password:', error);
      throw error.response?.data || error.message;
    }
  },
}