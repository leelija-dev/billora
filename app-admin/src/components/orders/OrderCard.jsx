// components/orders/OrderCard.js
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const OrderCard = ({ order, viewMode = "list" }) => {
  const navigation = useNavigation();

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: "check-circle",
        };
      case "processing":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: "progress-clock",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          icon: "clock-outline",
        };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-600", icon: "close-circle" };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: "help-circle",
        };
    }
  };

  const handlePress = () => {
    navigation.navigate("OrderDetail", { orderId: order.id });
  };

  if (viewMode === "grid") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-[48%] mx-[1%] bg-white rounded-2xl p-3 mb-3 shadow-sm "
      >
        <View className="items-center mb-2">
          <Image
            source={{ uri: order.customerAvatar }}
            className="w-16 h-16 rounded-full"
          />
          <Text
            className="text-base font-semibold text-gray-800 mt-2"
            numberOfLines={1}
          >
            {order.customerName}
          </Text>
          <Text className="text-xs text-gray-500">#{order.id}</Text>
        </View>

        <View
          className={`self-center px-3 py-1 rounded-full ${getStatusColor(order.status).bg} mb-2`}
        >
          <Text
            className={`text-xs font-medium ${getStatusColor(order.status).text}`}
          >
            {order.status}
          </Text>
        </View>

        <Text className="text-lg font-bold text-blue-600 text-center">
          ${order.total.toFixed(2)}
        </Text>

        <Text className="text-xs text-gray-500 text-center mt-1">
          {new Date(order.orderDate).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  }

  const statusStyle = getStatusColor(order.status);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm "
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Image
            source={{ uri: order.customerAvatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-base font-semibold text-gray-800">
              {order.customerName}
            </Text>
            <Text className="text-xs text-gray-500">Order #{order.id}</Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
          <Text className={`text-xs font-medium ${statusStyle.text}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Items Summary */}
      <View className="mb-3">
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {order.items.map((i) => i.name).join(", ")}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center pt-3 border-t border-blue-100">
        <View>
          <Text className="text-xs text-gray-500">Total Amount</Text>
          <Text className="text-lg font-bold text-blue-600">
            ${order.total.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="calendar" size={14} color="#9ca3af" />
          <Text className="text-xs text-gray-500 ml-1">
            {new Date(order.orderDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
