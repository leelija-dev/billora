// components/orders/OrderList.js
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";

// Static order data (keep your existing STATIC_ORDERS array here)
const STATIC_ORDERS = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    orderDate: "2024-03-15T10:30:00Z",
    total: 299.99,
    status: "delivered",
    paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Classic White T-Shirt", quantity: 2, price: 29.99 },
      { id: 2, name: "Slim Fit Jeans", quantity: 1, price: 79.99 },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-002",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    orderDate: "2024-03-14T14:20:00Z",
    total: 189.5,
    status: "processing",
    paymentMethod: "PayPal",
    items: [
      { id: 3, name: "Leather Sneakers", quantity: 1, price: 89.99 },
      { id: 4, name: "Cashmere Sweater", quantity: 1, price: 99.99 },
    ],
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-003",
    customerName: "Michael Brown",
    customerEmail: "michael.b@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    orderDate: "2024-03-14T09:15:00Z",
    total: 79.99,
    status: "pending",
    paymentMethod: "Debit Card",
    items: [{ id: 5, name: "Sports Watch", quantity: 1, price: 79.99 }],
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    trackingNumber: null,
  },
  {
    id: "ORD-004",
    customerName: "Sarah Davis",
    customerEmail: "sarah.d@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
    orderDate: "2024-03-13T16:45:00Z",
    total: 459.99,
    status: "delivered",
    paymentMethod: "Credit Card",
    items: [
      { id: 6, name: "Wool Overcoat", quantity: 1, price: 299.99 },
      { id: 7, name: "Leather Boots", quantity: 1, price: 159.99 },
    ],
    shippingAddress: "321 Elm Blvd, Houston, TX 77001",
    trackingNumber: "TRK456789123",
  },
  {
    id: "ORD-005",
    customerName: "David Lee",
    customerEmail: "david.lee@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
    orderDate: "2024-03-13T11:30:00Z",
    total: 129.99,
    status: "cancelled",
    paymentMethod: "PayPal",
    items: [{ id: 8, name: "Running Shoes", quantity: 1, price: 129.99 }],
    shippingAddress: "654 Cedar Ln, Phoenix, AZ 85001",
    trackingNumber: null,
  },
  {
    id: "ORD-006",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.a@email.com",
    customerAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
    orderDate: "2024-03-12T13:20:00Z",
    total: 249.95,
    status: "processing",
    paymentMethod: "Credit Card",
    items: [
      { id: 9, name: "Leather Backpack", quantity: 1, price: 89.99 },
      { id: 10, name: "Sunglasses", quantity: 2, price: 79.98 },
    ],
    shippingAddress: "987 Maple Dr, Philadelphia, PA 19101",
    trackingNumber: "TRK321654987",
  },
];

const OrderList = ({
  viewMode = "list",
  searchQuery = "",
  filter = "all",
  navigation,
}) => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState(STATIC_ORDERS);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter orders based on search and filter
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Status filter
    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    return filtered;
  }, [orders, filter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return {
          bg: isDarkMode ? "bg-green-900/30" : "bg-green-100",
          text: isDarkMode ? "text-green-400" : "text-green-600",
          icon: "check-circle",
        };
      case "processing":
        return {
          bg: isDarkMode ? "bg-blue-900/30" : "bg-blue-100",
          text: isDarkMode ? "text-blue-400" : "text-blue-600",
          icon: "progress-clock",
        };
      case "pending":
        return {
          bg: isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100",
          text: isDarkMode ? "text-yellow-400" : "text-yellow-600",
          icon: "clock-outline",
        };
      case "cancelled":
        return {
          bg: isDarkMode ? "bg-red-900/30" : "bg-red-100",
          text: isDarkMode ? "text-red-400" : "text-red-600",
          icon: "close-circle",
        };
      default:
        return {
          bg: isDarkMode ? "bg-gray-800" : "bg-gray-100",
          text: isDarkMode ? "text-gray-400" : "text-gray-600",
          icon: "help-circle",
        };
    }
  };

  const handleOrderPress = (order) => {
    if (navigation) {
      navigation.navigate("OrderDetail", { orderId: order.id });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setOrders(STATIC_ORDERS);
      setRefreshing(false);
    }, 1000);
  };

  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, marginBottom: 16 }}>
      <View className="flex-row justify-between items-center">
        <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "order" : "orders"} found
        </Text>
        <TouchableOpacity className={`flex-row items-center px-3 py-1.5 rounded-full shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="filter" size={16} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          <Text className={`text-sm ml-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Filter</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderListItem = (item) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleOrderPress(item)}
        className={`rounded-2xl p-4 mb-3 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-white'
        }`}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Image
              source={{ uri: item.customerAvatar }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className={`text-base font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {item.customerName}
              </Text>
              <Text className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Order #{item.id}
              </Text>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Items Summary */}
        <View className="mb-3">
          <Text className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} numberOfLines={1}>
            {item.items.map((i) => i.name).join(", ")}
          </Text>
        </View>

        {/* Footer */}
        <View className={`flex-row justify-between items-center pt-3 border-t ${
          isDarkMode ? 'border-blue-900' : 'border-blue-100'
        }`}>
          <View>
            <Text className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Total Amount
            </Text>
            <Text className="text-lg font-bold text-blue-600">
              ${item.total.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="calendar" size={14} color="#9ca3af" />
            <Text className={`text-xs ml-1 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {new Date(item.orderDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Tracking if available */}
        {item.trackingNumber && (
          <View className="mt-2 flex-row items-center">
            <Icon name="truck" size={14} color="#3b82f6" />
            <Text className="text-xs text-blue-500 ml-1">
              Track: {item.trackingNumber}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGridItem = (item) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleOrderPress(item)}
        className={`w-[48%] mx-[1%] rounded-2xl p-3 mb-3 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-white'
        }`}
      >
        <View className="items-center mb-2">
          <Image
            source={{ uri: item.customerAvatar }}
            className="w-16 h-16 rounded-full"
          />
          <Text
            className={`text-base font-semibold mt-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            numberOfLines={1}
          >
            {item.customerName}
          </Text>
          <Text className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            #{item.id}
          </Text>
        </View>

        <View
          className={`self-center px-3 py-1 rounded-full ${statusStyle.bg} mb-2`}
        >
          <Text className={`text-xs font-medium ${statusStyle.text}`}>
            {item.status}
          </Text>
        </View>

        <Text className="text-lg font-bold text-blue-600 text-center">
          ${item.total.toFixed(2)}
        </Text>

        <Text className={`text-xs text-center mt-1 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {new Date(item.orderDate).toLocaleDateString()}
        </Text>

        <Text
          className={`text-xs text-center mt-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
          numberOfLines={1}
        >
          {item.items.length} {item.items.length === 1 ? "item" : "items"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < filteredOrders.length; i += 2) {
      const rowItems = filteredOrders.slice(i, i + 2);
      rows.push(
        <View key={`row-${i}`} className="flex-row justify-between mb-2">
          {rowItems.map(item => renderGridItem(item))}
        </View>
      );
    }
    return rows;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading orders...
        </Text>
      </View>
    );
  }

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="px-4">
          {renderHeader()}
          <View className="items-center justify-center py-16">
            <Icon name="clipboard-list" size={80} color="#d1d5db" />
            <Text className={`text-lg font-semibold mt-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No Orders Found
            </Text>
            <Text className={`text-sm text-center mt-2 px-8 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {searchQuery || filter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first order by tapping the + button"}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1">
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="pb-4">
          {viewMode === "grid" 
            ? renderGridItems() 
            : filteredOrders.map(item => renderListItem(item))}
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderList;