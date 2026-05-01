import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  getBlogs: async (params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blogs', { params });
    return response;
  },

  // Get single blog by slug
  getBlog: async (slug) => {
    await getCsrfToken();
    const response = await apiClient.get(`/api/blogs/${slug}`);
    return response;
  },

  // Get all categories
  getCategories: async () => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blog-categories');
    return response;
  },

  // Get blogs by category
  getBlogsByCategory: async (categoryId, params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get(`/api/blogs/category/${categoryId}`, { params });
    return response;
  },

  // Search blogs
  searchBlogs: async (query, params = {}) => {
    await getCsrfToken();
    const response = await apiClient.get('/api/blogs/search', {
      params: { q: query, ...params }
    });
    return response;
  },

  // Get related blogs
  getRelatedBlogs: async (blogId, limit = 3) => {
    await getCsrfToken();
    const response = await apiClient.get(`/api/blogs/${blogId}/related`, {
      params: { limit }
    });
    return response;
  },
};

export default blogApi;
