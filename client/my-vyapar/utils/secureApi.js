// // utils/secureApi.js - Secure API utility with proper error handling
// import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// // Development mode check
// const isDevelopment = process.env.NEXT_PUBLIC_PROJECT_MODE === 'development';

// // Logger utility for development only
// const logger = {
//   log: (...args) => isDevelopment && console.log(...args),
//   error: (...args) => isDevelopment && console.error(...args),
//   warn: (...args) => isDevelopment && console.warn(...args),
// };

// // Request interceptor for security headers
// const addSecurityHeaders = (options) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
//   return {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'X-Requested-With': 'XMLHttpRequest',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//   };
// };

// // Response handler
// const handleResponse = async (response) => {
//   const data = await response.json();
  
//   // Log in development only
//   if (isDevelopment) {
//     logger.log('API Response:', data);
//   }
  
//   // Handle different response formats
//   if (!response.ok) {
//     const errorMessage = data.message || data.error || ERROR_MESSAGES.GENERAL;
//     const error = new Error(errorMessage);
//     error.status = response.status;
//     error.data = data;
//     throw error;
//   }
  
//   return data;
// };

// // Error handler
// const handleError = (error) => {
//   logger.error('API Error:', error);
  
//   // Handle network errors
//   if (error.name === 'TypeError' && error.message.includes('fetch')) {
//     throw new Error(ERROR_MESSAGES.NETWORK);
//   }
  
//   // Handle timeout errors
//   if (error.name === 'AbortError') {
//     throw new Error('Request timeout. Please try again.');
//   }
  
//   // Handle authentication errors
//   if (error.status === 401) {
//     // Clear invalid token
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }
//     throw new Error(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
//   }
  
//   // Handle forbidden errors
//   if (error.status === 403) {
//     throw new Error('You do not have permission to perform this action.');
//   }
  
//   // Handle not found errors
//   if (error.status === 404) {
//     throw new Error('The requested resource was not found.');
//   }
  
//   // Handle server errors
//   if (error.status >= 500) {
//     throw new Error('Server error. Please try again later.');
//   }
  
//   // Re-throw the original error
//   throw error;
// };

// // Main API request function
// export const secureApiRequest = async (endpoint, options = {}) => {
//   const {
//     method = 'GET',
//     body = null,
//     timeout = 30000, // 30 seconds timeout
//     retries = 1,
//     ...otherOptions
//   } = options;
  
//   const fullUrl = `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
//   // Log request in development only
//   if (isDevelopment) {
//     logger.log('API Request:', { url: fullUrl, method, body });
//   }
  
//   // Add security headers
//   const requestOptions = addSecurityHeaders({
//     method,
//     ...otherOptions,
//   });
  
//   // Add body if present
//   if (body) {
//     requestOptions.body = JSON.stringify(body);
//   }
  
//   // Create abort controller for timeout
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);
  
//   requestOptions.signal = controller.signal;
  
//   try {
//     let lastError;
    
//     // Retry logic
//     for (let attempt = 0; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch(fullUrl, requestOptions);
//         clearTimeout(timeoutId);
//         return await handleResponse(response);
//       } catch (error) {
//         lastError = error;
        
//         // Don't retry on authentication errors
//         if (error.status === 401 || error.status === 403) {
//           break;
//         }
        
//         // Don't retry on the last attempt
//         if (attempt === retries) {
//           break;
//         }
        
//         // Wait before retrying
//         await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
//       }
//     }
    
//     throw lastError;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     return handleError(error);
//   }
// };

// // Convenience methods
// export const api = {
//   get: (endpoint, options = {}) => secureApiRequest(endpoint, { method: 'GET', ...options }),
//   post: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'POST', body: data, ...options }),
//   put: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'PUT', body: data, ...options }),
//   patch: (endpoint, data, options = {}) => secureApiRequest(endpoint, { method: 'PATCH', body: data, ...options }),
//   delete: (endpoint, options = {}) => secureApiRequest(endpoint, { method: 'DELETE', ...options }),
// };

// // Export the default function for backward compatibility
// export default secureApiRequest;


// utils/secureApi.js
import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return isDevelopment ? 'http://localhost:8000/api' : 'https://api.thefastbill.com/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true, // CRITICAL: Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Flag to track if CSRF cookie has been fetched
let csrfFetched = false;
let csrfPromise = null;

// Function to fetch CSRF cookie
const fetchCsrfCookie = async () => {
  if (csrfFetched) return true;
  
  if (csrfPromise) {
    return csrfPromise;
  }
  
  csrfPromise = new Promise(async (resolve, reject) => {
    try {
      // Use a separate axios instance without interceptors to avoid loops
      const response = await axios.get('http://localhost:8000/api/sanctum/csrf-cookie', {
        withCredentials: true,
        baseURL: getApiBaseUrl(),
      });
      csrfFetched = true;
      console.log('✅ CSRF cookie fetched successfully');
      resolve(true);
    } catch (error) {
      console.error('❌ Failed to fetch CSRF cookie:', error);
      reject(error);
    } finally {
      csrfPromise = null;
    }
  });
  
  return csrfPromise;
};

// Request interceptor for CSRF
api.interceptors.request.use(async (config) => {
  // Skip CSRF for GET requests and CSRF endpoint itself
  const skipCsrf = config.method === 'get' || 
                   config.url.includes('csrf-cookie') ||
                   config.url.includes('check-session');
  
  if (!skipCsrf) {
    try {
      await fetchCsrfCookie();
      
      // Get the CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        console.log('✅ CSRF token added to request');
      }
    } catch (error) {
      console.error('❌ CSRF setup failed:', error);
    }
  }
  
  // Add token from localStorage as fallback
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    console.error(`❌ API Error:`, error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
    }
    
    // Reset CSRF flag on 419 to retry
    if (error.response?.status === 419) {
      console.log('🔄 CSRF token mismatch, resetting and retrying...');
      csrfFetched = false;
      
      // Retry the request once
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await fetchCsrfCookie();
          return api(originalRequest);
        } catch (retryError) {
          return Promise.reject(retryError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;