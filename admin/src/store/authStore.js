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

      // In React src/store/authStore.js - Update the login function

login: async (credentials) => {
  set({ isLoading: true });
  try {
    console.log('Login attempt with:', credentials.email);
    const response = await authService.login(credentials);
    
    const data = response.data;
    const user = data.user;
    const token = data.token;  // ✅ Get the token
    
    set({
      user: user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);  // ✅ Store token
    
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
      token: token,  // ✅ ADD THIS - Send the token!
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

// ✅ Fix: Cross-tab synchronization - Don't reload current tab
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('auth_channel');
  
  channel.onmessage = (event) => {
    // ✅ Ignore messages from the same tab
    if (event.data.sourceTabId === TAB_ID) {
      console.log('📢 Ignoring self-broadcast message');
      return;
    }
    
    console.log('📢 Received message from another tab:', event.data.type);
    
    if (event.data.type === 'LOGIN') {
      console.log('✅ Login detected from another tab - updating state');
      // Just update state, don't reload
      useAuthStore.getState().checkAuth();
    } else if (event.data.type === 'LOGOUT') {
      console.log('🔓 Logout detected from another tab - clearing state');
      // Clear local state without API call
      useAuthStore.getState().logout();
    }
  };
  
  // Keep channel open
  window.addEventListener('beforeunload', () => {
    channel.close();
  });
}


// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
// import { authService } from '../services/authService'
// import { usePermissionStore } from './permissionStore'
// import toast from 'react-hot-toast'

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       company: null,
//       tokens: null,
//       isAuthenticated: false,
//       isLoading: false,
//       hasHydrated: false,

//       setTokens: (tokens) => {
//         set({ 
//           tokens: {
//             ...get().tokens,
//             ...tokens
//           }
//         })
//       },

//       setHasHydrated: (state) => {
//         set({ hasHydrated: state })
//       },

//       // Helper function to check if user is authenticated
//       checkAuth: () => {
//         const { tokens, user } = get()
//         const hasToken = !!tokens?.access || !!tokens?.token
//         const hasUser = !!user
//         const isAuthenticated = hasToken && hasUser
        
//         // Update auth state if needed
//         if (get().isAuthenticated !== isAuthenticated) {
//           set({ isAuthenticated })
//         }
        
//         return isAuthenticated
//       },

//       login: async (credentials) => {
//         set({ isLoading: true })
//         try {
//           console.log('Login attempt with:', credentials)
//           const response = await authService.login(credentials)
//           console.log('Login response:', response)
          
//           // Handle your API's token structure
//           const data = response.data
//           const token = data.token // Your API returns a single token
//           const user = data.user
          
//           set({
//             user,
//             company: null, // Your API doesn't return company info
//             tokens: { access: token, token: token }, // Store token in both formats for compatibility
//             isAuthenticated: true,
//             isLoading: false,
//           })
          
//           // Set user in permission store
//           const { setUser: setPermissionUser, fetchUserPermissions } = usePermissionStore.getState()
//           setPermissionUser(user)
          
//           // Fetch user permissions only if user exists and has plan_id
//           if (user && user.plan_id) {
//             fetchUserPermissions(user.id)
//           }
          
//           toast.success('Login successful!')
//           return { success: true }
//         } catch (error) {
//           console.error('Login error:', error)
//           set({ isLoading: false })
          
//           const errorMessage = error.response?.data?.message || error.message || 'Login failed'
//           toast.error(errorMessage)
//           return { success: false, error: error.response?.data }
//         }
//       },

//       logout: async () => {
//         const { user } = get()
        
//         // Try to call logout API but don't wait for it since token might be invalid
//         if (user?.id) {
//           authService.logout(user.id).catch(err => {
//             console.log('Logout API call failed (expected if token expired):', err)
//           })
//         }
        
//         // Clear local state immediately
//         set({
//           user: null,
//           company: null,
//           tokens: null,
//           isAuthenticated: false,
//         })
//         localStorage.removeItem('auth-storage')
        
//         // Clear permission store
//         const { clearPermissions } = usePermissionStore.getState()
//         clearPermissions()
        
//         toast.success('Logged out successfully')
//       },

//       refreshToken: async () => {
//         const { tokens } = get()
//         if (!tokens?.refresh) return false

//         try {
//           const response = await authService.refreshToken(tokens.refresh)
//           set({
//             tokens: {
//               ...tokens,
//               access: response.data.access,
//             },
//           })
//           return true
//         } catch (error) {
//           get().logout()
//           return false
//         }
//       },

//       updateUser: (userData) => {
//         set({ user: { ...get().user, ...userData } })
//       },

//       updateCompany: (companyData) => {
//         set({ company: { ...get().company, ...companyData } })
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       onRehydrateStorage: () => (state) => {
//         console.log('🔄 Auth store rehydrating...', state)
        
//         if (state) {
//           // Check authentication state after rehydration
//           const hasToken = !!state.tokens?.access || !!state.tokens?.token
//           const hasUser = !!state.user
//           const isAuthenticated = hasToken && hasUser
          
//           console.log('🔐 Rehydration check:', {
//             hasToken,
//             hasUser,
//             isAuthenticated,
//             tokens: state.tokens,
//             user: state.user
//           })
          
//           // Update isAuthenticated based on actual data
//           state.isAuthenticated = isAuthenticated
//           state.hasHydrated = true
//         }
        
//         console.log('✅ Auth store rehydrated')
//       },
//     }
//   )
// )