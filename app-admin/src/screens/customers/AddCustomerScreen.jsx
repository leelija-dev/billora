// screens/customers/AddCustomerScreen.js
import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import CustomerForm from '../../components/customers/CustomerForm';

const AddCustomerScreen = () => {
  const { isDarkMode } = useThemeStore();
  
  return <CustomerForm isDarkMode={isDarkMode} />;
};

export default AddCustomerScreen;