import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      isMobile: false,
      
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),
      
      toggleSidebar: () => 
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => 
        set({ sidebarOpen: open }),
      
      setIsMobile: (isMobile) => 
        set({ isMobile }),
    }),
    {
      name: 'ui-storage',
      getStorage: () => localStorage,
    }
  )
)