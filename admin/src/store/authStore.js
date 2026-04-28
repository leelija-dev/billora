// src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import { usePermissionStore } from './permissionStore';
import toast from 'react-hot-toast';

// ✅ Generate unique tab ID to prevent self-broadcast
const TAB_ID = Math.random().toString(36).substring(7);

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
          
          const data = response.data;
          const user = data.user;
          const token = data.token;
          
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('auth_token', token);
          
          const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
          setPermissionUser(user);
          
          if (user && user.plan_id) {
            fetchUserPermissions(user.id);
          }
          
          // ✅ Broadcast to OTHER tabs with TOKEN
          const channel = new BroadcastChannel('auth_channel');
          channel.postMessage({ 
            type: 'LOGIN', 
            user: user,
            token: token,
            sourceTabId: TAB_ID 
          });
          setTimeout(() => channel.close(), 100);
          
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          
          const errorMessage = error.message || 'Login failed';
          toast.error(errorMessage);
          return { success: false, error: error };
        }
      },

      logout: async () => {
        const { user } = get();
        
        set({ isLoading: true });
        
        try {
          if (user?.id) {
            await authService.logout(user.id);
          }
        } catch (err) {
          console.log('Logout API call failed:', err);
        }
        
        set({
          user: null,
          company: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        
        const { clearPermissions } = usePermissionStore.getState();
        clearPermissions();
        
        // ✅ Broadcast to OTHER tabs only
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ 
          type: 'LOGOUT',
          sourceTabId: TAB_ID 
        });
        setTimeout(() => channel.close(), 100);
        
        toast.success('Logged out successfully');
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
              localStorage.setItem('auth_token', token);
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
  let sessionCheckInterval;
  
  const startSessionCheck = () => {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    
    sessionCheckInterval = setInterval(async () => {
      try {
        const currentState = useAuthStore.getState();
        
        // Only check if not authenticated
        if (!currentState.isAuthenticated && !currentState.isLoading) {
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
            clearInterval(sessionCheckInterval);
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
    if (state.isAuthenticated && sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
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
        const { user, token } = event.data;
        
        console.log('Login detected from another tab/app!');
        console.log('User:', user?.email);
        console.log('Token received:', token?.substring(0, 20) + '...');
        console.log('Timestamp:', event.data.timestamp);
        console.log('Current time:', Date.now());
        console.log('Age of message:', Date.now() - event.data.timestamp, 'ms');
        
        if (token && user) {
          try {
            // Store token in localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Token and user stored in localStorage');
            
            // DIRECTLY update Zustand store (NO API CALL!)
            useAuthStore.setState({
              user: user,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log('Zustand store updated directly');
            
            // Also update permission store
            const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
            if (setPermissionUser) {
              setPermissionUser(user);
              console.log('Permission store user updated');
            }
            if (user?.plan_id && fetchUserPermissions) {
              fetchUserPermissions(user.id);
              console.log('User permissions fetched');
            }
            
            // Show notification
            toast.success(`Logged in as ${user?.email} from Next.js!`);
            console.log('Successfully synced login!');
            
          } catch (error) {
            console.error('Error processing login broadcast:', error);
          }
        } else {
          console.log('Missing token or user in broadcast');
          console.log('Token exists:', !!token);
          console.log('User exists:', !!user);
          console.log('Falling back to auth check');
          useAuthStore.getState().checkAuth();
        }
      } else if (event.data.type === 'LOGOUT') {
        console.log('Logout detected from another tab - clearing state');
        useAuthStore.getState().logout();
        toast.success('Logged out from another app');
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
