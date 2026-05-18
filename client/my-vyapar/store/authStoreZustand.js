// store/authStoreZustand.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logoutUser, checkSession, registerUser } from '../services/authService';

// ✅ Generate unique tab ID to prevent self-broadcast
const TAB_ID = Math.random().toString(36).substring(7);
let isLoggingOut = false;
let logoutPromise = null;

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

          if (response.status === true && response.user) {
            set({
              user: response.user,
              isLoggedIn: true,
              isLoading: false,
            });

            localStorage.setItem('user', JSON.stringify(response.user));
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

      login: (userData, token) => {
        console.log('📝 Store login called with user:', userData?.email);
        console.log('📝 Token received:', token?.substring(0, 20) + '...');

        if (!userData || !token) {
          console.error('❌ Store login: Missing userData or token');
          return { success: false, error: 'Missing user data or token' };
        }

        set({
          user: userData,
          isLoggedIn: true,
          isLoading: false,
          error: null,
        });

        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('auth_token', token);

        // ✅ Broadcast to other tabs when Next.js logs in
        console.log('📢🔵 NEXT.js: Preparing to broadcast LOGIN...');
        console.log('📢🔵 NEXT.js: TAB_ID:', TAB_ID);
        console.log('📢🔵 NEXT.js: User data:', userData);
        console.log('📢🔵 NEXT.js: Token length:', token?.length || 0);

        try {
          const channel = new BroadcastChannel('auth_channel');
          const broadcastMessage = {
            type: 'LOGIN',
            user: userData,
            token: token,
            sourceTabId: TAB_ID,
            timestamp: Date.now()
          };

          console.log('📢🔵 NEXT.js: Broadcasting message:', {
            type: broadcastMessage.type,
            userEmail: userData?.email,
            tokenPreview: token?.substring(0, 30) + '...',
            sourceTabId: TAB_ID,
            timestamp: broadcastMessage.timestamp
          });

          if (channel.postMessage) {
            channel.postMessage(broadcastMessage);
            console.log('📢🔵 NEXT.js: Broadcast sent successfully!');
          } else {
            console.error('📢🔵 NEXT.js: BroadcastChannel not supported!');
          }

          setTimeout(() => {
            channel.close();
            console.log('📢🔵 NEXT.js: Broadcast channel closed');
          }, 100);

        } catch (error) {
          console.error('📢🔵 NEXT.js: Broadcast error:', error);
        }

        // ✅ Also emit localStorage event for cross-origin sync
        try {
          console.log('📢🔵 NEXT.js: Emitting localStorage event...');
          const syncEvent = {
            type: 'LOGIN',
            user: userData,
            token: token,
            sourceTabId: TAB_ID,
            timestamp: Date.now(),
            origin: 'nextjs'
          };

          console.log('📢🔵 NEXT.js: Sync event data:', syncEvent);
          console.log('📢🔵 NEXT.js: Current domain:', window.location.hostname);
          console.log('📢🔵 NEXT.js: Setting auth_sync_event...');

          localStorage.setItem('auth_sync_event', JSON.stringify(syncEvent));
          console.log('📢🔵 NEXT.js: auth_sync_event set in localStorage');

          setTimeout(() => {
            console.log('📢🔵 NEXT.js: Triggering storage event...');
            localStorage.removeItem('auth_sync_event');
            console.log('📢🔵 NEXT.js: auth_sync_event removed - should trigger event');
          }, 100);

          console.log('📢🔵 NEXT.js: localStorage event emitted!');
        } catch (error) {
          console.error('📢🔵 NEXT.js: localStorage event error:', error);
        }

        window.dispatchEvent(new Event("userLoggedIn"));

        console.log('✅ Store login successful');
        return { success: true };
      },

      register: async (userData) => {
        console.log('📝 Store register called with user:', userData?.email);
        set({ isLoading: true, error: null });

        try {
          const response = await registerUser(userData);
          console.log('📦 Store register response:', response);

          if (response && response.data) {
            if (response.data.status === true) {
              const userDataResponse = response.data.data;
              
              console.log('✅ Registration successful!');
              console.log('User data:', userDataResponse);
              
              set({ 
                isLoading: false,
                error: null 
              });
              
              localStorage.setItem('pending_verification_email', userDataResponse.email);
              
              const channel = new BroadcastChannel('auth_channel');
              channel.postMessage({
                type: 'REGISTRATION',
                email: userDataResponse.email,
                sourceTabId: TAB_ID
              });
              setTimeout(() => channel.close(), 100);

              console.log('✅ Store register successful - awaiting email verification');
              return { 
                success: true, 
                user: userDataResponse,
                message: response.data.message || 'Registration successful! Please check your email to verify your account.'
              };
            } else {
              const errorMessage = response.data.message || 'Registration failed';
              console.log('❌ Store register error:', errorMessage);
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
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        // ✅ Prevent multiple concurrent logouts
        if (isLoggingOut) {
          console.log('⚠️ Logout already in progress, skipping...');
          return;
        }
        
        if (logoutPromise) {
          console.log('Logout already in progress, returning existing promise');
          return logoutPromise;
        }
        
        isLoggingOut = true;
        
        logoutPromise = (async () => {
          set({ isLoading: true });
          
          try {
            await logoutUser();
          } catch (error) {
            console.error("Logout API error:", error);
          }

          // Broadcast logout to other tabs
          try {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({
              type: 'LOGOUT',
              sourceTabId: TAB_ID,
              timestamp: Date.now(),
              skipToast: true // Add flag to prevent toast on self
            });
            setTimeout(() => channel.close(), 100);
          } catch (error) {
            console.error("Broadcast logout error:", error);
          }

          // Clear local storage
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("user");

          sessionStorage.clear();

          // Reset state
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            company: null,
            isLoading: false
          });

          window.dispatchEvent(new Event("userLoggedOut"));
          
          // Reset locks
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
      },

      initializeAuth: async () => {
        console.log('Initializing auth...');
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
        if (state && !state.isLoggedIn) {
          setTimeout(() => {
            state?.checkAuthStatus();
          }, 100);
        }
      },
    }
  )
);

// ✅ FIX: Cross-tab synchronization - PREVENT INFINITE LOOPS
if (typeof window !== 'undefined') {
  let isProcessingLogout = false;
  
  const channel = new BroadcastChannel('auth_channel');

  channel.onmessage = async (event) => {
    // Ignore messages from same tab
    if (event.data.sourceTabId === TAB_ID) {
      console.log('📢 Ignoring self-broadcast message');
      return;
    }

    console.log('📢 Received message from another tab:', event.data.type);

    if (event.data.type === 'LOGIN') {
      const { user, token } = event.data;

      console.log('✅ Login detected from another tab/app');
      console.log('👤 User:', user?.email);
      console.log('🔑 Token received:', token?.substring(0, 20) + '...');

      if (token && user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        useAuthStore.setState({
          user: user,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        console.log('⚠️ No token in broadcast, falling back to API check');
        useAuthStore.getState().checkAuthStatus();
      }
    } else if (event.data.type === 'LOGOUT') {
      // Prevent processing multiple logout messages
      if (isProcessingLogout) {
        console.log('⚠️ Already processing logout, skipping...');
        return;
      }
      
      console.log('🔓 Logout detected from another tab - clearing state');
      
      isProcessingLogout = true;
      
      // Clear local state without making API call
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
      
      // Reset flag after delay
      setTimeout(() => {
        isProcessingLogout = false;
      }, 500);
    }
  };

  window.addEventListener('beforeunload', () => {
    channel.close();
  });
}

// ✅ Add hasActivePlan as a selector (computed property)
export const useHasActivePlan = () => {
  const user = useAuthStore((state) => state.user);
  return user?.is_active === 1 || false;
};

// Export other hooks
export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);