import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { businessService } from '../services/businessService';
import { logger } from '../utils/logger';

/**
 * Business Store - Zustand store for business-related state management
 * Follows industry standards for state management architecture
 */

const useBusinessStore = create(
  persist(
    (set, get) => ({
      // State
      businessTypes: [],
      loading: false,
      error: null,
      selectedBusinessType: null,
      lastFetched: null,

      // Actions
      /**
       * Fetch all business types from API
       * @param {string} token - Authentication token
       */
      fetchBusinessTypes: async (token) => {
        const state = get();
        
        // Avoid unnecessary re-fetches (cache for 5 minutes)
        const now = Date.now();
        const cacheTime = 5 * 60 * 1000; // 5 minutes
        
        if (state.lastFetched && (now - state.lastFetched) < cacheTime && state.businessTypes.length > 0) {
          logger.log('📦 Using cached business types');
          return state.businessTypes;
        }

        set({ loading: true, error: null });

        try {
          logger.log('🔄 Fetching business types from service...');
          const businessTypes = await businessService.getBusinessTypes(token);
          
          set({
            businessTypes,
            loading: false,
            error: null,
            lastFetched: now,
          });

          logger.log('✅ Business types loaded:', businessTypes.length, 'items');
          return businessTypes;
        } catch (error) {
          logger.error('❌ Error fetching business types:', error);
          set({
            loading: false,
            error: error.message,
          });
          throw error;
        }
      },

      /**
       * Get a specific business type by ID
       * @param {string} id - Business type ID
       * @param {string} token - Authentication token
       */
      getBusinessTypeById: async (id, token) => {
        try {
          // First check if it's already in the store
          const state = get();
          const existingType = state.businessTypes.find(bt => bt.id === id);
          
          if (existingType) {
            set({ selectedBusinessType: existingType });
            return existingType;
          }

          // If not in store, fetch from API
          logger.log('🔄 Fetching specific business type:', id);
          const businessType = await businessService.getBusinessTypeById(id, token);
          
          set({ selectedBusinessType: businessType });
          return businessType;
        } catch (error) {
          logger.error('❌ Error fetching business type:', error);
          set({ error: error.message });
          throw error;
        }
      },

      /**
       * Set selected business type (from existing data)
       * @param {Object} businessType - Business type object
       */
      setSelectedBusinessType: (businessType) => {
        set({ selectedBusinessType: businessType });
      },

      /**
       * Clear selected business type
       */
      clearSelectedBusinessType: () => {
        set({ selectedBusinessType: null });
      },

      /**
       * Create a new business type (admin only)
       * @param {Object} businessTypeData - Business type data
       * @param {string} token - Authentication token
       */
      createBusinessType: async (businessTypeData, token) => {
        try {
          const newBusinessType = await businessService.createBusinessType(businessTypeData, token);
          
          // Update the business types array
          const state = get();
          set({
            businessTypes: [...state.businessTypes, newBusinessType],
          });

          return newBusinessType;
        } catch (error) {
          logger.error('❌ Error creating business type:', error);
          set({ error: error.message });
          throw error;
        }
      },

      /**
       * Update a business type (admin only)
       * @param {string} id - Business type ID
       * @param {Object} businessTypeData - Updated business type data
       * @param {string} token - Authentication token
       */
      updateBusinessType: async (id, businessTypeData, token) => {
        try {
          const updatedBusinessType = await businessService.updateBusinessType(id, businessTypeData, token);
          
          // Update the business types array
          const state = get();
          const updatedTypes = state.businessTypes.map(bt => 
            bt.id === id ? updatedBusinessType : bt
          );
          
          set({
            businessTypes: updatedTypes,
            selectedBusinessType: state.selectedBusinessType?.id === id ? updatedBusinessType : state.selectedBusinessType,
          });

          return updatedBusinessType;
        } catch (error) {
          logger.error('❌ Error updating business type:', error);
          set({ error: error.message });
          throw error;
        }
      },

      /**
       * Delete a business type (admin only)
       * @param {string} id - Business type ID
       * @param {string} token - Authentication token
       */
      deleteBusinessType: async (id, token) => {
        try {
          await businessService.deleteBusinessType(id, token);
          
          // Update the business types array
          const state = get();
          const updatedTypes = state.businessTypes.filter(bt => bt.id !== id);
          
          set({
            businessTypes: updatedTypes,
            selectedBusinessType: state.selectedBusinessType?.id === id ? null : state.selectedBusinessType,
          });
        } catch (error) {
          logger.error('❌ Error deleting business type:', error);
          set({ error: error.message });
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
          businessTypes: [],
          loading: false,
          error: null,
          selectedBusinessType: null,
          lastFetched: null,
        });
      },

      /**
       * Get business type by ID from cached data
       * @param {string} id - Business type ID
       * @returns {Object|null} Business type object or null
       */
      getBusinessTypeByIdFromCache: (id) => {
        const state = get();
        return state.businessTypes.find(bt => bt.id === id) || null;
      },

      /**
       * Get business types as options for select dropdowns
       * @returns {Array} Array of { value, label } objects
       */
      getBusinessTypeOptions: () => {
        const state = get();
        return state.businessTypes.map(bt => ({
          value: bt.id,
          label: bt.name,
          ...bt
        }));
      },
    }),
    {
      name: 'business-store',
      partialize: (state) => ({
        businessTypes: state.businessTypes,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Business store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
        }
      },
    }
  )
);

export default useBusinessStore;
