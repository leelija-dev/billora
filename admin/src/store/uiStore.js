import { create } from 'zustand';

export const useUIStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: window.innerWidth >= 768, // Open by default on desktop
  isMobile: window.innerWidth < 768,
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setIsMobile: (mobile) => set({ isMobile: mobile }),
}));

// Initialize theme
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}