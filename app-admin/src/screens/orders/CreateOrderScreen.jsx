// screens/orders/CreateOrderScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import OrderForm from '../../components/orders/OrderForm';

const CreateOrderScreen = () => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        backgroundColor: isDarkMode ? '#111827' : '#FFFFFF' 
      }} 
      edges={['left', 'right']}
    >
      <OrderForm />
    </SafeAreaView>
  );
};

export default CreateOrderScreen;