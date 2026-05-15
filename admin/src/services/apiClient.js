// src/services/apiClient.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

let csrfFetched = false;
let csrfPromise = null;

const fetchCsrfCookie = async () => {
  if (csrfFetched) return true;
  
  if (csrfPromise) return csrfPromise;
  
  csrfPromise = new Promise(async (resolve, reject) => {
    try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        baseURL: API_BASE_URL,
      });
      csrfFetched = true;
      console.log('✅ CSRF cookie fetched');
      resolve(true);
    } catch (error) {
      console.error('❌ CSRF fetch failed:', error);
      reject(error);
    } finally {
      csrfPromise = null;
    }
  });
  
  return csrfPromise;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // ✅ Let browser handle HttpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use(async (config) => {
  console.log('🔍 REACT API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullUrl: `${config.baseURL}${config.url}`,
    withCredentials: config.withCredentials,
    currentDomain: window.location.hostname
  });
  
  // ✅ Debug: Log all cookies React admin can access
  console.log('🍪 REACT Current cookies:', document.cookie);
  
  // ✅ Debug: Check if session cookie exists
  const hasSessionCookie = document.cookie.includes('thefastbill-session');
  const hasXsrfCookie = document.cookie.includes('XSRF-TOKEN');
  console.log('🔍 Cookie Check:', {
    hasSessionCookie,
    hasXsrfCookie,
    cookieCount: document.cookie.split(';').length
  });
  
  const skipCsrf = config.method === 'get' || 
                   config.url.includes('csrf-cookie') ||
                   config.url.includes('check-session');
  
  if (!skipCsrf) {
    try {
      await fetchCsrfCookie();
      
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        console.log('🔐 REACT CSRF token added:', csrfToken.substring(0, 20) + '...');
      } else {
        console.log('⚠️ REACT No CSRF token found in cookies');
      }
    } catch (error) {
      console.error('CSRF setup failed:', error);
    }
  }
  
  console.log('📤 REACT Final request headers:', {
    ...config.headers,
    Authorization: config.headers.Authorization ? 
      `Bearer ${config.headers.Authorization.replace('Bearer ', '').substring(0, 20)}...` : 
      'none'
  });
  
  return config;
});

// In apiClient.js, update the response interceptor:

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ REACT API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.log('❌ REACT API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      responseHeaders: error.response?.headers
    });
    
    const originalRequest = error.config;
    
    // ✅ Handle 419 CSRF mismatch - retry once
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      csrfFetched = false;
      try {
        await fetchCsrfCookie();
        return apiClient(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    // ✅ Handle 401 - DON'T logout for login/check-session endpoints
    const shouldSkipLogout = originalRequest.url.includes('login') || 
                             originalRequest.url.includes('check-session') ||
                             originalRequest.url === '/users/login';
    
    if (error.response?.status === 401 && !shouldSkipLogout) {
      console.log('🔒 Unauthorized, logging out...');
      // Only logout if it's not a login endpoint
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

