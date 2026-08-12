// store/testimonialStore.js - Zustand store for testimonials management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import testimonialService from '../services/testimonialService';

// Create Zustand store for testimonials
export const useTestimonialStore = create(
  persist(
    (set, get) => ({
      // State
      testimonials: [],
      loading: false,
      error: null,
      pagination: {},
      currentPage: 1,
      lastFetched: null,

      // ✅ NEW: Set testimonials directly (for server data)
      setTestimonials: (testimonials) => {
        set({
          testimonials,
          loading: false,
          error: null,
          lastFetched: Date.now(),
        });
        logger.log('📦 Testimonials set from server:', testimonials.length, 'items');
      },

      // Actions
      /**
       * Fetch testimonials from API
       * @param {number} page - Page number
       * @param {Object} params - Additional query parameters
       */
      fetchTestimonials: async (page = 1, params = {}) => {
        set({ loading: true, error: null });
        
        try {
          logger.log('🔄 Fetching testimonials from service...');
          const response = await testimonialService.getAllTestimonials({
            page,
            ...params
          });
          
          if (response.success) {
            set({
              testimonials: response.data,
              loading: false,
              error: null,
              currentPage: page,
              lastFetched: Date.now(),
            });
            
            logger.log('✅ Testimonials loaded:', response.data.length, 'items');
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch testimonials');
          }
        } catch (error) {
          logger.error('❌ Error fetching testimonials:', error);
          set({
            loading: false,
            error: error.message || 'Failed to load testimonials',
            testimonials: []
          });
          throw error;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Reset store to initial state
       */
      resetStore: () => {
        set({
          testimonials: [],
          loading: false,
          error: null,
          pagination: {},
          currentPage: 1,
          lastFetched: null
        });
      },

      /**
       * Set current page
       * @param {number} page - Page number
       */
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'testimonial-store',
      partialize: (state) => ({
        testimonials: state.testimonials,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Testimonial store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
        }
      },
    }
  )
);

export default useTestimonialStore;