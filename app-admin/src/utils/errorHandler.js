import { Alert } from 'react-native';

/**
 * Handle API errors and show appropriate alert messages
 * @param {Error} error - The error object from axios
 * @returns {Object} - Formatted error object
 */
export const handleApiError = (error) => {
  let message = 'An unexpected error occurred';
  let status = 500;
  let errors = {};

  if (error.response) {
    // Server responded with error
    status = error.response.status;
    const data = error.response.data || {};
    
    // Handle different error formats
    if (typeof data === 'string') {
      message = data;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else if (data.error) {
      message = data.error;
    } else if (data.non_field_errors) {
      message = data.non_field_errors[0] || message;
      errors = { non_field_errors: data.non_field_errors };
    } else if (typeof data === 'object') {
      // Handle field errors
      errors = data;
      const firstError = Object.values(data)[0];
      message = Array.isArray(firstError) ? firstError[0] : firstError || message;
    }
    
    // Status specific messages
    switch (status) {
      case 400:
        Alert.alert('Bad Request', message || 'Please check your input');
        break;
      case 401:
        Alert.alert('Session Expired', 'Please login again');
        break;
      case 403:
        Alert.alert('Access Denied', 'You do not have permission to perform this action');
        break;
      case 404:
        Alert.alert('Not Found', 'The requested resource was not found');
        break;
      case 422:
        Alert.alert('Validation Error', message || 'Please check your input');
        break;
      case 429:
        Alert.alert('Too Many Requests', 'Please try again later');
        break;
      case 500:
        Alert.alert('Server Error', 'An internal server error occurred');
        break;
      default:
        Alert.alert('Error', message);
    }
  } else if (error.request) {
    // Request made but no response
    message = 'Unable to connect to server. Please check your internet connection.';
    Alert.alert('Network Error', message);
  } else {
    // Something else happened
    message = error.message || message;
    Alert.alert('Error', message);
  }

  // Log error for debugging
  if (__DEV__) {
    console.error('API Error:', {
      message,
      status,
      data: error.response?.data,
      config: error.config,
    });
  }

  return { 
    message, 
    status, 
    errors,
    originalError: error 
  };
};

/**
 * Create a formatted error message from validation errors
 * @param {Object} errors - Validation errors object
 * @returns {string} - Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return '';
  
  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const errorMsg = Array.isArray(messages) ? messages[0] : messages;
      return `${fieldName}: ${errorMsg}`;
    })
    .join('\n');
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && !!error.request;
};

/**
 * Check if error is a timeout error
 * @param {Error} error - The error object
 * @returns {boolean} - True if timeout error
 */
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  if (isTimeoutError(error)) {
    return 'The request timed out. Please try again.';
  }
  
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return 'Your session has expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'An internal server error occurred. Our team has been notified.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.response.data?.message || 'An unexpected error occurred.';
    }
  }
  
  return error.message || 'An unexpected error occurred.';
};

export default {
  handleApiError,
  formatValidationErrors,
  isNetworkError,
  isTimeoutError,
  getUserFriendlyErrorMessage,
};