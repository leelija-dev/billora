// src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import { usePermissionStore } from './permissionStore';
import toast from 'react-hot-toast';

// ✅ Generate unique tab ID to prevent self-broadcast
const TAB_ID = Math.random().toString(36).substring(7);
let isLoggingOut = false;
let logoutPromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      clearLocalAuthState: (skipToast = false) => {
        console.log('🧹 Clearing local auth state only (no API call)');

        // Stop interval
        if (window.sessionCheckInterval) {
          clearInterval(window.sessionCheckInterval);
        }

        // Clear state
        set({
          user: null,
          company: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Clear storage
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');

        // Clear permissions
        const permissionStore = usePermissionStore.getState();
        if (permissionStore.clearPermissions) {
          permissionStore.clearPermissions();
        }

        // Set manual logout flag
        sessionStorage.setItem('manual_logout', 'true');

        // Broadcast to other tabs (but don't show toast for this)
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'LOGOUT', skipToast: true });
        setTimeout(() => channel.close(), 100);
        
        // Only show toast if not skipped
        if (!skipToast) {
          toast.success('Logged out successfully');
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          console.log('🔍 Checking auth status...');
          const response = await authService.checkSession();

          if (response.status && response.user) {
            console.log('✅ User is authenticated:', response.user.email);
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });

            localStorage.setItem('user', JSON.stringify(response.user));

            const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
            setPermissionUser(response.user);

            if (response.user && response.user.plan_id) {
              fetchUserPermissions(response.user.id);
            }

            return true;
          } else {
            console.log('❌ User is not authenticated');
            set({ user: null, isAuthenticated: false, isLoading: false });
            localStorage.removeItem('user');
            return false;
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          console.log('Login attempt with:', credentials.email);
          const response = await authService.login(credentials);

          // Check if login was successful
          if (!response.data || !response.data.status) {
            throw new Error(response.data?.message || 'Login failed');
          }

          const data = response.data;
          const user = data.user;

          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('user', JSON.stringify(user));

          const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
          setPermissionUser(user);

          if (user && user.plan_id) {
            fetchUserPermissions(user.id);
          }

          // ✅ Broadcast to OTHER tabs
          const channel = new BroadcastChannel('auth_channel');
          channel.postMessage({
            type: 'LOGIN',
            user: user,
            sourceTabId: TAB_ID
          });
          setTimeout(() => channel.close(), 100);

          sessionStorage.removeItem('manual_logout');

          if(user?.is_active===1){

            toast.success('Login successful!');
          }else{
            toast.error('Your account is inactive. Please contact support.');
          }
          return { success: true };

        } catch (error) {
          console.error('Login error:', error);

          // Clear any partial state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });

          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');

          // Don't broadcast logout on login failure
          const errorMessage = error.message || 'Login failed';
          toast.error(errorMessage);
          return { success: false, error: error };
        }
      },

      logout: async () => {
        // ✅ Prevent multiple concurrent logouts
        if (isLoggingOut) {
          console.log('⚠️ Logout already in progress, skipping...');
          return;
        }
        
        // ✅ Debounce: return existing promise if logout is in progress
        if (logoutPromise) {
          console.log('Logout already in progress, returning existing promise');
          return logoutPromise;
        }
        
        isLoggingOut = true;
        
        logoutPromise = (async () => {
          set({ isLoading: true });
          
          let apiCalled = false;
          
          try {
            await authService.logout();
            apiCalled = true;
          } catch (err) {
            console.log('Logout API failed (session may already be expired):', err);
            // Don't retry, just clear local state
          }
          
          // ✅ Clear everything without showing duplicate toast
          get().clearLocalAuthState(apiCalled);
          
          set({ isLoading: false });
          
          // Reset locks after delay
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

      updateCompany: (companyData) => {
        set({ company: { ...get().company, ...companyData } });
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refresh) return false;

        try {
          const response = await authService.refreshToken(tokens.refresh);
          set({
            tokens: {
              ...tokens,
              access: response.data.access,
            },
          });
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // Check if user has active plan
      hasActivePlan: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && user && user.plan_id && user.is_active === 1;
      },

      // Check if user has active plan from localStorage (fallback for hydration)
      hasActivePlanFromStorage: () => {
        try {
          const userStr = localStorage.getItem('user');
          console.log('🔍 localStorage user string:', userStr);

          if (!userStr) {
            console.log('❌ No user string in localStorage');
            return false;
          }

          const user = JSON.parse(userStr);
          console.log('🔍 Parsed user from localStorage:', {
            plan_id: user?.plan_id,
            is_active: user?.is_active,
            hasPlanId: !!user?.plan_id,
            isActive: user?.is_active === 1
          });

          const hasActivePlan = user &&  user.is_active === 1;
          console.log('🔍 hasActivePlanFromStorage result:', hasActivePlan);
          return hasActivePlan || false; // Ensure always returns boolean
        } catch (error) {
          console.error('Error checking plan from localStorage:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        company: state.company,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrating...', state);
        if (state && !state.isAuthenticated) {
          setTimeout(() => {
            state?.checkAuth();
          }, 100);
        }
      },
    }
  )
);

// FIX: Cross-tab synchronization - DIRECTLY UPDATE STATE (NO API CALL)
// In React src/store/authStore.js - Update broadcast listener
if (typeof window !== 'undefined') {
  console.log('Setting up BroadcastChannel listener');
  console.log('TAB_ID:', TAB_ID);

  // Add localStorage event listener for cross-origin sync
  window.addEventListener('storage', (event) => {
    console.log('Storage event detected:', {
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      url: event.url
    });

    if (event.key === 'auth_sync_event' && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue);
        console.log('Auth sync event received:', syncData);

        // Only process events from Next.js
        if (syncData.origin === 'nextjs' && syncData.sourceTabId !== TAB_ID) {
          console.log('Processing cross-origin login from Next.js');

          const { user, token } = syncData;

          if (token && user) {
            try {
              // Store in localStorage
              localStorage.setItem('user', JSON.stringify(user));
              console.log('Token and user stored from localStorage event');

              // Update Zustand store
              useAuthStore.setState({
                user: user,
                isAuthenticated: true,
                isLoading: false,
              });
              console.log('Zustand store updated from localStorage event');

              // Update permission store
              const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
              if (setPermissionUser) {
                setPermissionUser(user);
                console.log('Permission store updated from localStorage event');
              }
              if (user?.plan_id && fetchUserPermissions) {
                fetchUserPermissions(user.id);
                console.log('User permissions fetched from localStorage event');
              }

              toast.success(`Logged in as ${user?.email} from Next.js!`);
              console.log('Cross-origin login sync successful!');

            } catch (error) {
              console.error('Error processing localStorage sync:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing localStorage sync event:', error);
      }
    }
  });

  // ✅ Add periodic session check for server-side sync
  console.log('🟢🔴 REACT: Setting up periodic session check...');
  window.sessionCheckInterval = null;

  const startSessionCheck = () => {
    if (window.sessionCheckInterval) {
      clearInterval(window.sessionCheckInterval);
    }

    window.sessionCheckInterval = setInterval(async () => {
      try {
        const currentState = useAuthStore.getState();

        const isManualLogout = sessionStorage.getItem('manual_logout');

        if (
          !currentState.isAuthenticated &&
          !currentState.isLoading &&
          document.visibilityState === 'visible' &&
          !isManualLogout
        ) {
          console.log('🟢🔴 REACT: Periodic session check...');
          const response = await authService.checkSession();

          if (response.status && response.user) {
            console.log('🟢🔴 REACT: Session found via periodic check!');

            // Update store directly without API call
            useAuthStore.setState({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Update permissions
            const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
            if (setPermissionUser) setPermissionUser(response.user);
            if (response.user?.plan_id && fetchUserPermissions) {
              fetchUserPermissions(response.user.id);
            }

            toast.success(`Logged in as ${response.user.email}!`);
            console.log('🟢🔴 REACT: Session sync successful!');

            // Stop checking once authenticated
            clearInterval(window.sessionCheckInterval);
          }
        }
      } catch (error) {
        // Silent fail for periodic checks
        console.log('🟢🔴 REACT: Periodic check failed (expected if not logged in)');
      }
    }, 3000); // Check every 3 seconds
  };

  // Start periodic checking
  startSessionCheck();

  // Stop checking when authenticated
  const unsubscribe = useAuthStore.subscribe((state) => {
    if (state.isAuthenticated && window.sessionCheckInterval) {
      clearInterval(window.sessionCheckInterval);
      console.log('🟢🔴 REACT: Stopping periodic session check - authenticated');
    }
  });

  try {
    const channel = new BroadcastChannel('auth_channel');

    channel.onmessage = (event) => {
      console.log('Raw message received:', event.data);
      console.log('Message type:', event.data?.type);
      console.log('Source tab ID:', event.data?.sourceTabId);
      console.log('My tab ID:', TAB_ID);

      // Ignore messages from same tab
      if (event.data.sourceTabId === TAB_ID) {
        console.log('Ignoring self-broadcast message');
        return;
      }

      console.log('Processing message from another tab/app');

      if (event.data.type === 'LOGIN') {
        const { user } = event.data;

        console.log('Login detected from another tab/app!');
        console.log('User:', user?.email);

        if (user) {
          try {
            // ✅ Save user
            localStorage.setItem('user', JSON.stringify(user));

            // ✅ Update Zustand directly
            useAuthStore.setState({
              user: user,
              isAuthenticated: true,
              isLoading: false,
            });

            // ✅ Update permissions
            const { setUser, fetchUserPermissions } = usePermissionStore.getState();
            if (setUser) setUser(user);
            if (user?.plan_id) fetchUserPermissions(user.id);

            toast.success(`Logged in as ${user?.email}`);
            console.log('✅ Login sync successful');

          } catch (error) {
            console.error('Error processing login broadcast:', error);
          }
        } else {
          console.log('❌ Missing user in broadcast');
          useAuthStore.getState().checkAuth(); // fallback
        }
      } else if (event.data.type === 'LOGOUT') {
        console.log('Logout detected from another tab');
        
        // Check if we should skip toast
        const shouldSkipToast = event.data.skipToast === true;
        
        // Update state without showing toast if requested
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user');
        sessionStorage.setItem('manual_logout', 'true');
        
        // Only show toast if not skipped
        if (!shouldSkipToast) {
          toast.success('Logged out from another app');
        } else {
          console.log('Skipping toast for internal logout broadcast');
        }
      } else {
        console.log('Unknown message type:', event.data?.type);
      }
    };

    console.log('BroadcastChannel listener setup complete');

  } catch (error) {
    console.error('Error setting up BroadcastChannel:', error);
  }

  console.log('All listeners ready - BroadcastChannel + localStorage events');
}