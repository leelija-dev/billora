import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loginUser, logoutUser, checkSession } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          const response = await checkSession();
          
          if (response.status && response.user) {
            set({
              user: response.user,
              isLoggedIn: true,
              isLoading: false,
            });
            
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Broadcast to other tabs
            if (typeof window !== 'undefined') {
              const channel = new BroadcastChannel('auth_channel');
              channel.postMessage({ type: 'LOGIN', user: response.user });
            }
            
            return true;
          } else {
            set({ user: null, isLoggedIn: false, isLoading: false });
            localStorage.removeItem('user');
            return false;
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ isLoading: false, isLoggedIn: false });
          return false;
        }
      },

      login: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser(userData);
          
          if (response.data.status) {
            const user = response.data.user;
            const token = response.data.token;
            
            set({
              user: user,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            
            localStorage.setItem('user', JSON.stringify(user));
            if (token) localStorage.setItem('auth_token', token);
            
            // Broadcast to other tabs
            if (typeof window !== 'undefined') {
              const channel = new BroadcastChannel('auth_channel');
              channel.postMessage({ type: 'LOGIN', user: user });
            }
            
            window.dispatchEvent(new Event("userLoggedIn"));
            
            return { success: true };
          } else {
            throw new Error(response.data.message || 'Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: error.message,
            isLoggedIn: false,
          });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await logoutUser();
        } catch (err) {
          console.log('Logout API call failed:', err);
        }
        
        set({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: null,
        });
        
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        
        if (typeof window !== 'undefined') {
          const channel = new BroadcastChannel('auth_channel');
          channel.postMessage({ type: 'LOGOUT' });
        }
        
        window.dispatchEvent(new Event("userLoggedOut"));
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
      },

      initializeAuth: async () => {
        console.log('Initializing auth...');
        await get().checkAuthStatus();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrating...', state);
        if (state && !state.isLoggedIn) {
          setTimeout(() => {
            state?.checkAuthStatus();
          }, 100);
        }
      },
    }
  )
);

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('auth_channel');
  channel.onmessage = (event) => {
    if (event.data.type === 'LOGIN') {
      console.log('Login detected from another tab - refreshing...');
      window.location.reload();
    } else if (event.data.type === 'LOGOUT') {
      console.log('Logout detected from another tab - refreshing...');
      window.location.reload();
    }
  };
}

export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);


// // store/authStoreZustand.js - Industry-standard Zustand store for authentication
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { logger } from '../utils/logger';

// // Import secure storage utilities
// import { secureStorage, validateToken } from '../utils/secureStorage';

// // Create Zustand store
// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       user: null,
//       token: null,
//       isLoggedIn: false,
//       hasActivePlan: false,
//       isCheckingPlan: false,
//       isLoading: false,
//       error: null,

//       // Actions
//       login: (userData, token) => {
//         logger.log('MyVyapar: Login called with:', { userData, token });
        
//         // Save plan data if user has active plan
//         if (userData.is_active && userData.plan_id) {
//           const userId = userData._id || userData.id;
//           if (userId) {
//             const planData = {
//               active: true,
//               is_active: true,
//               planId: userData.plan_id,
//               plan_id: userData.plan_id,
//               businessTypeId: userData.business_type_id,
//               business_type_id: userData.business_type_id,
//               purchaseDate: userData.created_at || new Date().toISOString(),
//               created_at: userData.created_at || new Date().toISOString()
//             };
            
//             secureStorage.savePlanData(userId, planData);
//           }
//         }
        
//         // Update state (Zustand persist will handle localStorage)
//         set({
//           user: userData,
//           token: token,
//           isLoggedIn: true,
//           error: null,
//         });
        
//         // Check plan status
//         get().checkPlanPurchaseStatus();
        
//         // Dispatch event for other components
//         window.dispatchEvent(new Event("userLoggedIn"));
//       },

//       logout: async () => {
//         try {
//           // Clear plan data from secure storage
//           const { user } = get();
//           if (user) {
//             const userId = user._id || user.id;
//             secureStorage.removePlanData(userId);
//           }
          
//           // Update state (Zustand persist will handle localStorage)
//           set({
//             user: null,
//             token: null,
//             isLoggedIn: false,
//             hasActivePlan: false,
//             error: null,
//           });
          
//           // Clear localStorage directly as well
//           localStorage.removeItem('auth-storage');
          
//           // Dispatch event
//           window.dispatchEvent(new Event("userLoggedOut"));
          
//         } catch (error) {
//           set({ error: error.message });
//         }
//       },

//       updateUser: (userData) => {
//         // Update state (Zustand persist will handle localStorage)
//         set({ user: userData });
//       },

//       checkPlanPurchaseStatus: () => {
//         const { user } = get();
        
//         try {
//           const userId = user?._id || user?.id;

//           if (!userId) {
//             set({ hasActivePlan: false });
//             return;
//           }

//           const planData = secureStorage.getPlanData(userId);

//           if (!planData) {
//             set({ hasActivePlan: false });
//             return;
//           }

//           const purchaseTime = new Date(planData.purchaseDate).getTime();
//           const currentTime = new Date().getTime();
//           const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);

//           const isValid = daysSincePurchase <= 365;
//           const isActive = planData.active || planData.is_active;
          
//           const hasActivePlan = isActive && isValid;
//           set({ hasActivePlan });

//         } catch (error) {
//           set({ hasActivePlan: false, error: error.message });
//         }
//       },

//       initializeAuth: () => {
//         logger.log('MyVyapar: Initializing auth...');
//         set({ isLoading: true });
        
//         // Zustand persist will handle initialization
//         // This function is mainly for manual initialization if needed
//         set({ isLoading: false });
//       },

//       /**
//        * Get user's plan purchase history
//        * @returns {Promise<Array>} Array of plan purchases
//        */
//       getPlanPurchaseHistory: async () => {
//         const { user, token } = get();
        
//         if (!user || !token) {
//           logger.log('No user or token available for plan history');
//           return [];
//         }

//         try {
//           const userId = user._id || user.id || user.customer_id;
//           if (!userId) {
//             logger.log('No user ID found for plan history');
//             return [];
//           }

//           logger.log('Fetching plan purchase history for user:', userId);
          
//           // Use the plan purchase history API
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/plans-purchase-history/${userId}`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const data = await response.json();
//           logger.log('Plan purchase history response:', data);

//           // Handle different response formats - API returns nested structure: {status: true, data: {data: [...], ...}}
//           let purchaseHistory = [];
//           if (data?.data?.data && Array.isArray(data.data.data)) {
//             purchaseHistory = data.data.data;
//           } else if (data?.data && Array.isArray(data.data)) {
//             purchaseHistory = data.data;
//           } else if (Array.isArray(data)) {
//             purchaseHistory = data;
//           } else if (data?.purchase_history && Array.isArray(data.purchase_history)) {
//             purchaseHistory = data.purchase_history;
//           }

//           logger.log('Processed purchase history:', purchaseHistory);
//           return purchaseHistory;

//         } catch (error) {
//           logger.error('Error fetching plan purchase history:', error);
//           return [];
//         }
//       },

//       /**
//        * Check if user can purchase a specific plan
//        * @param {string} planId - Plan ID to check
//        * @returns {Promise<Object>} Purchase eligibility info
//        */
//       checkPlanPurchaseEligibility: async (planId) => {
//         const { user, token, hasActivePlan } = get();
        
//         if (!user || !token) {
//           return { canPurchase: false, reason: 'User not logged in' };
//         }

//         try {
//           // Get user's plan purchase history
//           const purchaseHistory = await get().getPlanPurchaseHistory();
          
//           // Find current active plan from purchase history
//           const currentPlan = purchaseHistory.find(purchase => 
//             purchase.status === 'active' || purchase.is_active
//           );

//           if (!currentPlan) {
//             // No active plan - can purchase any plan
//             return { canPurchase: true, reason: 'No active plan', action: 'new_purchase' };
//           }

//           // Check if trying to purchase the same plan
//           if (currentPlan.plan_id == planId) {
//             // Same plan - check if can renew (only if plan is expired or about to expire)
//             const expiryDate = new Date(currentPlan.expiry_date || currentPlan.end_date);
//             const now = new Date();
//             const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            
//             if (daysUntilExpiry <= 7) { // Allow renewal if less than 7 days left
//               return { canPurchase: true, reason: 'Plan expires soon', action: 'renewal' };
//             } else {
//               return { canPurchase: false, reason: 'Already have this active plan', action: 'cannot_purchase' };
//             }
//           }

//           // Different plan - check if it's an upgrade
//           const currentPlanPrice = parseFloat(currentPlan.amount || currentPlan.price || 0);
//           // We'll need to get the target plan details to compare prices
          
//           return { 
//             canPurchase: true, 
//             reason: 'Can upgrade plan', 
//             action: 'upgrade',
//             currentPlan: currentPlan
//           };

//         } catch (error) {
//           logger.error('Error checking plan purchase eligibility:', error);
//           return { canPurchase: false, reason: 'Error checking eligibility' };
//         }
//       },

//       clearError: () => set({ error: null }),
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         // Only persist these fields
//         user: state.user,
//         token: state.token,
//         isLoggedIn: state.isLoggedIn,
//         hasActivePlan: state.hasActivePlan,
//       }),
//       onRehydrateStorage: () => (state) => {
//         logger.log('MyVyapar: Auth store rehydrating...', state);
        
//         if (state) {
//           // Check authentication state after rehydration
//           const hasToken = !!state.token;
//           const hasUser = !!state.user;
//           const isAuthenticated = hasToken && hasUser;
          
//           logger.log('MyVyapar: Rehydration check:', {
//             hasToken,
//             hasUser,
//             isAuthenticated,
//             token: state.token,
//             user: state.user
//           });
          
//           // Update isLoggedIn based on actual data
//           state.isLoggedIn = isAuthenticated;
          
//           // Check plan status after rehydration
//           if (isAuthenticated && state.user) {
//             const userId = state.user.id || state.user._id;
//             const planData = secureStorage.getPlanData(userId);
            
//             if (planData) {
//               const purchaseTime = new Date(planData.purchaseDate).getTime();
//               const currentTime = new Date().getTime();
//               const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);
//               const isValid = daysSincePurchase <= 365;
//               const isActive = planData.active || planData.is_active;
              
//               state.hasActivePlan = isActive && isValid;
//             }
//           }
//           logger.log('MyVyapar: Plan status after rehydrate:', state.hasActivePlan);
//         }
        
//         logger.log('MyVyapar: Auth store rehydrated');
//       },
//     }
//   )
// );

// // Export selector hooks for better performance
// export const useAuth = () => useAuthStore();
// export const useUser = () => useAuthStore((state) => state.user);
// export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
// export const useHasActivePlan = () => useAuthStore((state) => state.hasActivePlan);
