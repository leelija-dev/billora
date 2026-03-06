// components/common/Header.js
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Easing,
  StatusBar,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

const Header = ({
  title,
  leftComponent,
  rightComponent,
  showBackButton = false,
  onBackPress,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
  style = "",
  titleStyle = "",
  showSidebar = true,
  userAvatar,
  userName = "Guest User",
  userEmail = "guest@example.com",
  navigationItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "view-dashboard-outline",
      iconActive: "view-dashboard",
      screen: "Dashboard",
      badge: null,
      stack: null,
    },
    {
      id: "products",
      title: "Products",
      icon: "package-variant-closed",
      iconActive: "package-variant",
      screen: "ProductsStack",
      badge: "156",
      stack: "Products",
    },
    {
      id: "orders",
      title: "Orders",
      icon: "clipboard-list-outline",
      iconActive: "clipboard-list",
      screen: "OrdersStack",
      badge: "12",
      stack: "Orders",
    },
    {
      id: "customers",
      title: "Customers",
      icon: "account-group-outline",
      iconActive: "account-group",
      screen: "CustomersStack",
      badge: "892",
      stack: "Customers",
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: "warehouse-outline",
      iconActive: "warehouse",
      screen: "InventoryStack",
      badge: "Low Stock",
      stack: "Inventory",
    },
    {
      id: "settings",
      title: "Settings",
      icon: "cog-outline",
      iconActive: "cog",
      screen: "SettingsStack",
      badge: null,
      stack: "Settings",
    },
  ],
  onNavigate,
  activeScreen = "Dashboard",
  notificationCount = 3,
  onNotificationPress,
  onSearchPress,
  onLogout,
  onThemeToggle,
  isDarkMode = false,
}) => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const systemColorScheme = useColorScheme();
  
  // Determine actual dark mode state (system or manual)
  const darkMode = isDarkMode !== undefined ? isDarkMode : systemColorScheme === 'dark';
  
  // Theme-based colors
  const theme = {
    background: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    cardHover: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    iconBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    iconColor: darkMode ? '#9CA3AF' : '#666',
    activeBg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50',
    activeIconBg: darkMode ? 'bg-purple-800' : 'bg-purple-100',
    activeText: darkMode ? 'text-purple-400' : 'text-purple-600',
    shadow: darkMode ? 'shadow-none' : 'shadow-[0px_7px_20px_black]',
    modalOverlay: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
    notificationBg: darkMode ? 'bg-gray-800' : 'bg-white',
    notificationItemBg: darkMode ? 'bg-gray-800' : 'bg-white',
    notificationUnreadBg: darkMode ? 'bg-purple-900/20' : 'bg-blue-50/50',
  };

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;

  // Handle sidebar animations
  useEffect(() => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start();
    }
  }, [sidebarVisible]);

  // Handle notification animations
  useEffect(() => {
    if (notificationVisible) {
      Animated.spring(notificationAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [notificationVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        setSidebarVisible(false);
      });
    } else {
      setSidebarVisible(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationVisible(!notificationVisible);
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const handleNavigation = (item) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      setSidebarVisible(false);
      
      if (onNavigate) {
        onNavigate(item.screen);
      } else {
        switch (item.id) {
          case "dashboard":
            navigation.navigate("Dashboard");
            break;
          case "products":
            navigation.navigate("ProductsStack");
            break;
          case "orders":
            navigation.navigate("OrdersStack");
            break;
          case "customers":
            navigation.navigate("CustomersStack");
            break;
          case "inventory":
            navigation.navigate("InventoryStack");
            break;
          case "settings":
            navigation.navigate("SettingsStack");
            break;
          default:
            navigation.navigate(item.screen);
        }
      }
    });
  };

  const handleLogout = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      setSidebarVisible(false);
      if (onLogout) {
        onLogout();
      } else {
        console.log("Logout pressed");
      }
    });
  };

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle(!darkMode);
    }
  };

  const renderLeftComponent = () => {
    if (leftComponent) {
      return <View className="min-w-[40px] items-start">{leftComponent}</View>;
    }

    if (showSidebar) {
      return (
        <TouchableOpacity
          onPress={toggleSidebar}
          activeOpacity={0.7}
          className="rounded-xl overflow-hidden shadow-lg shadow-purple-500/30"
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-2.5 rounded-xl"
          >
            <Icon name="menu" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={onBackPress || (() => navigation.goBack())}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="p-2"
        >
          <Icon
            name="arrow-left"
            size={24}
            color={darkMode ? "#FFFFFF" : "#1f2937"}
          />
        </TouchableOpacity>
      );
    }

    return <View className="min-w-[40px]" />;
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return <View className="min-w-[40px] items-end">{rightComponent}</View>;
    }

    return (
      <View className="flex-row items-center">
        {/* Notification Bell with Badge */}
        <TouchableOpacity
          className="p-2 relative"
          onPress={toggleNotifications}
          activeOpacity={0.7}
        >
          <Icon
            name="bell-outline"
            size={24}
            color={darkMode ? "#FFFFFF" : "#1f2937"}
          />
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-[20px] justify-center items-center border-2 border-white shadow-sm shadow-red-500/50">
              <Text className="text-white text-[10px] font-bold">
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Search Icon */}
        <TouchableOpacity
          className="p-2"
          onPress={onSearchPress || (() => console.log("Search pressed"))}
          activeOpacity={0.7}
        >
          <Icon
            name="magnify"
            size={24}
            color={darkMode ? "#FFFFFF" : "#1f2937"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderNotifications = () => {
    if (!notificationVisible) return null;

    const notifications = [
      {
        id: 1,
        title: "New Order",
        message: "Order #ORD-1234 has been placed",
        time: "5 min ago",
        read: false,
        icon: "clipboard-list",
        color: "#6366F1",
      },
      {
        id: 2,
        title: "Low Stock Alert",
        message: "Classic White T-Shirt is running low",
        time: "1 hour ago",
        read: false,
        icon: "alert",
        color: "#F59E0B",
      },
      {
        id: 3,
        title: "Payment Received",
        message: "Payment of $299.99 from John Smith",
        time: "2 hours ago",
        read: true,
        icon: "cash",
        color: "#10B981",
      },
    ];

    return (
      <Modal
        transparent
        visible={notificationVisible}
        animationType="none"
        onRequestClose={() => setNotificationVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setNotificationVisible(false)}>
          <View className="flex-1">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  opacity: notificationAnim,
                  transform: [
                    {
                      translateY: notificationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                }}
                className={`absolute top-16 right-4 w-[80%] max-w-[350px] ${theme.notificationBg} rounded-2xl shadow-lg`}
              >
                {/* Header */}
                <View className="rounded-t-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row justify-between items-center p-4 w-full h-auto"
                  >
                    <Text className="text-white font-bold text-lg">
                      Notifications
                    </Text>
                    <TouchableOpacity
                      onPress={() => setNotificationVisible(false)}
                    >
                      <Icon name="close" size={22} color="white" />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                {/* Notifications List */}
                <ScrollView
                  className="max-h-96"
                  showsVerticalScrollIndicator={false}
                >
                  {notifications.map((notif) => (
                    <TouchableOpacity
                      key={notif.id}
                      className={`flex-row p-4 border-b ${theme.border} ${
                        !notif.read ? theme.notificationUnreadBg : theme.notificationItemBg
                      }`}
                      onPress={() => {
                        console.log("Notification pressed:", notif.id);
                        setNotificationVisible(false);
                      }}
                    >
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: `${notif.color}20` }}
                      >
                        <Icon name={notif.icon} size={20} color={notif.color} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center">
                          <Text className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notif.title}
                          </Text>
                          <Text className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notif.time}
                          </Text>
                        </View>
                        <Text className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notif.message}
                        </Text>
                      </View>
                      {!notif.read && (
                        <View className="w-2 h-2 rounded-full bg-blue-500 ml-2 self-center" />
                      )}
                    </TouchableOpacity>
                  ))}

                  {/* View All Button */}
                  <TouchableOpacity
                    className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-b-2xl`}
                    onPress={() => {
                      console.log("View all notifications");
                      setNotificationVisible(false);
                    }}
                  >
                    <Text className="text-center text-indigo-600 font-semibold">
                      View All Notifications
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

 const renderSidebar = () => {
  if (!sidebarVisible) return null;

  return (
    <Modal
      transparent
      visible={sidebarVisible}
      animationType="none"
      onRequestClose={closeSidebar}
    >
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <Animated.View
          style={{ 
            opacity: fadeAnim,
            flex: 1,
            backgroundColor: theme.modalOverlay,
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateX: slideAnim }],
                width: DRAWER_WIDTH,
                height: '100%',
                backgroundColor: darkMode ? '#1F2937' : 'white',
                shadowColor: darkMode ? '#000' : '#000',
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: darkMode ? 0.5 : 0.25,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {/* Main container */}
              <View className="flex-1">
                {/* User Profile Section */}
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="pt-12 pb-6 px-5"
                >
                  <View className="flex-row items-center">
                    {userAvatar ? (
                      <Image
                        source={{ uri: userAvatar }}
                        className="w-14 h-14 rounded-full border-2 border-white"
                      />
                    ) : (
                      <View className="w-14 h-14 rounded-full bg-white/30 justify-center items-center border-2 border-white">
                        <Text className="text-2xl font-bold text-white">
                          {userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold text-white" numberOfLines={1}>
                        {userName}
                      </Text>
                      <Text className="text-sm text-white/80 mt-1" numberOfLines={1}>
                        {userEmail}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Navigation Items */}
                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {navigationItems.map((item) => {
                    const isActive = 
                      activeScreen === item.title || 
                      activeScreen === item.stack ||
                      activeScreen === item.screen ||
                      (item.stack && activeScreen === item.stack) ||
                      (item.title === "Dashboard" && activeScreen === "Dashboard");
                    
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleNavigation(item)}
                        className={`mx-3 my-1 px-4 py-3.5 rounded-xl ${
                          isActive ? theme.activeBg : ''
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center flex-1">
                            <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                              isActive ? theme.activeIconBg : theme.iconBg
                            }`}>
                              <Icon
                                name={isActive ? item.iconActive : item.icon}
                                size={20}
                                color={isActive ? "#667eea" : theme.iconColor}
                              />
                            </View>
                            <Text
                              className={`text-base ml-3 flex-1 ${
                                isActive
                                  ? theme.activeText
                                  : darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                          </View>
                          {item.badge && (
                            <View
                              className={`px-2 py-1 rounded-full ml-2 ${
                                item.badge === "Low Stock"
                                  ? "bg-orange-500"
                                  : "bg-purple-600"
                              }`}
                            >
                              <Text className="text-white text-[10px] font-bold">
                                {item.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Footer */}
                <View className={`border-t ${theme.border} pt-4 pb-8 px-5`}>
                  {/* Dark Mode Toggle - FIXED VERSION */}
                  <TouchableOpacity 
                    className="flex-row items-center py-3 justify-between"
                    onPress={handleThemeToggle}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <View className={`w-8 h-8 rounded-lg ${theme.iconBg} items-center justify-center`}>
                        <Icon 
                          name={darkMode ? "weather-night" : "white-balance-sunny"} 
                          size={20} 
                          color={darkMode ? "#9CA3AF" : "#666"} 
                        />
                      </View>
                      <Text className={`text-base ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Dark Mode
                      </Text>
                    </View>
                    
                    {/* Fixed Toggle Switch */}
                    <View 
                      style={{
                        width: 48,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: darkMode ? '#667eea' : '#e5e7eb',
                        padding: 2,
                      }}
                    >
                      <Animated.View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: 'white',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                          elevation: 2,
                          transform: [{
                            translateX: darkMode ? 24 : 0,
                          }],
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Help & Support */}
                  <TouchableOpacity 
                    className="flex-row items-center py-3"
                    activeOpacity={0.7}
                  >
                    <View className={`w-8 h-8 rounded-lg ${theme.iconBg} items-center justify-center`}>
                      <Icon name="help-circle-outline" size={20} color={theme.iconColor} />
                    </View>
                    <Text className={`text-base ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Help & Support
                    </Text>
                  </TouchableOpacity>

                  {/* Logout */}
                  <TouchableOpacity
                    className="flex-row items-center py-3"
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center">
                      <Icon name="logout" size={20} color="#ff4444" />
                    </View>
                    <Text className="text-base ml-3 text-red-500">Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

  // Determine header background and text color based on dark mode
  const headerBg = darkMode ? 'bg-gray-900' : backgroundColor;
  const headerTextColor = darkMode ? 'text-white' : textColor;

  return (
    <>
      <SafeAreaView
        className={`border-b ${darkMode ? 'border-gray-800' : 'border-white'} ${theme.shadow} ${headerBg} ${style}`}
        edges={["top", "left", "right"]}
      >
        <View className="flex-row items-center justify-between px-4 py-3 min-h-[60px]">
          {renderLeftComponent()}
          <Text
            className={`flex-1 text-center mx-2 font-semibold text-lg ${headerTextColor} ${titleStyle}`}
            numberOfLines={1}
          >
            {title}
          </Text>
          {renderRightComponent()}
        </View>
      </SafeAreaView>
      {renderSidebar()}
      {renderNotifications()}
    </>
  );
};

export default Header;