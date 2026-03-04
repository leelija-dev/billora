// OrdersScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderList from "../../components/orders/OrderList";

const OrdersScreen = () => {
  const navigation = useNavigation();

  const handleCreateOrder = () => {
    navigation.navigate("CreateOrder");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Orders</Text>
        <TouchableOpacity
          onPress={handleCreateOrder}
          className="flex-row items-center bg-blue-500 px-4 py-2 rounded-full shadow-sm"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-1">Create</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <OrderList />
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;
