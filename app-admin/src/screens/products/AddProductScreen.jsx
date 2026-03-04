// screens/products/AddProductScreen.js
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../components/common/Header";
import ProductForm from "../../components/products/ProductForm";

const AddProductScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1" edges={["left", "right"]}>
        <Header
          title="Add Product"
          showBackButton
          rightComponent={
            <View className="flex-row items-center">
              <LinearGradient
                colors={["#3b82f6", "#2563eb"]}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <Icon name="help" size={22} color="#ffffff" />
              </LinearGradient>
            </View>
          }
        />

        {/* Decorative Header */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          className="px-5 py-6 mx-4 rounded-2xl mb-4"
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
              <Icon name="package-variant" size={28} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">
                Add New Product
              </Text>
              <Text className="text-white/80 text-sm">
                Fill in the details below
              </Text>
            </View>
          </View>
        </LinearGradient>

        <ProductForm />
      </SafeAreaView>
    </View>
  );
};

export default AddProductScreen;
