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
    
    // ✅ Handle 401 - logout but don't retry
    if (error.response?.status === 401 && !originalRequest.url.includes('check-session')) {
      console.log('🔒 Unauthorized, logging out...');
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock';

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Add request interceptor for debugging
// apiClient.interceptors.request.use(
//   (config) => {
//     console.log('🌐 API Request:', {
//       method: config.method?.toUpperCase(),
//       url: config.url,
//       baseURL: config.baseURL,
//       fullUrl: `${config.baseURL}${config.url}`,
//       headers: {
//         ...config.headers,
//         // Show authorization header safely
//         Authorization: config.headers.Authorization ? 
//           `Bearer ${config.headers.Authorization.replace('Bearer ', '').substring(0, 20)}...` : 
//           'none'
//       },
//       params: config.params,
//       data: config.data
//     });
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Request interceptor for auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     try {
//       const authState = useAuthStore.getState();
//       const token = authState.tokens?.access;
      
//       console.log('🔐 Auth State Check:', {
//         hasTokens: !!authState.tokens,
//         hasAccessToken: !!token,
//         tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
//         isAuthenticated: authState.isAuthenticated
//       });
      
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log('🔐 Token added to request headers:', {
//           authorization: `Bearer ${token.substring(0, 20)}...`,
//           url: config.url,
//           method: config.method?.toUpperCase()
//         });
//       } else {
//         console.log('⚠️ No token found in storage - Request may fail authentication');
//         console.log('⚠️ Current auth state:', {
//           user: authState.user,
//           tokens: authState.tokens,
//           isAuthenticated: authState.isAuthenticated
//         });
//       }
//     } catch (error) {
//       console.error('❌ Error getting auth token:', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response:', {
//       status: response.status,
//       url: response.config.url,
//       data: response.data,
//     });
//     return response;
//   },
//   async (error) => {
//     console.error('❌ API Error Details:', {
//       message: error.message,
//       code: error.code,
//       response: error.response,
//       config: error.config,
//     });
    
//     if (error.response?.status === 401) {
//       try {
//         useAuthStore.getState().logout();
//         console.log('🔓 User logged out due to 401 error');
//       } catch (logoutError) {
//         console.error('❌ Error during logout:', logoutError);
//       }
//     }
    
//     // Handle network errors
//     if (!error.response) {
//       console.error('🌐 Network Error Details:', {
//         message: error.message,
//         code: error.code,
//       });
//       error.response = {
//         data: { message: 'Network error. Please check your connection.' },
//         status: 0,
//       };
//     }
    
//     return Promise.reject(error);
//   }
// );

// export { apiClient };
// export default apiClient;
