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
    icon: "view-dashboard-outline", // Changed from "view-dashboard" to outline version
    iconActive: "view-dashboard", // Keep this as filled version
    screen: "Dashboard",
    badge: null,
    stack: null,
  },
  {
    id: "products",
    title: "Products",
    icon: "package-variant-closed", // This is already an outline version
    iconActive: "package-variant", // This is the filled version
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
    icon: "warehouse-outline", // Changed from "warehouse-outline" (it was correct)
    iconActive: "warehouse", // Changed from "warehouse" (it was correct)
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
}) => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;

  // Handle sidebar animations
  useEffect(() => {
    if (sidebarVisible) {
      // Slide in from left
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
      // Slide out to left
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
      // Animate out before closing
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
    // Animate out before navigating
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
        // Navigate to the correct tab stack
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
    // Animate out before logout
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
            color={textColor === "text-gray-800" ? "#1f2937" : textColor}
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
            color={textColor === "text-gray-800" ? "#1f2937" : textColor}
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
            color={textColor === "text-gray-800" ? "#1f2937" : textColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderNotifications = () => {
    if (!notificationVisible) return null;

    // Sample notifications data
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
                className="absolute top-16 right-4 w-[80%] max-w-[350px] bg-white rounded-2xl shadow-[0px_10px_20px_black] "
              >
                {/* Header */}
                <View className="rounded-t-2xl overflow-hidden">
                  <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row justify-between items-center p-4  w-full h-auto"
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
                      className={`flex-row p-4 border-b border-gray-100 ${
                        !notif.read ? "bg-blue-50/50" : ""
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
                          <Text className="font-semibold text-gray-900">
                            {notif.title}
                          </Text>
                          <Text className="text-xs text-gray-400">
                            {notif.time}
                          </Text>
                        </View>
                        <Text className="text-sm text-gray-600 mt-1">
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
                    className="p-4 bg-gray-50 rounded-b-2xl"
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

 // components/common/Header.js
// Update the renderSidebar function - remove the StatusBar spacer

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
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateX: slideAnim }],
                width: DRAWER_WIDTH,
                height: '100%',
                backgroundColor: 'white',
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {/* Main container with flex:1 to take full height */}
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

                {/* Navigation Items - Takes remaining space */}
                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {navigationItems.map((item) => {
                    // FIXED: Better active state detection
                    const isActive = 
                      activeScreen === item.title || 
                      activeScreen === item.stack ||
                      activeScreen === item.screen ||
                      (item.stack && activeScreen === item.stack) ||
                      (item.title === "Dashboard" && activeScreen === "Dashboard");
                    
                    // // Debug log to check values
                    // console.log('Item:', item.title, 'Active:', activeScreen, 'isActive:', isActive);
                    
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleNavigation(item)}
                        className={`mx-3 my-1 px-4 py-3.5 rounded-xl ${
                          isActive ? "bg-purple-50" : ""
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center flex-1">
                            <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                              isActive ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <Icon
                                name={isActive ? item.icon : item.icon}
                                size={20}
                                color={isActive ? "#667eea" : "#666"}
                              />
                            </View>
                            <Text
                              className={`text-base ml-3 flex-1 ${
                                isActive
                                  ? "text-purple-600 font-semibold"
                                  : "text-gray-600"
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

                {/* Footer - Always at bottom */}
                <View className="border-t border-gray-200 pt-4 pb-8 px-5">
                  <TouchableOpacity className="flex-row items-center py-3">
                    <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center">
                      <Icon name="help-circle-outline" size={20} color="#666" />
                    </View>
                    <Text className="text-base ml-3 text-gray-600">
                      Help & Support
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center py-3"
                    onPress={handleLogout}
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

  return (
    <>
      <SafeAreaView
        className={`border-b border-white shadow-[0px_7px_20px_black] ${backgroundColor} ${style}`}
        edges={["top", "left", "right"]}
      >
        <View className="flex-row items-center justify-between px-4 py-3 min-h-[60px]">
          {renderLeftComponent()}
          <Text
            className={`flex-1 text-center mx-2 font-semibold text-lg ${textColor} ${titleStyle}`}
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