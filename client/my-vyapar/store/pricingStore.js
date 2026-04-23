// store/pricingStore.js - Zustand store for pricing management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import { getPlans, subscribePlan } from '../services/pricingService';

// Create Zustand store for pricing
export const usePricingStore = create(
  persist(
    (set, get) => ({
      // State
      plans: [],
      loading: false,
      error: null,
      selectedPlan: null,
      subscription: null,
      lastFetched: null,
      categories: [],
      businessTypes: [],

      // Actions
      /**
       * Fetch all plans
       * @returns {Promise<Array>} Array of plans
       */
      fetchPlans: async () => {
        const state = get();
        
        // Avoid unnecessary re-fetches (cache for 10 minutes)
        const now = Date.now();
        const cacheTime = 10 * 60 * 1000; // 10 minutes
        
        if (state.lastFetched && (now - state.lastFetched) < cacheTime && state.plans.length > 0) {
          logger.log('📦 Using cached plans');
          return state.plans;
        }

        set({ loading: true, error: null });

        try {
          logger.log('🔄 Fetching plans from service...');
          const response = await getPlans();
          
          let plansData = [];
          let categories = new Set();
          let businessTypes = new Set();

          // Handle different response formats
          if (response.data) {
            if (Array.isArray(response.data)) {
              plansData = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              plansData = response.data.data;
            }
          } else if (Array.isArray(response)) {
            plansData = response;
          }

          // Extract unique categories and business types
          plansData.forEach(plan => {
            if (plan.category) categories.add(plan.category);
            if (plan.businessType?.name) businessTypes.add(plan.businessType.name);
          });

          set({
            plans: plansData,
            categories: Array.from(categories),
            businessTypes: Array.from(businessTypes),
            loading: false,
            error: null,
            lastFetched: now
          });

          logger.log('✅ Plans loaded:', plansData.length, 'items');
          return plansData;
        } catch (error) {
          logger.error('❌ Error fetching plans:', error);
          set({
            loading: false,
            error: error.message || 'Failed to load plans',
            plans: []
          });
          throw error;
        }
      },

      /**
       * Select a plan
       * @param {Object} plan - Plan object
       */
      selectPlan: (plan) => {
        set({ selectedPlan: plan });
        logger.log('📋 Plan selected:', plan?.name);
        
        // Store selected plan in localStorage for checkout
        if (plan) {
          localStorage.setItem('selectedPlan', JSON.stringify(plan));
        }
      },

      /**
       * Subscribe to a plan
       * @param {Object} subscriptionData - Subscription data
       * @returns {Promise<Object>} Subscription result
       */
      subscribeToPlan: async (subscriptionData) => {
        set({ loading: true, error: null });

        try {
          logger.log('🔄 Subscribing to plan...');
          const response = await subscribePlan(subscriptionData);
          
          set({
            subscription: response,
            loading: false,
            error: null
          });

          logger.log('✅ Plan subscription successful:', response);
          
          // Clear selected plan after successful subscription
          set({ selectedPlan: null });
          localStorage.removeItem('selectedPlan');

          return response;
        } catch (error) {
          logger.error('❌ Plan subscription error:', error);
          set({
            loading: false,
            error: error.message || 'Failed to subscribe to plan',
            subscription: null
          });
          throw error;
        }
      },

      /**
       * Set plans directly (for manual updates)
       * @param {Array} plans - Array of plans
       */
      setPlans: (plans) => {
        set({ plans });
      },

      /**
       * Set subscription
       * @param {Object} subscription - Subscription object
       */
      setSubscription: (subscription) => {
        set({ subscription });
      },

      /**
       * Clear selected plan
       */
      clearSelectedPlan: () => {
        set({ selectedPlan: null });
        localStorage.removeItem('selectedPlan');
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
          plans: [],
          loading: false,
          error: null,
          selectedPlan: null,
          subscription: null,
          lastFetched: null,
          categories: [],
          businessTypes: []
        });
      },

      /**
       * Get plans by category
       * @param {string} category - Category name
       * @returns {Array} Filtered plans
       */
      getPlansByCategory: (category) => {
        const state = get();
        if (!category || category === 'All') return state.plans;
        return state.plans.filter(plan => plan.category === category);
      },

      /**
       * Get plans by business type
       * @param {string} businessType - Business type name
       * @returns {Array} Filtered plans
       */
      getPlansByBusinessType: (businessType) => {
        const state = get();
        if (!businessType) return state.plans;
        return state.plans.filter(plan => plan.businessType?.name === businessType);
      },

      /**
       * Get plans by billing cycle
       * @param {string} billingCycle - 'monthly' or 'yearly'
       * @returns {Array} Filtered plans
       */
      getPlansByBillingCycle: (billingCycle) => {
        const state = get();
        if (!billingCycle) return state.plans;
        return state.plans.filter(plan => plan.billingCycle === billingCycle);
      },
    }),
    {
      name: 'pricing-store',
      partialize: (state) => ({
        plans: state.plans,
        selectedPlan: state.selectedPlan,
        subscription: state.subscription,
        lastFetched: state.lastFetched,
        categories: state.categories,
        businessTypes: state.businessTypes
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Pricing store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
        }
      },
    }
  )
);

export default usePricingStore;
