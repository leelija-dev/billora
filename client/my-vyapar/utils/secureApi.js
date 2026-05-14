


// utils/secureApi.js
import axios from 'axios';

const isDevelopment = process.env.PROJECT_ENV_MODE === 'development';
// Or use your custom env variable
// const PROJECT_ENV_MODE = process.env.PROJECT_ENV_MODE;

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return isDevelopment ? 'http://localhost:8000/api' : 'https://api.thefastbill.com/api';
};

// ✅ FIX: Get the base API URL without /api for CSRF endpoint
const getCsrfBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    // Remove /api from the end if present
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api$/, '');
  }
  return isDevelopment ? 'http://localhost:8000' : 'https://api.thefastbill.com';
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
      // ✅ FIX: Use dynamic base URL instead of hardcoded localhost
      const csrfBaseUrl = getCsrfBaseUrl();
      console.log('🔄 Fetching CSRF cookie from:', `${csrfBaseUrl}/sanctum/csrf-cookie`);
      
      const response = await axios.get(`${csrfBaseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
        },
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

// Get CSRF token from cookie
const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    if (cookie.startsWith('XSRF-TOKEN=')) {
      const token = cookie.split('=')[1];
      return decodeURIComponent(token);
    }
  }
  return null;
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
      
      const csrfToken = getCsrfToken();
      
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
        console.log('✅ CSRF token added to request');
      } else {
        console.warn('⚠️ No CSRF token found in cookies');
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
  
  // Only log in development
  if (isDevelopment) {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  }
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {

    if (isDevelopment) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }

    return response;
  },

  async (error) => {

    const status = error?.response?.status;
    const url = error?.config?.url || '';

    // ✅ Ignore ALL logout errors
    if (url.includes('/logout')) {

      console.warn('Logout request ignored');

      return Promise.resolve({
        data: {
          status: true
        }
      });
    }

    // ✅ Better logging
    console.log("❌ API Error:", {
      message: error?.response?.data?.message,
      status,
      data: error?.response?.data,
      url
    });

    // ✅ Unauthorized handling
    if (status === 401) {

      if (typeof window !== 'undefined') {

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');

        localStorage.setItem(
          "logout-event",
          Date.now().toString()
        );

        window.dispatchEvent(
          new CustomEvent('unauthorized')
        );
      }
    }

    // ✅ CSRF retry
    if (status === 419) {

      csrfFetched = false;

      const originalRequest = error.config;

      if (!originalRequest._retry) {

        originalRequest._retry = true;

        try {

          await fetchCsrfCookie();

          const newCsrfToken = getCsrfToken();

          if (newCsrfToken) {
            originalRequest.headers['X-XSRF-TOKEN'] = newCsrfToken;
          }

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