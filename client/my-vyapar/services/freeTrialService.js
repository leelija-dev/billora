// services/freeTrialService.js
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Free Trial Service - Handles all free trial related API calls
 */
class FreeTrialService {
  /**
   * Submit free trial request
   * @param {Object} data - Free trial request data
   * @param {number} data.customer_id - Customer ID (required)
   * @param {number} data.business_type_id - Business type ID (required)
   * @param {string} data.customer_phone - Customer phone number (required)
   * @returns {Promise<Object>} Response object
   */
  async submitFreeTrial(data) {
    try {
      // Validate required fields
      if (!data.customer_id) {
        throw new Error('Customer ID is required');
      }
      if (!data.business_type_id) {
        throw new Error('Business type ID is required');
      }
      if (!data.customer_phone) {
        throw new Error('Customer phone number is required');
      }

      // Get auth token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await fetch(`${API_BASE_URL}/cashfree/free-trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          customer_id: parseInt(data.customer_id),
          business_type_id: parseInt(data.business_type_id),
          customer_phone: parseInt(data.customer_phone),
        }),
      });
      

      const result = await response.json();
      
      if (!response.ok) {
        // Handle different error status codes
        switch (response.status) {
          case 400:
            throw new Error(result.message || 'Invalid request data');
          case 401:
            throw new Error('Unauthorized: Please login again');
          case 403:
            throw new Error('Forbidden: You do not have permission');
          case 404:
            throw new Error('Customer not found');
          case 409:
            throw new Error('Trial already used or conflict occurred');
          case 422:
            throw new Error(result.message || 'Validation failed');
          case 500:
            throw new Error('Server error: Please try again later');
          default:
            throw new Error(result.message || 'Failed to start free trial');
        }
      }

      // Return success response
      return {
        success: true,
        message: result.message || 'Free trial started successfully',
        data: result.data || result,
        status: response.status
      };
    } catch (error) {
      console.error('Free trial submission error:', error);
      
      // Return error response
      return {
        success: false,
        message: error.message || 'An error occurred while starting your free trial',
        error: error,
      };
    }
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Is valid
   */
  validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * Format phone number for API
   * @param {string} phone - Raw phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  }
}

// Create and export a singleton instance
export const freeTrialService = new FreeTrialService();

export default freeTrialService;