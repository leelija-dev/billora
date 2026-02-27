import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'

export const useTheme = () => {
  const { theme, toggleTheme } = useUIStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}