// store/authStoreZustand.js - Industry-standard Zustand store for authentication
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper functions for localStorage
const saveAuthData = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

const getAuthData = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // Clear plan data for all users
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('plan_')) {
      localStorage.removeItem(key);
    }
  });
};

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
        console.log("Zustand: Login called with:", { userData, token });
        
        // Save to localStorage
        saveAuthData(userData, token);
        
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
            
            console.log("Zustand: Saving plan data to localStorage:", planData);
            localStorage.setItem(`plan_${userId}`, JSON.stringify(planData));
          }
        }
        
        // Update state
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
        console.log("Zustand: Logout called");
        
        try {
          // Clear localStorage
          clearAuthData();
          
          // Update state
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            hasActivePlan: false,
            error: null,
          });
          
          // Dispatch event
          window.dispatchEvent(new Event("userLoggedOut"));
          
        } catch (error) {
          console.error("Zustand: Logout error:", error);
          set({ error: error.message });
        }
      },

      updateUser: (userData) => {
        const currentToken = get().token;
        saveAuthData(userData, currentToken);
        set({ user: userData });
      },

      checkPlanPurchaseStatus: () => {
        const { user } = get();
        
        try {
          const userId = user?._id || user?.id;
          
          console.log("Zustand: Checking plan status for user:", userId);
          console.log("Zustand: User object:", user);

          if (!userId) {
            console.log("Zustand: No user ID found");
            set({ hasActivePlan: false });
            return;
          }

          const planData = localStorage.getItem(`plan_${userId}`);
          console.log("Zustand: Plan data from localStorage:", planData);

          if (!planData) {
            console.log("Zustand: No plan data found in localStorage");
            set({ hasActivePlan: false });
            return;
          }

          const parsed = JSON.parse(planData);
          console.log("Zustand: Parsed plan data:", parsed);

          const purchaseTime = new Date(parsed.purchaseDate).getTime();
          const currentTime = new Date().getTime();
          const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);

          const isValid = daysSincePurchase <= 365;
          console.log("Zustand: Days since purchase:", daysSincePurchase, "Valid:", isValid);

          const isActive = parsed.active || parsed.is_active;
          console.log("Zustand: Plan active status:", isActive);
          
          const hasActivePlan = isActive && isValid;
          set({ hasActivePlan });
          
          console.log("Zustand: Final hasActivePlan set to:", hasActivePlan);

        } catch (error) {
          console.error("Zustand: Error checking plan:", error);
          set({ hasActivePlan: false, error: error.message });
        }
      },

      initializeAuth: () => {
        console.log("Zustand: Initializing auth...");
        set({ isLoading: true });
        
        try {
          const authData = getAuthData();
          
          if (authData.token && authData.user) {
            set({
              user: authData.user,
              token: authData.token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            
            // Check plan status after setting user
            get().checkPlanPurchaseStatus();
          } else {
            set({
              user: null,
              token: null,
              isLoggedIn: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Zustand: Auth initialization error:", error);
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: error.message,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name for localStorage
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        hasActivePlan: state.hasActivePlan,
      }),
    }
  )
);

// Export selector hooks for better performance
export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useHasActivePlan = () => useAuthStore((state) => state.hasActivePlan);
