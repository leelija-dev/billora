// screens/inventory/StockMovementScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import StockMovement from '../../components/inventory/StockMovement';

const StockMovementScreen = () => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        backgroundColor: isDarkMode ? '#111827' : '#FFFFFF' 
      }} 
      edges={['left', 'right']}
    >
      <StockMovement />
    </SafeAreaView>
  );
};

export default StockMovementScreen;