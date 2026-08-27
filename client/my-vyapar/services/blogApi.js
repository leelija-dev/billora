// services/blogApi.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance without credentials for public endpoints
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const blogApi = {
  // Get all blogs with pagination, search, and category filter
  getBlogs: async (params = {}) => {
    const response = await apiClient.get('/blog', { params });
    return response;
  },

  // Get single blog by slug
  getBlog: async (slug) => {
    const response = await apiClient.get(`/blog/${slug}`);
    return response;
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get('/blog/categories');
    return response;
  },

  // Get blogs by category
  getBlogsByCategory: async (categoryId, params = {}) => {
    const response = await apiClient.get('/blog', {
      params: { category_id: categoryId, ...params }
    });
    return response;
  },

  // Search blogs
  searchBlogs: async (query, params = {}) => {
    const response = await apiClient.get('/blog', {
      params: { search: 'name', name: query, ...params }
    });
    return response;
  },

  // Get related blogs
  getRelatedBlogs: async (limit = 3) => {
    const response = await apiClient.get('/blog', {
      params: { limit }
    });
    return response;
  },

  // Get blogs by tag
  getBlogsByTag: async (tagName, params = {}) => {
    const response = await apiClient.get(`/blog/tag/${tagName}`, { params });
    return response;
  },
};

export default blogApi;