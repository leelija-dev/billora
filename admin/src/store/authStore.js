import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

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
          const response = await authService.checkSession();
          
          if (response.status && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Broadcast to other tabs
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({ type: 'LOGIN', user: response.user });
            
            return true;
          } else {
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
          const response = await authService.login(credentials);
          
          const data = response.data;
          const user = data.user;
          
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          localStorage.setItem('user', JSON.stringify(user));
          
          const channel = new BroadcastChannel('auth_channel');
          channel.postMessage({ type: 'LOGIN', user: user });
          
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
        set({ isLoading: true });
        
        try {
          await authService.logout();
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
        
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        
        toast.success('Logged out successfully');
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
      },

      updateCompany: (companyData) => {
        set({ company: { ...get().company, ...companyData } });
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