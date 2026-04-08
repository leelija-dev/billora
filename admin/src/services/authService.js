import { apiClient } from './apiClient';

export const authService = {
  login: async (credentials) => {
    try {
      console.log(' Attempting login with credentials:', { email: credentials.email });
      const response = await apiClient.post('/users/login', credentials);
      console.log(' Login response:', response.data);
      
      // Check if login was actually successful
      if (!response.data.status) {
        throw response.data; // Throw the response data as error if status is false
      }
      
      return response;
    } catch (error) {
      console.error(' Login failed:', error);
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      console.log(' Attempting registration with data:', { 
        name: userData.name, 
        email: userData.email, 
        phone: userData.phone,
        company_name: userData.company_name
      });
      const response = await apiClient.post('/users/register', userData);
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

  me: async () => {
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

  getUserById: async (userId) => {
    try {
      console.log(' Fetching user by ID:', userId);
      const response = await apiClient.get(`/users/edit/${userId}`);
      console.log(' User fetched by ID:', response.data);
      return response;
    } catch (error) {
      console.error(' Failed to fetch user by ID:', error);
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      console.log(' Updating profile with data:', userData);
      const response = await apiClient.put(`/users/update/${userData.id}`, userData);
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
      const response = await apiClient.put(`/users/update-password/${passwordData.id}`, passwordData);
      console.log(' Password changed successfully');
      return response;
    } catch (error) {
      console.error(' Failed to change password:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get user plan details with permissions
  getUserPlan: async (userId) => {
    try {
      console.log(' Fetching user plan details for user:', userId);
      const response = await apiClient.get(`/users/${userId}/plan`);
      console.log(' User plan details fetched:', response.data);
      return response;
    } catch (error) {
      console.error(' Failed to fetch user plan:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get plan details by plan ID
  getPlanDetails: async (planId) => {
    try {
      console.log(' Fetching plan details for plan:', planId);
      const response = await apiClient.get(`/plans/${planId}`);
      console.log(' Plan details fetched:', response.data);
      return response;
    } catch (error) {
      console.error(' Failed to fetch plan details:', error);
      throw error.response?.data || error.message;
    }
  },

  // Check if user has specific permission
  hasPermission: (user, permissionSlug) => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(permission => permission.slug === permissionSlug);
  },

  // Check if user can access specific feature
  canAccess: (user, feature) => {
    const permissionMap = {
      'stock-management': 'stock-management',
      'billing': 'bill-generation',
      'reports': 'reports',
      'customers': 'customer-management',
      'products': 'product-management',
      'invoices': 'bill-generation',
      'dashboard': 'dashboard'
    };
    
    const requiredPermission = permissionMap[feature];
    if (!requiredPermission) return true; // If no specific permission required, allow access
    
    return authService.hasPermission(user, requiredPermission);
  }
}