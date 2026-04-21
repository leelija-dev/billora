// utils/secureApi.js - Secure API utility with proper error handling
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Development mode check
const isDevelopment = process.env.NEXT_PUBLIC_PROJECT_MODE === 'development';

// Logger utility for development only
const logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
};

// Request interceptor for security headers
const addSecurityHeaders = (options) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
};

// Response handler
const handleResponse = async (response) => {
  const data = await response.json();
  
  // Log in development only
  if (isDevelopment) {
    logger.log('API Response:', data);
  }
  
  // Handle different response formats
  if (!response.ok) {
    const errorMessage = data.message || data.error || ERROR_MESSAGES.GENERAL;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

// Error handler
const handleError = (error) => {
  logger.error('API Error:', error);
  
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error(ERROR_MESSAGES.NETWORK);
  }
  
  // Handle timeout errors
  if (error.name === 'AbortError') {
    throw new Error('Request timeout. Please try again.');
  }
  
  // Handle authentication errors
  if (error.status === 401) {
    // Clear invalid token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new Error(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
  }
  
  // Handle forbidden errors
  if (error.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }
  
  // Handle not found errors
  if (error.status === 404) {
    throw new Error('The requested resource was not found.');
  }
  
  // Handle server errors
  if (error.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }
  
  // Re-throw the original error
  throw error;
};

// Main API request function
export const secureApiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    timeout = 30000, // 30 seconds timeout
    retries = 1,
    ...otherOptions
  } = options;
  
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Log request in development only
  if (isDevelopment) {
    logger.log('API Request:', { url: fullUrl, method, body });
  }
  
  // Add security headers
  const requestOptions = addSecurityHeaders({
    method,
    ...otherOptions,
  });
  
  // Add body if present
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  requestOptions.signal = controller.signal;
  
  try {
    let lastError;
    
    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);
        clearTimeout(timeoutId);
        return await handleResponse(response);
      } catch (error) {
        lastError = error;
        
        // Don't retry on authentication errors
        if (error.status === 401 || error.status === 403) {
          break;
        }
        
        // Don't retry on the last attempt
        if (attempt === retries) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    throw lastError;
  } catch (error) {
    clearTimeout(timeoutId);
    return handleError(error);
  }
};

// Convenience methods
export const api = {
  get: (endpoint, options = {}) => secureApiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'POST', body: data, ...options }),
  put: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'PUT', body: data, ...options }),
  patch: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'PATCH', body: data, ...options }),
  delete: (endpoint, options = {}) => secureApiRequest(endpoint, { method: 'DELETE', ...options }),
};

// Export the default function for backward compatibility
export default secureApiRequest;
