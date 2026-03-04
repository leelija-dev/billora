import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddCustomerScreen from '../../screens/customers/AddCustomerScreen';
import CustomerDetailScreen from '../../screens/customers/CustomerDetailScreen';
import CustomersScreen from '../../screens/customers/CustomersScreen';
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import InventoryScreen from '../../screens/inventory/InventoryScreen';
import StockMovementScreen from '../../screens/inventory/StockMovementScreen';
import CreateOrderScreen from '../../screens/orders/CreateOrderScreen';
import OrderDetailScreen from '../../screens/orders/OrderDetailScreen';
import OrdersScreen from '../../screens/orders/OrdersScreen';
import ProductsScreen from '../../screens/products/ProductsScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { theme } from '../../theme';
import { NAVIGATION_SCREENS } from '../../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PRODUCTS}
      component={ProductsScreen}
    />
    {/* <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PRODUCT_DETAIL}
      component={ProductDetailScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ADD_PRODUCT}
      component={AddProductScreen}
    /> */}
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ORDERS}
      component={OrdersScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ORDER_DETAIL}
      component={OrderDetailScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CREATE_ORDER}
      component={CreateOrderScreen}
    />
  </Stack.Navigator>
);

const CustomersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CUSTOMERS}
      component={CustomersScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CUSTOMER_DETAIL}
      component={CustomerDetailScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ADD_CUSTOMER}
      component={AddCustomerScreen}
    />
  </Stack.Navigator>
);

const InventoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.INVENTORY}
      component={InventoryScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.STOCK_MOVEMENT}
      component={StockMovementScreen}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.SETTINGS}
      component={SettingsScreen}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PROFILE}
      component={ProfileScreen}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={NAVIGATION_SCREENS.MAIN.DASHBOARD}
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          title: 'Products',
        }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{
          title: 'Orders',
        }}
      />
      <Tab.Screen
        name="CustomersStack"
        component={CustomersStack}
        options={{
          title: 'Customers',
        }}
      />
      <Tab.Screen
        name="InventoryStack"
        component={InventoryStack}
        options={{
          title: 'Inventory',
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
