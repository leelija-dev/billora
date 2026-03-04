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
}) => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleNavigation = (item) => {
    closeSidebar();
    if (onNavigate) {
      onNavigate(item.screen);
    } else {
      navigation.navigate(item.screen);
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
        <TouchableOpacity className="p-2 relative">
          <Icon
            name="bell-outline"
            size={24}
            color={textColor === "text-gray-800" ? "#1f2937" : textColor}
          />
          <View className="absolute top-1 right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] justify-center items-center border-2 border-white">
            <Text className="text-white text-[10px] font-bold px-1">3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Icon
            name="magnify"
            size={24}
            color={textColor === "text-gray-800" ? "#1f2937" : textColor}
          />
        </TouchableOpacity>
      </View>
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
                  <TouchableOpacity className="flex-row items-center py-3">
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
        className={`border-b border-gray-200 shadow-sm ${backgroundColor} ${style}`}
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
    </>
  );
};

export default Header;
