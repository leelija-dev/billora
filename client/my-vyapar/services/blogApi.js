import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with credentials support
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Handle CSRF token for Laravel Sanctum
const getCsrfToken = async () => {
  try {
    await apiClient.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
};

export const blogApi = {
  // Get all blogs with pagination, search, and category filter
  // API: http://localhost:8000/api/blog?search=name&category_id=1
  getBlogs: async (params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog', { params });
    return response;
  },

  // Get single blog by slug
  // API: http://localhost:8000/api/blog/{slug}
  getBlog: async (slug) => {
    await getCsrfToken();
    const response = await apiClient.get(`/api/blog/${slug}`);
    return response;
  },

  // Get all categories (included in blogs API response)
  getCategories: async () => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog');
    return response;
  },

  // Get blogs by category (using main API with category_id filter)
  getBlogsByCategory: async (categoryId, params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog', {
      params: { category_id: categoryId, ...params }
    });
    return response;
  },

  // Search blogs (using main API with search parameter)
  searchBlogs: async (query, params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog', {
      params: { search: 'name', ...params }
    });
    return response;
  },

  // Get related blogs (using main API to get more blogs)
  getRelatedBlogs: async (limit = 3) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog', {
      params: { limit }
    });
    return response;
  },
};

export default blogApi;
