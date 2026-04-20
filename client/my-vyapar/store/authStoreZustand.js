// store/authStoreZustand.js - Industry-standard Zustand store for authentication
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Import secure storage utilities
import { secureStorage, validateToken } from '../utils/secureStorage';

// Create Zustand store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoggedIn: false,
      hasActivePlan: false,
      isCheckingPlan: false,
      isLoading: false,
      error: null,

      // Actions
      login: (userData, token) => {
        console.log('MyVyapar: Login called with:', { userData, token });
        
        // Save plan data if user has active plan
        if (userData.is_active && userData.plan_id) {
          const userId = userData._id || userData.id;
          if (userId) {
            const planData = {
              active: true,
              is_active: true,
              planId: userData.plan_id,
              plan_id: userData.plan_id,
              businessTypeId: userData.business_type_id,
              business_type_id: userData.business_type_id,
              purchaseDate: userData.created_at || new Date().toISOString(),
              created_at: userData.created_at || new Date().toISOString()
            };
            
            secureStorage.savePlanData(userId, planData);
          }
        }
        
        // Update state (Zustand persist will handle localStorage)
        set({
          user: userData,
          token: token,
          isLoggedIn: true,
          error: null,
        });
        
        // Check plan status
        get().checkPlanPurchaseStatus();
        
        // Dispatch event for other components
        window.dispatchEvent(new Event("userLoggedIn"));
      },

      logout: async () => {
        try {
          // Clear plan data from secure storage
          const { user } = get();
          if (user) {
            const userId = user._id || user.id;
            secureStorage.removePlanData(userId);
          }
          
          // Update state (Zustand persist will handle localStorage)
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            hasActivePlan: false,
            error: null,
          });
          
          // Clear localStorage directly as well
          localStorage.removeItem('auth-storage');
          
          // Dispatch event
          window.dispatchEvent(new Event("userLoggedOut"));
          
        } catch (error) {
          set({ error: error.message });
        }
      },

      updateUser: (userData) => {
        // Update state (Zustand persist will handle localStorage)
        set({ user: userData });
      },

      checkPlanPurchaseStatus: () => {
        const { user } = get();
        
        try {
          const userId = user?._id || user?.id;

          if (!userId) {
            set({ hasActivePlan: false });
            return;
          }

          const planData = secureStorage.getPlanData(userId);

          if (!planData) {
            set({ hasActivePlan: false });
            return;
          }

          const purchaseTime = new Date(planData.purchaseDate).getTime();
          const currentTime = new Date().getTime();
          const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);

          const isValid = daysSincePurchase <= 365;
          const isActive = planData.active || planData.is_active;
          
          const hasActivePlan = isActive && isValid;
          set({ hasActivePlan });

        } catch (error) {
          set({ hasActivePlan: false, error: error.message });
        }
      },

      initializeAuth: () => {
        console.log('MyVyapar: Initializing auth...');
        set({ isLoading: true });
        
        // Zustand persist will handle initialization
        // This function is mainly for manual initialization if needed
        set({ isLoading: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        hasActivePlan: state.hasActivePlan,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('MyVyapar: Auth store rehydrating...', state);
        
        if (state) {
          // Check authentication state after rehydration
          const hasToken = !!state.token;
          const hasUser = !!state.user;
          const isAuthenticated = hasToken && hasUser;
          
          console.log('MyVyapar: Rehydration check:', {
            hasToken,
            hasUser,
            isAuthenticated,
            token: state.token,
            user: state.user
          });
          
          // Update isLoggedIn based on actual data
          state.isLoggedIn = isAuthenticated;
          
          // Check plan status after rehydration
          if (isAuthenticated && state.user) {
            const userId = state.user._id || state.user.id;
            const planData = secureStorage.getPlanData(userId);
            
            if (planData) {
              const purchaseTime = new Date(planData.purchaseDate).getTime();
              const currentTime = new Date().getTime();
              const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);
              const isValid = daysSincePurchase <= 365;
              const isActive = planData.active || planData.is_active;
              
              state.hasActivePlan = isActive && isValid;
              console.log('MyVyapar: Plan status after rehydrate:', state.hasActivePlan);
            }
          }
        }
        
        console.log('MyVyapar: Auth store rehydrated');
      },
    }
  )
);

// Export selector hooks for better performance
export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useHasActivePlan = () => useAuthStore((state) => state.hasActivePlan);
