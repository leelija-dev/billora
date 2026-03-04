// OrderList.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MOCK_ORDERS } from "../../data/mockOrders";
import OrderCard from "./OrderCard";

const { width } = Dimensions.get("window");

// Create Animated versions of components
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const OrderList = ({ onOrderPress }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const filters = [
    { id: "all", label: "All", icon: "apps-outline", color: "#3B82F6" },
    { id: "pending", label: "Pending", icon: "time-outline", color: "#F59E0B" },
    {
      id: "processing",
      label: "Processing",
      icon: "sync-outline",
      color: "#8B5CF6",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: "checkmark-done-circle-outline",
      color: "#10B981",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: "close-circle-outline",
      color: "#EF4444",
    },
  ];

  const filteredOrders = useMemo(() => {
    let orders = MOCK_ORDERS;

    if (selectedFilter !== "all") {
      orders = orders.filter((order) => order.status === selectedFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email?.toLowerCase().includes(query),
      );
    }

    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [selectedFilter, searchQuery]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleOrderPress = useCallback(
    (order) => {
      if (onOrderPress) {
        onOrderPress(order);
      } else {
        navigation.navigate("OrderDetail", { orderId: order.id });
      }
    },
    [navigation, onOrderPress],
  );

  const getStats = () => {
    const total = filteredOrders.length;
    const totalAmount = filteredOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const pendingCount = filteredOrders.filter(
      (o) => o.status === "pending",
    ).length;

    return { total, totalAmount, pendingCount };
  };

  const stats = getStats();

  const renderFilterChip = (filter) => {
    const isSelected = selectedFilter === filter.id;
    return (
      <TouchableOpacity
        key={filter.id}
        onPress={() => setSelectedFilter(filter.id)}
        activeOpacity={0.7}
        className="mr-3"
      >
        <View
          className={`flex-row items-center px-5 py-3 rounded-2xl ${
            isSelected ? "shadow-lg" : ""
          }`}
          style={{
            backgroundColor: isSelected ? filter.color : "#F3F4F6",
          }}
        >
          <Ionicons
            name={filter.icon}
            size={18}
            color={isSelected ? "white" : "#6B7280"}
          />
          <Text
            className={`ml-2 text-sm font-semibold ${
              isSelected ? "text-white" : "text-gray-600"
            }`}
          >
            {filter.label}
          </Text>
          {isSelected && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full items-center justify-center">
              <Text
                className="text-xs font-bold"
                style={{ color: filter.color }}
              >
                {filter.id === "all"
                  ? stats.total
                  : filter.id === "pending"
                    ? stats.pendingCount
                    : ""}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-28 h-28 bg-blue-100 rounded-3xl items-center justify-center mb-6 shadow-xl">
        <Ionicons name="document-text-outline" size={48} color="#3B82F6" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-3">
        No Orders Found
      </Text>
      <Text className="text-base text-gray-500 text-center mb-8 leading-6">
        {searchQuery
          ? `We couldn't find any orders matching "${searchQuery}"`
          : "Your order list is empty. Start by creating your first order to see it here."}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          className="flex-row items-center bg-blue-500 px-8 py-4 rounded-2xl shadow-xl"
          onPress={() => navigation.navigate("CreateOrder")}
          activeOpacity={0.9}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Create New Order
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <Animated.View
      className="bg-white border-b border-gray-100 pb-5"
      style={{
        opacity: headerOpacity,
        transform: [{ translateY: headerTranslateY }],
      }}
    >
      {/* Header Title */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-gray-900">Orders</Text>
        <Text className="text-base text-gray-500 mt-1">
          Manage and track all your orders
        </Text>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 mb-4"
      >
        <View className="flex-row space-x-3">
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-5 py-4 rounded-2xl shadow-lg mr-3"
            style={{ width: width * 0.4 }}
          >
            <Ionicons name="cube-outline" size={24} color="white" />
            <Text className="text-white text-2xl font-bold mt-2">
              {stats.total}
            </Text>
            <Text className="text-white text-sm opacity-90">Total Orders</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-5 py-4 rounded-2xl shadow-lg"
            style={{ width: width * 0.4 }}
          >
            <Ionicons name="cash-outline" size={24} color="white" />
            <Text className="text-white text-2xl font-bold mt-2">
              ${stats.totalAmount.toFixed(0)}
            </Text>
            <Text className="text-white text-sm opacity-90">Total Revenue</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View className="px-5 mb-4">
        <View
          className={`flex-row items-center bg-gray-100 rounded-2xl border-2 ${
            isSearchFocused ? "border-blue-500 bg-white" : "border-transparent"
          }`}
        >
          <View className="pl-5">
            <Ionicons
              name="search-outline"
              size={20}
              color={isSearchFocused ? "#3B82F6" : "#9CA3AF"}
            />
          </View>
          <TextInput
            className="flex-1 py-4 px-3 text-gray-900 text-base"
            placeholder="Search orders by number or customer..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="pr-5"
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Chips */}
      <View className="px-5">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-semibold text-gray-700">
            Filter by Status
          </Text>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setSelectedFilter("all")}
          >
            <Text className="text-sm text-blue-500 font-medium mr-1">
              Clear
            </Text>
            <Ionicons name="close-circle-outline" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row pb-2">{filters.map(renderFilterChip)}</View>
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="flex-row justify-between items-center px-5 mt-4">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-900 mr-2">
            {filteredOrders.length}
          </Text>
          <Text className="text-base text-gray-500">
            {filteredOrders.length === 1 ? "Order" : "Orders"} found
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl">
          <Ionicons name="swap-vertical" size={16} color="#4B5563" />
          <Text className="text-sm font-medium text-gray-700 ml-1">
            Sort by: Newest
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderItem = ({ item, index }) => {
    const scale = scrollY.interpolate({
      inputRange: [-1, 0, 100 * index, 100 * (index + 2)],
      outputRange: [1, 1, 1, 0.98],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
        }}
      >
        <View className="px-5 pt-3">
          <OrderCard order={item} onPress={handleOrderPress} />
        </View>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    if (filteredOrders.length === 0) return null;

    return (
      <View className="py-8 items-center">
        <View className="bg-white/90 px-6 py-3 rounded-full shadow-lg">
          <Text className="text-sm text-gray-600">
            {filteredOrders.length} orders loaded
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <AnimatedFlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />

      {/* Quick Action Button */}
      {filteredOrders.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-2xl"
          onPress={() => navigation.navigate("CreateOrder")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderList;
