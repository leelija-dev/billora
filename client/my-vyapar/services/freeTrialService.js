// services/freeTrialService.js
import { api } from '../utils/secureApi';

/**
 * Free Trial Service - uses secureApi for Sanctum CSRF (fixes 419) and auth_token
 */
class FreeTrialService {
  async submitFreeTrial(data) {
    try {
      if (!data.customer_id) {
        throw new Error('Customer ID is required');
      }
      if (!data.business_type_id) {
        throw new Error('Business type ID is required');
      }
      if (!data.customer_phone) {
        throw new Error('Customer phone number is required');
      }

      await api.get('/sanctum/csrf-cookie');

      const response = await api.post('/free-trials', {
        customer_id: parseInt(data.customer_id, 10),
        business_type_id: parseInt(data.business_type_id, 10),
        customer_phone: data.customer_phone,
      });

      const result = response.data ?? response;

      return {
        success: true,
        message: result.message || 'Free trial started successfully',
        data: result.data || result,
        status: response.status,
      };
    } catch (error) {
      console.error('Free trial submission error:', error);

      const status = error?.response?.status;
      const result = error?.response?.data;

      let message =
        result?.message ||
        error.message ||
        'An error occurred while starting your free trial';

      if (status === 419) {
        message = 'Session expired. Please refresh the page and try again.';
      } else if (status === 401) {
        message = 'Please login again to start your free trial.';
      } else if (status === 422) {
        message = result?.message || message;
      }

      return {
        success: false,
        message,
        error,
      };
    }
  }

  validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
  }
}

export const freeTrialService = new FreeTrialService();

export default freeTrialService;
