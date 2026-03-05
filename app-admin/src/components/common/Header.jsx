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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");
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
      icon: "view-dashboard",
      screen: "Dashboard",
      badge: null,
    },
    {
      id: "products",
      title: "Products",
      icon: "package-variant",
      screen: "Products",
      badge: "24",
    },
    {
      id: "orders",
      title: "Orders",
      icon: "clipboard-list",
      screen: "Orders",
      badge: "12",
    },
    {
      id: "customers",
      title: "Customers",
      icon: "account-group",
      screen: "Customers",
      badge: null,
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: "warehouse",
      screen: "Inventory",
      badge: "Low Stock",
    },
    {
      id: "settings",
      title: "Settings",
      icon: "cog",
      screen: "Settings",
      badge: null,
    },
  ],
  onNavigate,
  activeScreen = "Dashboard",
  notificationCount = 3, // Add prop for notification count
  onNotificationPress,
  onSearchPress,
  onLogout,
}) => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sidebarVisible]);

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
    setSidebarVisible(false);
  };

  const toggleNotifications = () => {
    setNotificationVisible(!notificationVisible);
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const handleNavigation = (item) => {
    closeSidebar();
    if (onNavigate) {
      onNavigate(item.screen);
    } else {
      navigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    closeSidebar();
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout pressed");
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
          onPress={onBackPress}
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
                className="absolute top-16 right-4 w-[90%] max-w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100"
              >
                {/* Header */}
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row justify-between items-center p-4 rounded-t-2xl"
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
            style={{ opacity: fadeAnim }}
            className="flex-1 bg-black/50"
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  transform: [{ translateX: slideAnim }],
                  width: DRAWER_WIDTH,
                }}
                className="absolute left-0 top-0 bottom-0 bg-white shadow-xl"
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="pt-10 pb-5 px-5"
                >
                  <View className="flex-row items-center">
                    {userAvatar ? (
                      <Image
                        source={{ uri: userAvatar }}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-white/30 justify-center items-center border-2 border-white">
                        <Text className="text-xl font-bold text-white">
                          {userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View className="ml-4">
                      <Text className="text-base font-bold text-white">
                        {userName}
                      </Text>
                      <Text className="text-xs text-white/80 mt-0.5">
                        {userEmail}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                <ScrollView className="flex-1 pt-2.5">
                  {navigationItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleNavigation(item)}
                      className={`flex-row items-center justify-between mx-2.5 my-1 px-5 py-3.5 rounded-xl ${
                        activeScreen === item.screen ? "bg-purple-50" : ""
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Icon
                          name={item.icon}
                          size={22}
                          color={
                            activeScreen === item.screen ? "#667eea" : "#666"
                          }
                        />
                        <Text
                          className={`text-base ml-4 ${
                            activeScreen === item.screen
                              ? "text-purple-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {item.title}
                        </Text>
                      </View>
                      {item.badge && (
                        <View
                          className={`px-2 py-1 rounded-full ${
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
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View className="border-t border-gray-200 pt-5 px-5 pb-5">
                  <TouchableOpacity className="flex-row items-center py-3">
                    <Icon name="help-circle-outline" size={22} color="#666" />
                    <Text className="text-base ml-4 text-gray-600">
                      Help & Support
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center py-3"
                    onPress={handleLogout}
                  >
                    <Icon name="logout" size={22} color="#ff4444" />
                    <Text className="text-base ml-4 text-red-500">Logout</Text>
                  </TouchableOpacity>
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
