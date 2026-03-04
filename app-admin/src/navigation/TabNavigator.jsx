import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';

// Screens
import DashboardScreen from '../screens/dashboard/Dashboard';
import ProductsScreen from '../screens/products/Products';
import OrdersScreen from '../screens/orders/Orders';
import CustomersScreen from '../screens/customers/Customers';
import MoreScreen from '../screens/more/More';

// Icons (using simple text for now - you'd use proper icons)
const TabIcon = ({ focused, label }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: focused ? colors.primary[50] : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: focused ? colors.primary[600] : colors.gray[400] }}>
        {label[0]}
      </Text>
    </View>
    <Text
      style={{
        fontSize: 11,
        color: focused ? colors.primary[600] : colors.gray[400],
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Dashboard" />,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Products" />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Orders" />,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Customers" />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="More" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;