// store/pricingStore.js - Zustand store for pricing management
import { create } from 'zustand';
import { logger } from '../utils/logger';
import { getPlans, subscribePlan } from '../services/pricingService';

// Create Zustand store for pricing (without persist)
export const usePricingStore = create(
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
    allFeatures: [], // Add allFeatures to store

    // Actions
    /**
     * Fetch all plans
     * @returns {Promise<Object>} Object with plans and allFeatures
     */
    fetchPlans: async () => {
      const state = get();
      
      // Avoid unnecessary re-fetches (cache for 10 minutes)
      const now = Date.now();
      const cacheTime = 10 * 60 * 1000; // 10 minutes
      
      if (state.lastFetched && (now - state.lastFetched) < cacheTime && state.plans.length > 0) {
        logger.log('📦 Using cached plans');
        return { plans: state.plans, allFeatures: state.allFeatures };
      }

      set({ loading: true, error: null });

      try {
        logger.log('🔄 Fetching plans from service...');
        const response = await getPlans();
        
        console.log('Full API Response:', response);
        
        let plansData = [];
        let allFeaturesData = [];
        let categories = new Set();
        let businessTypes = new Set();

        // Handle different response formats
        if (response && response.data) {
          // Check if response.data is an array (plans directly)
          if (Array.isArray(response.data)) {
            plansData = response.data;
            // Check if there's an allFeatures property on the response object
            if (response.allFeatures && Array.isArray(response.allFeatures)) {
              allFeaturesData = response.allFeatures;
            }
          } 
          // Check if response.data has data property (nested)
          else if (response.data.data && Array.isArray(response.data.data)) {
            plansData = response.data.data;
            // Check for allFeatures in response.data
            if (response.data.allFeatures && Array.isArray(response.data.allFeatures)) {
              allFeaturesData = response.data.allFeatures;
            }
          }
          
          // Also check for allFeatures at the root of response
          if (!allFeaturesData.length && response.allFeatures && Array.isArray(response.allFeatures)) {
            allFeaturesData = response.allFeatures;
          }
          
          // Check for allFeatures in response.data (if not already found)
          if (!allFeaturesData.length && response.data && response.data.allFeatures && Array.isArray(response.data.allFeatures)) {
            allFeaturesData = response.data.allFeatures;
          }
        } else if (Array.isArray(response)) {
          plansData = response;
        }

        console.log('Extracted plansData:', plansData);
        console.log('Extracted allFeaturesData:', allFeaturesData);

        // Extract unique categories and business types
        plansData.forEach(plan => {
          if (plan.category) categories.add(plan.category);
          if (plan.businessType?.name) businessTypes.add(plan.businessType.name);
        });

        // If allFeaturesData is still empty, try to extract from the first plan's features
        if (!allFeaturesData.length && plansData.length > 0) {
          // Try to get all unique features from all plans
          const featureSet = new Set();
          plansData.forEach(plan => {
            if (plan.features && Array.isArray(plan.features)) {
              plan.features.forEach(f => {
                if (f.name) featureSet.add(f.name);
              });
            }
          });
          // Convert to array of objects with name property
          allFeaturesData = Array.from(featureSet).map(name => ({ name }));
          console.log('Extracted features from plans:', allFeaturesData);
        }

        set({
          plans: plansData,
          allFeatures: allFeaturesData,
          categories: Array.from(categories),
          businessTypes: Array.from(businessTypes),
          loading: false,
          error: null,
          lastFetched: now
        });

        logger.log('✅ Plans loaded:', plansData.length, 'items');
        logger.log('✅ All features loaded:', allFeaturesData.length, 'items');
        
        return { plans: plansData, allFeatures: allFeaturesData };
      } catch (error) {
        logger.error('❌ Error fetching plans:', error);
        set({
          loading: false,
          error: error.message || 'Failed to load plans',
          plans: [],
          allFeatures: []
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
     * Set all features
     * @param {Array} features - Array of features
     */
    setAllFeatures: (features) => {
      set({ allFeatures: features });
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
        businessTypes: [],
        allFeatures: []
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
  })
);

export default usePricingStore;