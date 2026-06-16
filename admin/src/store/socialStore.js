// src/store/socialStore.js
import { create } from 'zustand';
import { socialService } from '../services/socialService';

const useSocialStore = create((set, get) => ({
  // State
  connectedAccounts: {
    facebook: null,
    instagram: null
  },
  posts: [],
  scheduledPosts: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 15
  },

  // Fetch connected accounts
  fetchConnectedAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await socialService.getConnectedAccounts();
      set({
        connectedAccounts: response.data || { facebook: null, instagram: null },
        loading: false
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch connected accounts',
        loading: false
      });
      throw error;
    }
  },

  // Connect account
  connectAccount: async (platform) => {
    set({ loading: true, error: null });
    try {
      const response = await socialService.getAuthRedirectUrl(platform);
      return response.redirect_url || response.url;
    } catch (error) {
      set({
        error: error.response?.data?.message || `Failed to connect ${platform}`,
        loading: false
      });
      throw error;
    }
  },

  // Disconnect account
  disconnectAccount: async (platform) => {
    set({ loading: true, error: null });
    try {
      await socialService.disconnectAccount(platform);
      set(state => ({
        connectedAccounts: {
          ...state.connectedAccounts,
          [platform]: null
        },
        loading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || `Failed to disconnect ${platform}`,
        loading: false
      });
      throw error;
    }
  },

  // Create post
  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const response = await socialService.createPost(postData);
      set(state => ({
        posts: [response.data, ...state.posts],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create post',
        loading: false
      });
      throw error;
    }
  },

  // Fetch posts
  fetchPosts: async (page = 1, platform = null) => {
    set({ loading: true, error: null });
    try {
      const response = await socialService.getPosts(page, platform);
      set({
        posts: response.data.data || [],
        pagination: {
          currentPage: response.data.current_page || page,
          totalPages: response.data.last_page || 1,
          totalItems: response.data.total || 0,
          perPage: response.data.per_page || 15
        },
        loading: false
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch posts',
        loading: false
      });
      throw error;
    }
  },

  // Fetch scheduled posts
  fetchScheduledPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await socialService.getScheduledPosts();
      set({
        scheduledPosts: response.data || [],
        loading: false
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch scheduled posts',
        loading: false
      });
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      await socialService.deletePost(postId);
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        loading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete post',
        loading: false
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({
    connectedAccounts: { facebook: null, instagram: null },
    posts: [],
    scheduledPosts: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 15
    }
  })
}));

export default useSocialStore;