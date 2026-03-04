import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';

// Auth Screens
import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';

// Main App Screens
import DashboardScreen from '../screens/dashboard/Dashboard';
import ProductsScreen from '../screens/products/Products';
import InventoryScreen from '../screens/inventory/Inventory';
import OrdersScreen from '../screens/orders/Orders';
import CustomersScreen from '../screens/customers/Customers';
import InvoicesScreen from '../screens/invoices/Invoices';
import BillingScreen from '../screens/billing/Billing';
import SettingsScreen from '../screens/settings/Settings';

// Navigation Components
import DrawerNavigator from './DrawerNavigator';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          // Main App Stack
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;