import { toast } from 'react-hot-toast';
import { logger } from '../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Business Service - Handles all business-related API calls
 * Follows industry standards for API service architecture
 */

export const businessService = {
  /**
   * Fetch all business types from the backend
   * @param {string} token - Authentication token (optional for public endpoints)
   * @returns {Promise<Array>} Array of business types
   */
  async getBusinessTypes(token) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header only if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/business-type`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please login again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to access this resource');
        } else if (response.status === 404) {
          throw new Error('Business types not found');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Handle different response formats
      if (data.status && data.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        logger.warn('Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      logger.error('Error fetching business types:', error);
      
      // Show user-friendly error message
      if (error.message.includes('Failed to fetch')) {
        toast.error('Network error: Unable to connect to server');
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Session expired: Please login again');
      } else {
        toast.error('Failed to load business types');
      }
      
      throw error;
    }
  },

  /**
   * Get a specific business type by ID
   * @param {string} id - Business type ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Business type object
   */
  async getBusinessTypeById(id, token) {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await fetch(`${API_BASE_URL}/business-type/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Business type not found');
        } else if (response.status === 401) {
          throw new Error('Unauthorized: Please login again');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.status && data.data) {
        return data.data;
      } else {
        return data;
      }
    } catch (error) {
      logger.error('Error fetching business type:', error);
      toast.error('Failed to load business type');
      throw error;
    }
  },

  /**
   * Create a new business type (admin only)
   * @param {Object} businessTypeData - Business type data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created business type
   */
  async createBusinessType(businessTypeData, token) {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await fetch(`${API_BASE_URL}/business-type`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create business type');
      }

      const data = await response.json();
      toast.success('Business type created successfully');
      return data;
    } catch (error) {
      logger.error('Error creating business type:', error);
      toast.error('Failed to create business type');
      throw error;
    }
  },

  /**
   * Update a business type (admin only)
   * @param {string} id - Business type ID
   * @param {Object} businessTypeData - Updated business type data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated business type
   */
  async updateBusinessType(id, businessTypeData, token) {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await fetch(`${API_BASE_URL}/business-type/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business type');
      }

      const data = await response.json();
      toast.success('Business type updated successfully');
      return data;
    } catch (error) {
      logger.error('Error updating business type:', error);
      toast.error('Failed to update business type');
      throw error;
    }
  },

  /**
   * Delete a business type (admin only)
   * @param {string} id - Business type ID
   * @param {string} token - Authentication token
   * @returns {Promise<void>}
   */
  async deleteBusinessType(id, token) {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await fetch(`${API_BASE_URL}/business-type/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete business type');
      }

      toast.success('Business type deleted successfully');
    } catch (error) {
      logger.error('Error deleting business type:', error);
      toast.error('Failed to delete business type');
      throw error;
    }
  },
};

export default businessService;
