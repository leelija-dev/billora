// screens/orders/OrderDetailScreen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Static order data
const STATIC_ORDER = {
  id: "ORD-001",
  orderNumber: "ORD-001",
  customer: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  orderDate: "2024-03-15T10:30:00Z",
  status: "processing",
  paymentStatus: "paid",
  paymentMethod: "Visa •••• 4242",
  subtotal: 259.98,
  tax: 20.8,
  shipping: 15.0,
  total: 295.78,
  items: [
    {
      id: 1,
      name: "Classic White T-Shirt",
      quantity: 2,
      price: 29.99,
      image: "https://via.placeholder.com/100",
      color: "White",
      size: "L",
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      quantity: 1,
      price: 79.99,
      image: "https://via.placeholder.com/100",
      color: "Blue",
      size: "32",
    },
    {
      id: 3,
      name: "Leather Sneakers",
      quantity: 1,
      price: 89.99,
      image: "https://via.placeholder.com/100",
      color: "Black",
      size: "9",
    },
    {
      id: 4,
      name: "Cashmere Sweater",
      quantity: 1,
      price: 99.99,
      image: "https://via.placeholder.com/100",
      color: "Gray",
      size: "M",
    },
  ],
  shippingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    type: "Home",
  },
  billingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  },
  notes: "Please leave the package at the front door. Call when delivered.",
  trackingNumber: "TRK123456789",
  estimatedDelivery: "2024-03-20T18:00:00Z",
  timeline: [
    {
      status: "Order Placed",
      date: "2024-03-15T10:30:00Z",
      completed: true,
    },
    {
      status: "Payment Confirmed",
      date: "2024-03-15T10:35:00Z",
      completed: true,
    },
    {
      status: "Processing",
      date: "2024-03-15T14:20:00Z",
      completed: true,
    },
    {
      status: "Shipped",
      date: "2024-03-16T09:00:00Z",
      completed: false,
    },
    {
      status: "Delivered",
      date: null,
      completed: false,
    },
  ],
};

const OrderDetailScreen = ({ navigation }) => {
  const [order] = useState(STATIC_ORDER);
  const [activeTab, setActiveTab] = useState("details");
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const getStatusColor = (status) => {
    const colors = {
      delivered: { bg: "#34D39920", text: "#059669", icon: "checkmark-circle" },
      cancelled: { bg: "#F8717120", text: "#DC2626", icon: "close-circle" },
      pending: { bg: "#FBBF2420", text: "#D97706", icon: "time" },
      processing: { bg: "#60A5FA20", text: "#2563EB", icon: "sync" },
      confirmed: { bg: "#8B5CF620", text: "#6D28D9", icon: "checkmark" },
      shipped: { bg: "#8B5CF620", text: "#6D28D9", icon: "rocket" },
    };
    return colors[order.status] || colors.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      Alert.alert("Navigation", "Go back");
    }
  };

  const handleEdit = () => {
    Alert.alert("Edit Order", "Navigate to edit order screen");
  };

  const handleUpdateStatus = () => {
    Alert.alert("Update Status", "Choose new status", [
      { text: "Cancel", style: "cancel" },
      { text: "Processing", onPress: () => {} },
      { text: "Shipped", onPress: () => {} },
      { text: "Delivered", onPress: () => {} },
      { text: "Cancelled", style: "destructive", onPress: () => {} },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Order", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {} },
    ]);
  };

  const handleContactCustomer = () => {
    Alert.alert(
      "Contact",
      `Email: ${order.customer.email}\nPhone: ${order.customer.phone}`,
    );
  };

  const statusColor = getStatusColor();

  const renderDetailsTab = () => (
    <View>
      {/* Customer Info */}
      <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
        <View className="flex-row items-center mb-4">
          <View className="rounded-full overflow-hidden w-[40px] h-[40px] justify-center items-center mr-3">
            <LinearGradient
              colors={["#60A5FA", "#3B82F6"]}
              className="w-full h-full items-center justify-center"
            >
              <Ionicons name="person-outline" size={20} color="white" />
            </LinearGradient>
          </View>
          <Text className="text-lg font-bold text-gray-900">Customer</Text>
        </View>

        <View className="flex-row items-center">
          <Image
            source={{ uri: order.customer.avatar }}
            className="w-16 h-16 rounded-2xl"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">
              {order.customer.name}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {order.customer.email}
            </Text>
            <Text className="text-gray-500 text-sm">
              {order.customer.phone}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContactCustomer}
          className="mt-4 bg-gray-50 p-3 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="mail-outline" size={18} color="#6366F1" />
          <Text className="text-indigo-500 font-semibold ml-2">
            Contact Customer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shipping Address */}
      <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
        <View className="flex-row items-center mb-4">
          <View className="rounded-full overflow-hidden w-[40px] h-[40px] justify-center items-center mr-3">
            <LinearGradient
              colors={["#34D399", "#10B981"]}
              className="w-full h-full items-center justify-center"
            >
              <Ionicons name="location-outline" size={20} color="white" />
            </LinearGradient>
          </View>
          <Text className="text-lg font-bold text-gray-900">Shipping</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-2xl">
          <View className="flex-row items-center mb-2">
            <Ionicons name="home-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-2">
              {order.shippingAddress.type}
            </Text>
          </View>
          <Text className="text-gray-900 font-medium">
            {order.shippingAddress.street}
          </Text>
          <Text className="text-gray-600 mt-1">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zip}
          </Text>
          <Text className="text-gray-600">{order.shippingAddress.country}</Text>

          {order.trackingNumber && (
            <View className="mt-4 pt-4 border-t border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="cube-outline" size={16} color="#6366F1" />
                  <Text className="text-indigo-500 font-semibold ml-2">
                    Tracking: {order.trackingNumber}
                  </Text>
                </View>
                <TouchableOpacity className="bg-indigo-50 px-4 py-2 rounded-xl">
                  <Text className="text-indigo-600 text-sm font-medium">
                    Track
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Payment Info */}
      <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
        <View className="flex-row items-center mb-4">
          <View className="rounded-full overflow-hidden w-[40px] h-[40px] justify-center items-center mr-3">
            <LinearGradient
              colors={["#F59E0B", "#D97706"]}
              className="w-full h-full items-center justify-center"
            >
              <Ionicons name="card-outline" size={20} color="white" />
            </LinearGradient>
          </View>
          <Text className="text-lg font-bold text-gray-900">Payment</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-2xl">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-500">Method</Text>
            <Text className="text-gray-900 font-medium">
              {order.paymentMethod}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-500">Status</Text>
            <View className="flex-row items-center">
              <Ionicons
                name={
                  order.paymentStatus === "paid" ? "checkmark-circle" : "time"
                }
                size={16}
                color={order.paymentStatus === "paid" ? "#10b981" : "#f59e0b"}
              />
              <Text
                className={`ml-1 font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order Notes */}
      {order.notes && (
        <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="rounded-full overflow-hidden w-[40px] h-[40px] justify-center items-center mr-3">
              <LinearGradient
                colors={["#8B5CF6", "#6D28D9"]}
                className="w-full h-full items-center justify-center"
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="white"
                />
              </LinearGradient>
            </View>
            <Text className="text-lg font-bold text-gray-900">Notes</Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-2xl">
            <Text className="text-gray-600 leading-6">{order.notes}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderItemsTab = () => (
    <View className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <LinearGradient colors={["#6366F1", "#8B5CF6"]} className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-lg">Order Items</Text>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white text-sm">
              {order.items.length} items
            </Text>
          </View>
        </View>
      </LinearGradient>

      {order.items.map((item, index) => (
        <View
          key={item.id}
          className={`p-4 ${
            index !== order.items.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          <View className="flex-row">
            <LinearGradient
              colors={["#f3f4f6", "#e5e7eb"]}
              className="w-20 h-20 rounded-2xl items-center justify-center"
            >
              <Ionicons name="cube-outline" size={30} color="#9ca3af" />
            </LinearGradient>

            <View className="flex-1 ml-3">
              <Text className="text-gray-900 font-semibold text-base">
                {item.name}
              </Text>

              <View className="flex-row mt-1">
                {item.color && (
                  <View className="flex-row items-center mr-3">
                    <View
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                    <Text className="text-gray-500 text-xs">{item.color}</Text>
                  </View>
                )}
                {item.size && (
                  <Text className="text-gray-500 text-xs">
                    Size: {item.size}
                  </Text>
                )}
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-900 font-bold">
                  {formatCurrency(item.price)}
                </Text>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 text-sm">
                    Qty: {item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Order Summary */}
      <View className="p-4 bg-gray-50 border-t border-gray-200">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Subtotal</Text>
          <Text className="text-gray-900 font-medium">
            {formatCurrency(order.subtotal)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Tax</Text>
          <Text className="text-gray-900 font-medium">
            {formatCurrency(order.tax)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-500">Shipping</Text>
          <Text className="text-gray-900 font-medium">
            {formatCurrency(order.shipping)}
          </Text>
        </View>

        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          className="p-4 rounded-2xl mt-2"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-semibold">Total</Text>
            <Text className="text-white font-bold text-xl">
              {formatCurrency(order.total)}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  const renderTimelineTab = () => (
    <View className="bg-white p-5 rounded-3xl border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="rounded-full overflow-hidden w-[40px] h-[40px] justify-center items-center mr-3">
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            className="w-full h-full items-center justify-center "
          >
            <Ionicons name="time-outline" size={20} color="white" />
          </LinearGradient>
        </View>
        <Text className="text-lg font-bold text-gray-900">Order Timeline</Text>
      </View>

      {order.timeline.map((event, index) => (
        <View key={index} className="flex-row mb-4">
          <View className="items-center mr-4">
            <View
              className={`w-6 h-6 rounded-full ${
                event.completed ? "bg-green-500" : "bg-gray-200"
              } items-center justify-center`}
            >
              {event.completed && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
            {index !== order.timeline.length - 1 && (
              <View className="w-0.5 h-12 bg-gray-200 mt-1" />
            )}
          </View>

          <View className="flex-1 pb-4">
            <View className="flex-row justify-between items-center">
              <Text
                className={`font-semibold ${
                  event.completed ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {event.status}
              </Text>
              {event.date && (
                <Text className="text-xs text-gray-400">
                  {formatDate(event.date)}
                </Text>
              )}
            </View>
            {!event.completed && (
              <Text className="text-xs text-gray-400 mt-1">
                {event.status === "Shipped"
                  ? "Estimated: " + formatDate(order.estimatedDelivery)
                  : "Pending"}
              </Text>
            )}
          </View>
        </View>
      ))}

      {/* Estimated Delivery */}
      <View className="mt-4 p-4 bg-indigo-50 rounded-2xl">
        <View className="flex-row items-center">
          <Ionicons name="rocket-outline" size={20} color="#6366F1" />
          <Text className="text-indigo-600 font-semibold ml-2">
            Estimated Delivery
          </Text>
        </View>
        <Text className="text-indigo-700 text-lg font-bold mt-2">
          {formatDate(order.estimatedDelivery)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerOpacity,
          transform: [{ scale: headerScale }],
        }}
        className="bg-white border-b border-gray-100"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-sm text-gray-500">Order Details</Text>
            <Text className="text-lg font-bold text-gray-900">
              #{order.orderNumber}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleEdit}
            className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center"
          >
            <Ionicons name="create-outline" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {/* Order Header Card */}
        <LinearGradient
          colors={["#ffffff", "#f9fafb"]}
          className="mx-4 mt-4 p-5 rounded-3xl border border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
          }}
        >
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#6366F1", "#8B5CF6"]}
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
            >
              <Ionicons name="receipt" size={28} color="white" />
            </LinearGradient>

            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-2xl font-bold text-gray-900 mr-2">
                  #{order.orderNumber}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full`}
                  style={{ backgroundColor: statusColor.bg }}
                >
                  <Text
                    className={`text-xs font-semibold`}
                    style={{ color: statusColor.text }}
                  >
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-500 ml-1">
                  {formatDate(order.orderDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row mt-5 pt-4 border-t border-gray-100">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {order.items.length}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Items</Text>
            </View>

            <View className="w-px h-8 bg-gray-200 self-center" />

            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.total)}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Total</Text>
            </View>

            <View className="w-px h-8 bg-gray-200 self-center" />

            <View className="flex-1 items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    order.paymentStatus === "paid" ? "checkmark-circle" : "time"
                  }
                  size={20}
                  color={order.paymentStatus === "paid" ? "#10b981" : "#f59e0b"}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Payment</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View className="flex-row mx-4 mt-6 bg-white p-1 rounded-2xl border border-gray-100">
          {["details", "items", "timeline"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 py-3 rounded-xl"
              style={{
                backgroundColor: activeTab === tab ? "#6366F1" : "transparent",
              }}
            >
              <Text
                className={`text-center font-medium capitalize ${
                  activeTab === tab ? "text-white" : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="px-4 mt-4">
          {activeTab === "details" && renderDetailsTab()}
          {activeTab === "items" && renderItemsTab()}
          {activeTab === "timeline" && renderTimelineTab()}
        </View>

        {/* Action Buttons */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className="mb-3 rounded-2xl overflow-hidden"
            onPress={handleUpdateStatus}
          >
            <LinearGradient
              colors={["#6366F1", "#8B5CF6"]}
              className="flex-row items-center justify-center py-4 rounded-2xl"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Update Status
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            className="mb-3 rounded-2xl overflow-hidden"
            onPress={handleDelete}
          >
            <LinearGradient
              colors={["#F87171", "#DC2626"]}
              className="flex-row items-center justify-center py-4 rounded-2xl"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Delete Order
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 flex-row items-center justify-center py-4 rounded-2xl">
            <Ionicons name="print-outline" size={20} color="#374151" />
            <Text className="text-gray-700 font-semibold text-base ml-2">
              Print Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
