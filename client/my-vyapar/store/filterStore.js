// store/filterStore.js - Zustand store for filter management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import { searchPlans } from '../services/filterService';

// Create Zustand store for filters
export const useFilterStore = create(
  persist(
    (set, get) => ({
      // State
      filters: {
        search: '',
        minPrice: '',
        maxPrice: '',
        category: '',
        businessType: '',
        billingCycle: '',
        features: [],
        sortBy: 'price_asc',
        page: 1,
        limit: 10
      },
      searchResults: [],
      loading: false,
      error: null,
      pagination: {},
      lastSearch: null,

      // Actions
      /**
       * Update filter field
       * @param {string} field - Filter field name
       * @param {any} value - Filter value
       */
      updateFilter: (field, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [field]: value
          }
        }));
      },

      /**
       * Set multiple filters at once
       * @param {Object} newFilters - Filter object
       */
      setFilters: (newFilters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters
          }
        }));
      },

      /**
       * Clear all filters
       */
      clearFilters: () => {
        set({
          filters: {
            search: '',
            minPrice: '',
            maxPrice: '',
            category: '',
            businessType: '',
            billingCycle: '',
            features: [],
            sortBy: 'price_asc',
            page: 1,
            limit: 10
          }
        });
      },

      /**
       * Search plans with current filters
       * @returns {Promise<Array>} Search results
       */
      searchPlans: async () => {
        const state = get();
        
        set({ loading: true, error: null });

        try {
          logger.log('🔄 Searching plans with filters:', state.filters);
          
          const response = await searchPlans(state.filters);
          
          let searchResults = [];
          let pagination = {};

          // Handle different response formats
          if (response.data) {
            if (Array.isArray(response.data)) {
              searchResults = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              searchResults = response.data.data;
              pagination = response.data.pagination || {};
            }
          } else if (Array.isArray(response)) {
            searchResults = response;
          }

          set({
            searchResults,
            loading: false,
            error: null,
            pagination,
            lastSearch: Date.now()
          });

          logger.log('✅ Search completed:', searchResults.length, 'results found');
          return searchResults;
        } catch (error) {
          logger.error('❌ Search error:', error);
          set({
            loading: false,
            error: error.message || 'Search failed',
            searchResults: []
          });
          throw error;
        }
      },

      /**
       * Set search results directly (for manual updates)
       * @param {Array} results - Search results
       */
      setSearchResults: (results) => {
        set({ searchResults: results });
      },

      /**
       * Set pagination
       * @param {Object} pagination - Pagination object
       */
      setPagination: (pagination) => {
        set({ pagination });
      },

      /**
       * Set current page
       * @param {number} page - Page number
       */
      setPage: (page) => {
        set((state) => ({
          filters: {
            ...state.filters,
            page
          }
        }));
      },

      /**
       * Set sort order
       * @param {string} sortBy - Sort option
       */
      setSortBy: (sortBy) => {
        set((state) => ({
          filters: {
            ...state.filters,
            sortBy,
            page: 1 // Reset to first page when sorting changes
          }
        }));
      },

      /**
       * Toggle feature filter
       * @param {string} feature - Feature name
       */
      toggleFeature: (feature) => {
        set((state) => {
          const features = state.filters.features.includes(feature)
            ? state.filters.features.filter(f => f !== feature)
            : [...state.filters.features, feature];
          
          return {
            filters: {
              ...state.filters,
              features,
              page: 1 // Reset to first page when filters change
            }
          };
        });
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
          filters: {
            search: '',
            minPrice: '',
            maxPrice: '',
            category: '',
            businessType: '',
            billingCycle: '',
            features: [],
            sortBy: 'price_asc',
            page: 1,
            limit: 10
          },
          searchResults: [],
          loading: false,
          error: null,
          pagination: {},
          lastSearch: null
        });
      },
    }),
    {
      name: 'filter-store',
      partialize: (state) => ({
        filters: state.filters,
        lastSearch: state.lastSearch
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Filter store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
        }
      },
    }
  )
);

export default useFilterStore;
