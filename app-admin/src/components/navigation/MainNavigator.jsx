// components/navigation/MainNavigator.js
import { Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
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
import AddProductScreen from "../../screens/products/AddProductScreen";
import ProductDetailScreen from "../../screens/products/ProductDetailScreen";
import ProductsScreen from "../../screens/products/ProductsScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import { theme } from "../../theme";
import { NAVIGATION_SCREENS } from "../../utils/constants";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Modern Header with Gradient
const StackHeader = ({ title, navigation, showBack = true }) => (
  <LinearGradient
    colors={["#6366F1", "#8B5CF6"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    className="pt-12 pb-4 px-4"
    style={{
      shadowColor: "#6366F1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }}
  >
    <View className="flex-row items-center">
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 w-10 h-10 rounded-2xl bg-white/20 items-center justify-center"
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <Text className="text-2xl font-bold text-white flex-1">{title}</Text>
      {!showBack && (
        <View className="flex-row">
          <TouchableOpacity
            className="mr-3 w-10 h-10 rounded-2xl bg-white/20 items-center justify-center"
            activeOpacity={0.7}
          >
            <Icon name="bell-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center"
            activeOpacity={0.7}
          >
            <Icon name="magnify" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </LinearGradient>
);

// Products Stack
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
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.PRODUCT_DETAIL}
      component={ProductDetailScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Product Details" navigation={navigation} />
        ),
      })}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.MAIN.ADD_PRODUCT}
      component={AddProductScreen}
      options={({ navigation }) => ({
        header: () => (
          <StackHeader title="Add Product" navigation={navigation} />
        ),
      })}
    />
  </Stack.Navigator>
);

// Orders Stack
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

// Customers Stack
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

// Inventory Stack (hidden from tab bar)
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

// Settings Stack (hidden from tab bar)
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

// Modern Tab Bar Component with bottom area filled (design unchanged)
// Modern Tab Bar Component with Sliding Active Background
const ModernTabBar = ({ state, descriptors, navigation }) => {
  const [tabPositions, setTabPositions] = useState({});
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  // Define only the tabs we want to show
  const tabs = [
    {
      name: "Home",
      icon: "view-dashboard-outline",
      iconActive: "view-dashboard",
      label: "Home",
      screen: "Dashboard",
    },
    {
      name: "Products",
      icon: "package-variant-closed",
      iconActive: "package-variant",
      label: "Products",
      screen: "ProductsStack",
    },
    {
      name: "Orders",
      icon: "clipboard-list-outline",
      iconActive: "clipboard-list",
      label: "Orders",
      screen: "OrdersStack",
    },
    {
      name: "Clients",
      icon: "account-group-outline",
      iconActive: "account-group",
      label: "Clients",
      screen: "CustomersStack",
    },
    {
      name: "Inventory",
      icon: "warehouse",
      iconActive: "warehouse",
      label: "Inventory",
      screen: "InventoryStack",
    },
  ];

  // Update slider position when active tab changes
  useEffect(() => {
    if (tabPositions[state.index]) {
      const { x, width } = tabPositions[state.index];
      
      Animated.spring(animation, {
        toValue: x,
        useNativeDriver: false,
        tension: 300,
        friction: 25,
      }).start();
      
      setSliderWidth(width);
    }
  }, [state.index, tabPositions]);

  const handleTabPress = (index) => {
    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(tabs[index].screen);
    }
  };

  const onTabLayout = (index, event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabPositions(prev => ({
      ...prev,
      [index]: { x, width }
    }));

    // Set initial slider position for the first tab
    if (index === 0 && !tabPositions[0]) {
      setSliderWidth(width);
      animation.setValue(x);
    }
  };

  return (
    <View className="absolute bottom-0 left-0 right-0">
      <View className="mx-4 mb-2 rounded-3xl overflow-hidden">
        <BlurView
          intensity={50}
          tint="light"
          className="overflow-hidden"
          style={{
            borderWidth: 0,
            borderColor: "white",
            backgroundColor: "#ff0dfbcf",
            padding: 0,
            borderRadius: 30,
          }}
        >
          <View
            className="flex-row items-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              position: 'relative',
              height: 50, // Fixed height for consistent animation
            }}
          >
            {/* Animated Sliding Background */}
            <Animated.View
              style={{
                position: 'absolute',
                left: animation,
                width: sliderWidth,
                height: 50, // Slightly smaller than container for padding effect
                backgroundColor: "#6366F1",
                borderRadius: 30,
                marginVertical: 6, // Center vertically
              }}
            />

            {tabs.map((tab, index) => {
              const isFocused = state.index === index;

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => handleTabPress(index)}
                  onLayout={(event) => onTabLayout(index, event)}
                  activeOpacity={0.7}
                  className="items-center justify-center flex-1"
                  style={{
                    flexDirection: "row",
                    paddingVertical: 12,
                    paddingHorizontal: isFocused ? 18 : 12,
                    minWidth: isFocused ? 60 : "auto",
                    zIndex: 1, // Ensure text/icons are above the animated background
                  }}
                >
                  <Icon
                    name={isFocused ? tab.iconActive : tab.icon}
                    size={22}
                    color={isFocused ? "white" : "#758A93"}
                  />
                  {isFocused && (
                    <Animated.Text className="text-sm font-medium text-white ml-2">
                      {tab.label}
                    </Animated.Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>

      {/* Extra invisible padding that fills the bottom gap */}
      <View
        style={{
          height: 20,
          backgroundColor: "white",
          width: "100%",
        }}
      />
    </View>
  );
};

// Main Navigator with modern design
const MainNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="ProductsStack" component={ProductsStack} />
      <Tab.Screen name="OrdersStack" component={OrdersStack} />
      <Tab.Screen name="CustomersStack" component={CustomersStack} />
      {/* Hidden screens - accessible via navigation only */}
      <Tab.Screen
        name="InventoryStack"
        component={InventoryStack}
        
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
