import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { appStorage } from '../utils/storage';
import { theme } from '../theme';

export const useTheme = () => {
  const deviceColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(deviceColorScheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await appStorage.getTheme();
      setColorScheme(savedTheme || deviceColorScheme);
    } catch (error) {
      console.error('Error loading theme:', error);
      setColorScheme(deviceColorScheme);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newScheme) => {
    try {
      setColorScheme(newScheme);
      await appStorage.setTheme(newScheme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    await setTheme(newScheme);
  };

  const colors = {
    ...theme.colors,
    // Add dark mode colors if needed
    ...(colorScheme === 'dark' && {
      background: '#1a1a1a',
      backgroundSecondary: '#2a2a2a',
      backgroundTertiary: '#3a3a3a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      textTertiary: '#808080',
      border: '#404040',
      borderLight: '#505050',
      borderDark: '#303030',
    }),
  };

  return {
    theme: {
      ...theme,
      colors,
      colorScheme,
    },
    setTheme,
    toggleTheme,
    isLoading,
  };
};
