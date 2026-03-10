// screens/orders/OrdersScreen.js
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import Header from "../../components/common/Header";
import OrderList from "../../components/orders/OrderList";

// Order statistics
const orderStats = {
  total: 156,
  pending: 23,
  processing: 15,
  delivered: 108,
  cancelled: 10,
};

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  const handleCreateOrder = () => {
    navigation.navigate("CreateOrder");
  };

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

  const filters = [
    {
      id: "all",
      label: "All Orders",
      icon: "format-list-bulleted",
      count: orderStats.total,
    },
    {
      id: "pending",
      label: "Pending",
      icon: "clock-outline",
      count: orderStats.pending,
      color: "text-yellow-600",
    },
    {
      id: "processing",
      label: "Processing",
      icon: "progress-clock",
      count: orderStats.processing,
      color: "text-blue-600",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: "check-circle-outline",
      count: orderStats.delivered,
      color: "text-green-600",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: "close-circle-outline",
      count: orderStats.cancelled,
      color: "text-red-600",
    },
  ];

  // Navigation items for sidebar
  const navigationItems = [
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
      badge: "156",
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
  ];

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      {/* Use the enhanced Header component */}
      <Header
        title="Orders"
        userName="John Doe"
        userEmail="john@example.com"
        activeScreen="Orders"
        navigationItems={navigationItems}
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon
                name={viewMode === "list" ? "view-grid" : "view-list"}
                size={22}
                color={isDarkMode ? "#9CA3AF" : "#4b5563"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreateOrder}
              className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center shadow-md shadow-blue-500/30"
            >
              <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Stats Cards */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2 py-3"
        >
          <View className="flex-row gap-3 pr-4">
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              className="rounded-2xl p-4 min-w-[120px]"
              style={{ borderRadius: 10 }}
            >
              <Text className="text-white/80 text-xs">Total Orders</Text>
              <Text className="text-white text-2xl font-bold">
                {orderStats.total}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#f97316", "#ea580c"]}
              className="rounded-2xl p-4 min-w-[120px]"
              style={{ borderRadius: 10 }}
            >
              <Text className="text-white/80 text-xs">Pending</Text>
              <Text className="text-white text-2xl font-bold">
                {orderStats.pending}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#10b981", "#059669"]}
              className="rounded-2xl p-4 min-w-[120px]"
              style={{ borderRadius: 10 }}
            >
              <Text className="text-white/80 text-xs">Delivered</Text>
              <Text className="text-white text-2xl font-bold">
                {orderStats.delivered}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
              className="rounded-2xl p-4 min-w-[120px]"
              style={{ borderRadius: 10 }}
            >
              <Text className="text-white/80 text-xs">Cancelled</Text>
              <Text className="text-white text-2xl font-bold">
                {orderStats.cancelled}
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-2">
        <View className={`flex-row items-center rounded-2xl px-4 h-12 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <Icon name="magnify" size={20} color="#9ca3af" />
          <TextInput
            className={`flex-1 ml-3 text-base ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            placeholder="Search orders by ID, customer..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 py-2"
          >
            <View className="flex-row gap-2">
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => handleFilterPress(filter.id)}
                  className={`flex-row items-center px-4 py-2 rounded-full border ${
                    selectedFilter === filter.id
                      ? "bg-blue-500 border-blue-500"
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                  } shadow-sm`}
                >
                  <Icon
                    name={filter.icon}
                    size={18}
                    color={
                      selectedFilter === filter.id
                        ? "#ffffff"
                        : isDarkMode ? '#9CA3AF' : '#6b7280'
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      selectedFilter === filter.id
                        ? "text-white"
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {filter.label}
                  </Text>
                  <View
                    className={`ml-2 px-2 py-0.5 rounded-full ${
                      selectedFilter === filter.id 
                        ? "bg-white/20" 
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        selectedFilter === filter.id
                          ? "text-white"
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Order List */}
        <View className="flex-1 px-4">
          <OrderList
            viewMode={viewMode}
            searchQuery={searchQuery}
            filter={selectedFilter}
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;