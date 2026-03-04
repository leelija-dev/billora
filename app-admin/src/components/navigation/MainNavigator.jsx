import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddCustomerScreen from "../../screens/customers/AddCustomerScreen";
import CustomerDetailScreen from "../../screens/customers/CustomerDetailScreen";
import CustomersScreen from "../../screens/customers/CustomersScreen";
import DashboardScreen from "../../screens/dashboard/DashboardScreen";
import InventoryScreen from "../../screens/inventory/InventoryScreen";
import StockMovementScreen from "../../screens/inventory/StockMovementScreen";
import CreateOrderScreen from "../../screens/orders/CreateOrderScreen";
import OrderDetailScreen from "../../screens/orders/OrderDetailScreen";
import OrdersScreen from "../../screens/orders/OrdersScreen";
import ProductsScreen from "../../screens/products/ProductsScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import { theme } from "../../theme";
import { NAVIGATION_SCREENS } from "../../utils/constants";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom header with gradient for stack navigators
const StackHeader = ({ title, navigation, showBack = true }) => (
  <LinearGradient
    colors={[
      theme.colors.primary,
      theme.colors.primaryDark || theme.colors.primary,
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    className="pt-12 pb-4 px-4"
  >
    <View className="flex-row items-center">
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 p-2 rounded-full bg-white/20"
        >
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <Text className="text-2xl font-bold text-white flex-1">{title}</Text>
      {!showBack && (
        <View className="flex-row">
          <TouchableOpacity className="mr-3 p-2 rounded-full bg-white/20">
            <Icon name="bell-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-white/20">
            <Icon name="magnify" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </LinearGradient>
);

// Enhanced Products Stack
const ProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F8FAFC" },
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PRODUCTS}
      component={ProductsScreen}
      options={{
        header: ({ navigation }) => (
          <StackHeader
            title="Products"
            navigation={navigation}
            showBack={false}
          />
        ),
      }}
    />
    {/* Uncomment when ready
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PRODUCT_DETAIL}
      component={ProductDetailScreen}
      options={({ navigation }) => ({
        header: () => <StackHeader title="Product Details" navigation={navigation} />,
      })}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ADD_PRODUCT}
      component={AddProductScreen}
      options={({ navigation }) => ({
        header: () => <StackHeader title="Add Product" navigation={navigation} />,
      })}
    /> */}
  </Stack.Navigator>
);

// Enhanced Orders Stack
const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F8FAFC" },
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ORDERS}
      component={OrdersScreen}
      options={{
        header: ({ navigation }) => (
          <StackHeader
            title="Orders"
            navigation={navigation}
            showBack={false}
          />
        ),
      }}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ORDER_DETAIL}
      component={OrderDetailScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Order Details" navigation={navigation} />
        ),
      })}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CREATE_ORDER}
      component={CreateOrderScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Create Order" navigation={navigation} />
        ),
      })}
    />
  </Stack.Navigator>
);

// Enhanced Customers Stack
const CustomersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F8FAFC" },
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CUSTOMERS}
      component={CustomersScreen}
      options={{
        header: ({ navigation }) => (
          <StackHeader
            title="Customers"
            navigation={navigation}
            showBack={false}
          />
        ),
      }}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.CUSTOMER_DETAIL}
      component={CustomerDetailScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Customer Profile" navigation={navigation} />
        ),
      })}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ADD_CUSTOMER}
      component={AddCustomerScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Add Customer" navigation={navigation} />
        ),
      })}
    />
  </Stack.Navigator>
);

// Enhanced Inventory Stack
const InventoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F8FAFC" },
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.INVENTORY}
      component={InventoryScreen}
      options={{
        header: ({ navigation }) => (
          <StackHeader
            title="Inventory"
            navigation={navigation}
            showBack={false}
          />
        ),
      }}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.STOCK_MOVEMENT}
      component={StockMovementScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Stock Movement" navigation={navigation} />
        ),
      })}
    />
  </Stack.Navigator>
);

// Enhanced Settings Stack
const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F8FAFC" },
    }}
  >
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.SETTINGS}
      component={SettingsScreen}
      options={{
        header: ({ navigation }) => (
          <StackHeader
            title="Settings"
            navigation={navigation}
            showBack={false}
          />
        ),
      }}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PROFILE}
      component={ProfileScreen}
      options={({ navigation }) => ({
        header: () => <StackHeader title="Profile" navigation={navigation} />,
      })}
    />
  </Stack.Navigator>
);

// Custom Tab Bar Icon
const TabIcon = ({ name, focused, color }) => (
  <View className={`items-center justify-center ${focused ? "mt-[-8px]" : ""}`}>
    <View className={`p-2 rounded-full ${focused ? "bg-primary/10" : ""}`}>
      <Icon name={name} size={focused ? 28 : 24} color={color} />
    </View>
    {focused && <View className="w-1 h-1 rounded-full bg-primary mt-1" />}
  </View>
);

// Main Navigator with enhanced design
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case NAVIGATION_SCREENS.MAIN.DASHBOARD:
              iconName = focused ? "view-dashboard" : "view-dashboard-outline";
              break;
            case "ProductsStack":
              iconName = focused ? "package-variant" : "package-variant-closed";
              break;
            case "OrdersStack":
              iconName = focused ? "clipboard-list" : "clipboard-list-outline";
              break;
            case "CustomersStack":
              iconName = focused ? "account-group" : "account-group-outline";
              break;
            case "InventoryStack":
              iconName = focused ? "warehouse" : "warehouse";
              break;
            case "SettingsStack":
              iconName = focused ? "cog" : "cog-outline";
              break;
            default:
              iconName = "help";
          }

          return <TabIcon name={iconName} focused={focused} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={NAVIGATION_SCREENS.MAIN.DASHBOARD}
        component={DashboardScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          title: "Products",
        }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{
          title: "Orders",
        }}
      />
      <Tab.Screen
        name="CustomersStack"
        component={CustomersStack}
        options={{
          title: "Clients",
        }}
      />
      <Tab.Screen
        name="InventoryStack"
        component={InventoryStack}
        options={{
          title: "Stock",
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          title: "More",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
