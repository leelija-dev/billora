import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // CRITICAL: Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (config.method !== 'get' && !config.url.includes('csrf-cookie')) {
      try {
        await apiClient.get('/sanctum/csrf-cookie');
      } catch (error) {
        console.log('CSRF cookie fetch failed:', error);
      }
    }
    
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        useAuthStore.getState().logout();
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
      }
    }
    
    if (!error.response) {
      error.response = {
        data: { message: 'Network error. Please check your connection.' },
        status: 0,
      };
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
