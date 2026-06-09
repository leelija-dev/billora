// store/authStoreZustand.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logoutUser, checkSession, registerUser, loginUser } from '../services/authService';
import toastService from '../services/toastService';

// ✅ Generate unique tab ID to prevent self-broadcast
const TAB_ID = Math.random().toString(36).substring(7);
let isLoggingOut = false;
let logoutPromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true, // ✅ CHANGE THIS: Start with true to show skeletons
      error: null,

      checkAuthStatus: async () => {
        // Don't set loading here since it's already true
        try {
          const response = await checkSession();

          if (response.status === true && response.user) {
            set({
              user: response.user,
              isLoggedIn: true,
              isLoading: false, // ✅ Set to false after check completes
            });

            localStorage.setItem('user', JSON.stringify(response.user));
            return true;
          } else {
            set({ user: null, isLoggedIn: false, isLoading: false }); // ✅ Set to false
            localStorage.removeItem('user');
            return false;
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ isLoading: false, isLoggedIn: false }); // ✅ Set to false on error
          return false;
        }
      },

      // ... rest of your store methods remain the same
      
      login: async (email, password) => {
        console.log('📝 Store login called for email:', email);
        
        set({ isLoading: true, error: null });
        
        const loadingToastId = toastService.showLoading('Logging in...');
        
        try {
          const response = await loginUser({ email, password });
          const responseData = response.data;
          
          console.log('📦 Login response:', responseData);
          
          if (!responseData?.status) {
            const errorMessage = responseData?.message || 'Login failed. Please try again.';
            
            toastService.updateToError(loadingToastId, errorMessage);
            
            set({
              isLoading: false,
              error: errorMessage,
              user: null,
              isLoggedIn: false
            });
            
            return { success: false, error: errorMessage };
          }
          
          const userData = responseData.user;
          const token = responseData.token;
          
          if (!userData || !token) {
            const errorMessage = 'Invalid response from server';
            
            toastService.updateToError(loadingToastId, errorMessage);
            
            set({
              isLoading: false,
              error: errorMessage,
              user: null,
              isLoggedIn: false
            });
            
            return { success: false, error: errorMessage };
          }
          
          set({
            user: userData,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
          
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('auth_token', token);
          
          toastService.updateToSuccess(
            loadingToastId,
            `Welcome back, ${userData?.name || userData?.email?.split('@')[0] || 'User'}!`
          );
          
          try {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({
              type: 'LOGIN',
              user: userData,
              token: token,
              sourceTabId: TAB_ID,
              timestamp: Date.now()
            });
            setTimeout(() => channel.close(), 100);
          } catch (error) {
            console.error('Broadcast error:', error);
          }
          
          window.dispatchEvent(new Event("userLoggedIn"));
          console.log('✅ Store login successful');
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          return { success: true, user: userData };
          
        } catch (error) {
          console.error('❌ Login error:', error);
          
          let errorMessage = '';
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = 'Login failed. Please try again.';
          }
          
          toastService.updateToError(loadingToastId, errorMessage);
          
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isLoggedIn: false
          });
          
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        console.log('📝 Store register called with user:', userData?.email);
        set({ isLoading: true, error: null });

        const loadingToastId = toastService.showLoading('Creating your account...');

        try {
          const response = await registerUser(userData);

          if (response && response.data) {
            if (response.data.status === true) {
              const userDataResponse = response.data.data;
              
              console.log('✅ Registration successful!');
              
              set({ 
                isLoading: false,
                error: null 
              });
              
              localStorage.setItem('pending_verification_email', userDataResponse.email);
              
              toastService.updateToSuccess(
                loadingToastId,
                'Registration successful! Please check your email to verify your account.'
              );
              
              const channel = new BroadcastChannel('auth_channel');
              channel.postMessage({
                type: 'REGISTRATION',
                email: userDataResponse.email,
                sourceTabId: TAB_ID
              });
              setTimeout(() => channel.close(), 100);

              await new Promise(resolve => setTimeout(resolve, 1500));

              return { 
                success: true, 
                user: userDataResponse,
                message: 'Registration successful! Please check your email to verify your account.'
              };
            } else {
              const errorMessage = response.data.message || 'Registration failed';
              toastService.updateToError(loadingToastId, errorMessage);
              set({
                user: null,
                isLoggedIn: false,
                isLoading: false,
                error: errorMessage,
              });
              return { success: false, error: errorMessage };
            }
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          console.error('❌ Store register error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          toastService.updateToError(loadingToastId, errorMessage);
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        if (isLoggingOut) {
          console.log('⚠️ Logout already in progress, skipping...');
          return;
        }
        
        if (logoutPromise) {
          console.log('Logout already in progress, returning existing promise');
          return logoutPromise;
        }
        
        isLoggingOut = true;
        
        const loadingToastId = toastService.showLoading('Logging out...');
        
        logoutPromise = (async () => {
          set({ isLoading: true });
          
          try {
            await logoutUser();
          } catch (error) {
            console.error("Logout API error:", error);
          }

          try {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({
              type: 'LOGOUT',
              sourceTabId: TAB_ID,
              timestamp: Date.now(),
              skipToast: true
            });
            setTimeout(() => channel.close(), 100);
          } catch (error) {
            console.error("Broadcast logout error:", error);
          }

          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("user");

          sessionStorage.clear();

          set({
            user: null,
            token: null,
            isLoggedIn: false,
            company: null,
            isLoading: false
          });

          window.dispatchEvent(new Event("userLoggedOut"));
          
          toastService.updateToSuccess(
            loadingToastId,
            'Successfully logged out! See you soon!'
          );
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setTimeout(() => {
            isLoggingOut = false;
            logoutPromise = null;
          }, 500);
        })();
        
        return logoutPromise;
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
        toastService.showSuccess('Profile updated successfully!');
      },

      initializeAuth: async () => {
        console.log('Initializing auth...');
        // isLoading is already true, so we don't set it again
        await get().checkAuthStatus();
      },

      clearError: () => set({ error: null }),

      checkPlanPurchaseEligibility: async (planId) => {
        const { user, isLoggedIn } = get();

        console.log('🔍 Checking plan purchase eligibility for plan:', planId);

        if (!isLoggedIn || !user) {
          return { canPurchase: true, reason: 'User not logged in', action: 'login_required' };
        }

        try {
          const currentPlanId = user.plan_id;

          if (!currentPlanId) {
            return { canPurchase: true, reason: 'No active plan', action: 'new_purchase' };
          }

          if (currentPlanId === planId) {
            return {
              canPurchase: false,
              reason: 'You already have this active plan',
              action: 'cannot_purchase'
            };
          }

          return {
            canPurchase: true,
            reason: 'Can upgrade plan',
            action: 'upgrade',
            currentPlanId: currentPlanId
          };

        } catch (error) {
          console.error('Error checking plan eligibility:', error);
          return { canPurchase: false, reason: 'Error checking eligibility' };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrating...', state);
        if (state) {
          // Rehydrate is happening, keep loading true
          setTimeout(() => {
            state?.checkAuthStatus();
          }, 100);
        }
      },
    }
  )
);

// ✅ Cross-tab synchronization
if (typeof window !== 'undefined') {
  let isProcessingLogout = false;
  
  const channel = new BroadcastChannel('auth_channel');

  channel.onmessage = async (event) => {
    if (event.data.sourceTabId === TAB_ID) {
      console.log('📢 Ignoring self-broadcast message');
      return;
    }

    console.log('📢 Received message from another tab:', event.data.type);

    if (event.data.type === 'LOGIN') {
      const { user, token } = event.data;

      if (token && user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        useAuthStore.setState({
          user: user,
          isLoggedIn: true,
          isLoading: false,
        });
        
        // toastService.showSuccess(`Welcome back, ${user?.name || user?.email?.split('@')[0] || 'User'}!`);
      } else {
        useAuthStore.getState().checkAuthStatus();
      }
    } else if (event.data.type === 'LOGOUT') {
      if (isProcessingLogout) {
        console.log('⚠️ Already processing logout, skipping...');
        return;
      }
      
      console.log('🔓 Logout detected from another tab - clearing state');
      
      isProcessingLogout = true;
      
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("user");
      
      sessionStorage.clear();
      
      useAuthStore.setState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      });
      
      if (!event.data.skipToast) {
        toastService.showInfo('You have been logged out from another tab');
      }
      
      setTimeout(() => {
        isProcessingLogout = false;
      }, 500);
    }
  };

  window.addEventListener('beforeunload', () => {
    channel.close();
  });
}

// Export hooks
export const useHasActivePlan = () => {
  const user = useAuthStore((state) => state.user);
  return user?.is_active === 1 || false;
};

export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);