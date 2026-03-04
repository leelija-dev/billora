// OrderCard.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

const OrderCard = ({ order, onPress }) => {
  const navigation = useNavigation();

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: "checkmark-circle",
        label: "Delivered",
        gradient: ["#10B981", "#059669"],
        lightBg: "#ECFDF5",
      },
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        icon: "time",
        label: "Pending",
        gradient: ["#F59E0B", "#D97706"],
        lightBg: "#FFFBEB",
      },
      processing: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        icon: "sync",
        label: "Processing",
        gradient: ["#8B5CF6", "#7C3AED"],
        lightBg: "#F5F3FF",
      },
      confirmed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: "checkmark",
        label: "Confirmed",
        gradient: ["#3B82F6", "#2563EB"],
        lightBg: "#EFF6FF",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: "close-circle",
        label: "Cancelled",
        gradient: ["#EF4444", "#DC2626"],
        lightBg: "#FEF2F2",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(order?.status);

  const handlePress = () => {
    if (onPress) {
      onPress(order);
    } else {
      navigation.navigate("OrderDetail", { orderId: order?.id });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!order) return null;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 mb-4">
        {/* Header with Order Number and Status */}
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <View className="flex-row items-center">
              <View className="w-1 h-8 bg-blue-500 rounded-full mr-3" />
              <View>
                <Text className="text-xs text-gray-500 mb-1">Order Number</Text>
                <Text className="text-xl font-bold text-gray-900">
                  #{order.orderNumber}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mt-2 ml-4">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {order.customer?.name}
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={statusConfig.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-4 py-2.5 rounded-2xl"
          >
            <View className="flex-row items-center">
              <Ionicons name={statusConfig.icon} size={14} color="white" />
              <Text className="text-white text-xs font-bold ml-1">
                {statusConfig.label}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Items Preview with Icons */}
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-2">Order Items</Text>
          <View className="flex-row items-center">
            <View className="flex-row flex-1">
              {order.items?.slice(0, 4).map((item, index) => (
                <View
                  key={index}
                  className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center -ml-2 first:ml-0 border-2 border-white shadow-sm"
                >
                  <Text className="text-sm font-bold text-gray-700">
                    {item.name?.charAt(0) || "?"}
                  </Text>
                </View>
              ))}
              {order.items?.length > 4 && (
                <View className="w-10 h-10 bg-gray-300 rounded-2xl items-center justify-center -ml-2 border-2 border-white">
                  <Text className="text-xs font-bold text-gray-700">
                    +{order.items.length - 4}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {order.items?.length || 0}{" "}
              {order.items?.length === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>

        {/* Details Grid */}
        <View className="flex-row justify-between py-4 border-t border-gray-100">
          <View className="items-center flex-1">
            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="calendar" size={18} color="#3B82F6" />
            </View>
            <Text className="text-xs text-gray-500 mb-1">Date</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatDate(order.createdAt)}
            </Text>
          </View>

          <View className="items-center flex-1">
            <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="cash" size={18} color="#10B981" />
            </View>
            <Text className="text-xs text-gray-500 mb-1">Total</Text>
            <Text className="text-base font-bold text-gray-900">
              ${order.total?.toFixed(2) || "0.00"}
            </Text>
          </View>

          <View className="items-center flex-1">
            <View
              className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${
                order.paymentStatus === "paid" ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              <Ionicons
                name={order.paymentStatus === "paid" ? "card" : "time"}
                size={18}
                color={order.paymentStatus === "paid" ? "#10B981" : "#F59E0B"}
              />
            </View>
            <Text className="text-xs text-gray-500 mb-1">Payment</Text>
            <Text
              className={`text-sm font-semibold ${
                order.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {order.paymentStatus === "paid" ? "Paid" : "Pending"}
            </Text>
          </View>
        </View>

        {/* Footer with Location and Notes */}
        <View className="pt-4 border-t border-gray-100">
          {order.shippingAddress && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text
                className="text-sm text-gray-600 ml-2 flex-1"
                numberOfLines={1}
              >
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </Text>
            </View>
          )}

          {order.notes && (
            <View className="flex-row items-start">
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#6B7280"
              />
              <Text
                className="text-sm text-gray-500 ml-2 flex-1 italic"
                numberOfLines={1}
              >
                "{order.notes}"
              </Text>
            </View>
          )}
        </View>

        {/* View Details Indicator */}
        <View className="absolute bottom-2 right-4">
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
