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

// ✅ FIX: Cross-tab synchronization - DIRECTLY UPDATE STATE (NO API CALL)
// In React src/store/authStore.js - Update the broadcast listener
if (typeof window !== 'undefined') {
  console.log('🟢🔴 REACT: Setting up BroadcastChannel listener');
  const channel = new BroadcastChannel('auth_channel');
  
  channel.onmessage = (event) => {
    console.log('🟢🔴 REACT: Raw message received:', event.data);
    
    // ✅ Ignore messages from the same tab
    if (event.data.sourceTabId === TAB_ID) {
      console.log('🟢🔴 REACT: Ignoring self-broadcast message');
      return;
    }
    
    console.log('🟢🔴 REACT: Processing message type:', event.data.type);
    
    if (event.data.type === 'LOGIN') {
      const { user, token } = event.data;
      
      console.log('✅ REACT: Login detected from another tab/app!');
      console.log('👤 User:', user?.email);
      console.log('🔑 Token received:', token?.substring(0, 20) + '...');
      console.log('🕐 Timestamp:', event.data.timestamp);
      
      if (token && user) {
        // ✅ Store the token in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // ✅ DIRECTLY update Zustand store (NO API CALL!)
        useAuthStore.setState({
          user: user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // ✅ Also update permission store
        const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState();
        if (setPermissionUser) setPermissionUser(user);
        if (user?.plan_id && fetchUserPermissions) {
          fetchUserPermissions(user.id);
        }
        
        // ✅ Show notification
        toast.success(`Logged in as ${user?.email} from Next.js!`);
        console.log('✅ REACT: Successfully synced login!');
      } else {
        console.log('⚠️ REACT: Missing token or user in broadcast');
        useAuthStore.getState().checkAuth();
      }
    } else if (event.data.type === 'LOGOUT') {
      console.log('🔓 REACT: Logout detected from another tab - clearing state');
      useAuthStore.getState().logout();
      toast.success('Logged out from another app');
    }
  };
  
  console.log('🟢🔴 REACT: BroadcastChannel listener ready');
  
  // Keep channel open
  window.addEventListener('beforeunload', () => {
    channel.close();
  });
}

