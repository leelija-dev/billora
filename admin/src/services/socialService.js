// src/services/socialService.js
import { apiClient } from './apiClient';

export const socialService = {
  // Get connected accounts
  getConnectedAccounts: async () => {
    try {
      const response = await apiClient.get('/social/accounts');
      return response.data;
    } catch (error) {
      console.error('Get connected accounts error:', error);
      throw error;
    }
  },

  // ✅ SIMPLIFIED: Just return the redirect URL for frontend to redirect
  getAuthRedirectUrl: async (platform) => {
    try {
      // This returns the full Facebook/Instagram OAuth URL
      const response = await apiClient.get(`/social/${platform.toLowerCase()}/redirect`);
      return response.data.redirect_url || response.data.url;
    } catch (error) {
      console.error(`Get ${platform} redirect URL error:`, error);
      throw error;
    }
  },

  // Handle OAuth callback
  handleOAuthCallback: async (platform, code, state) => {
    try {
      const response = await apiClient.post(`/social/${platform.toLowerCase()}/callback`, {
        code,
        state
      });
      return response.data;
    } catch (error) {
      console.error(`${platform} OAuth callback error:`, error);
      throw error;
    }
  },

  // Disconnect account
  disconnectAccount: async (platform) => {
    try {
      const response = await apiClient.post(`/social/${platform.toLowerCase()}/disconnect`);
      return response.data;
    } catch (error) {
      console.error(`Disconnect ${platform} error:`, error);
      throw error;
    }
  },

  // Create post
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/social/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Get posts
  getPosts: async (page = 1, platform = null) => {
    try {
      const params = { page };
      if (platform) params.platform = platform;
      
      const response = await apiClient.get('/social/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const response = await apiClient.delete(`/social/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const response = await apiClient.put(`/social/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  },

  // Get analytics
  getPostAnalytics: async (postId) => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Get post analytics error:', error);
      throw error;
    }
  },

  // Get scheduled posts
  getScheduledPosts: async () => {
    try {
      const response = await apiClient.get('/social/posts/scheduled');
      return response.data;
    } catch (error) {
      console.error('Get scheduled posts error:', error);
      throw error;
    }
  },
};