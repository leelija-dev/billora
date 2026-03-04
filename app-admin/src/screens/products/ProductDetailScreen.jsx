// screens/products/ProductDetailScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { productsAPI } from "../../api";
import ErrorState from "../../components/common/ErrorState";
import Header from "../../components/common/Header";
import Loading from "../../components/common/Loading";
import { useApi } from "../../hooks/useApi";
import { useProductStore } from "../../store/productStore";
import { useUIStore } from "../../store/uiStore";
import { formatCurrency } from "../../utils/helpers";

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params || {};
  const { selectedProduct, setSelectedProduct } = useProductStore();
  const { showSuccess, showError } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockUpdate, setStockUpdate] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'history', 'stats'

  const {
    data: product,
    loading: productLoading,
    error: productError,
    execute: fetchProduct,
  } = useApi(() => productsAPI.getProduct(productId));

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      setStockUpdate(product.stock?.toString() || "0");
    }
  }, [product]);

  const handleEdit = () => {
    navigation.navigate("AddProduct", { productId });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await productsAPI.deleteProduct(productId);
              showSuccess("Product deleted successfully");
              navigation.goBack();
            } catch (error) {
              showError(error.message || "Failed to delete product");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name}\nPrice: ${formatCurrency(product?.price)}\nSKU: ${product?.sku}`,
        title: product?.name,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleUpdateStock = () => {
    setShowStockModal(true);
  };

  const confirmStockUpdate = () => {
    const newStock = parseInt(stockUpdate);
    if (isNaN(newStock) || newStock < 0) {
      Alert.alert("Invalid Stock", "Please enter a valid stock number");
      return;
    }

    // Here you would call API to update stock
    showSuccess(`Stock updated to ${newStock} units`);
    setShowStockModal(false);
  };

  const getStockStatus = () => {
    if (!product)
      return { label: "Unknown", color: "text-gray-500", bg: "bg-gray-100" };
    if (product.stock === 0)
      return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
    if (product.stock <= (product.minStock || 5))
      return {
        label: "Low Stock",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-100" };
  };

  const stockStatus = getStockStatus();

  if (productLoading && !product) {
    return (
      <View className="flex-1 bg-gray-50">
        <SafeAreaView className="flex-1">
          <Header title="Product Details" showBackButton />
          <Loading text="Loading product..." />
        </SafeAreaView>
      </View>
    );
  }

  if (productError) {
    return (
      <View className="flex-1 bg-gray-50">
        <SafeAreaView className="flex-1">
          <Header title="Product Details" showBackButton />
          <ErrorState
            title="Failed to Load Product"
            description="Unable to load product details. Please try again."
            onRetry={fetchProduct}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-gray-50">
        <SafeAreaView className="flex-1">
          <Header title="Product Details" showBackButton />
          <ErrorState
            title="Product Not Found"
            description="The product you're looking for doesn't exist."
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1" edges={["left", "right"]}>
        <Header
          title="Product Details"
          showBackButton
          rightComponent={
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              >
                <Icon name="share-variant" size={22} color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEdit}
                className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"
              >
                <Icon name="pencil" size={22} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Product Image Section */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="flex-row">
              <View className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden">
                {product.image ? (
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Icon name="image-off" size={30} color="#9ca3af" />
                  </View>
                )}
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-2xl font-bold text-gray-800">
                  {product.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Icon name="tag" size={14} color="#9ca3af" />
                  <Text className="text-sm text-gray-500 ml-1">
                    {product.category || "Uncategorized"}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Icon name="barcode" size={14} color="#9ca3af" />
                  <Text className="text-sm text-gray-500 ml-1">
                    SKU: {product.sku || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-white rounded-2xl p-1 mb-4 shadow-sm">
            {["details", "history", "stats"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === tab ? "bg-blue-500" : ""
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    activeTab === tab ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "details" && (
            <>
              {/* Price Card */}
              <LinearGradient
                colors={["#3b82f6", "#2563eb"]}
                className="rounded-2xl p-4 mb-4"
              >
                <Text className="text-white/80 text-sm mb-1">
                  Current Price
                </Text>
                <View className="flex-row items-baseline justify-between">
                  <Text className="text-white text-3xl font-bold">
                    {formatCurrency(product.price)}
                  </Text>
                  {product.originalPrice > product.price && (
                    <View>
                      <Text className="text-white/60 text-sm line-through">
                        {formatCurrency(product.originalPrice)}
                      </Text>
                      <Text className="text-white text-xs font-semibold">
                        Save{" "}
                        {Math.round(
                          (1 - product.price / product.originalPrice) * 100,
                        )}
                        %
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>

              {/* Stock Status Card */}
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-semibold text-gray-800">
                    Stock Status
                  </Text>
                  <TouchableOpacity
                    onPress={handleUpdateStock}
                    className="bg-blue-500 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white font-medium">Update Stock</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className={`w-3 h-3 rounded-full ${stockStatus.bg.replace("bg-", "bg-")}`}
                    />
                    <Text className={`ml-2 font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">
                    {product.stock} units
                  </Text>
                </View>

                {product.minStock > 0 && (
                  <View className="mt-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-xs text-gray-500">
                        Min Stock Level
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {product.minStock} units
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min((product.stock / product.minStock) * 100, 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Description */}
              {product.description && (
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </Text>
                  <Text className="text-gray-600 leading-6">
                    {product.description}
                  </Text>
                </View>
              )}

              {/* Additional Details */}
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Additional Details
                </Text>

                <View className="flex-row flex-wrap">
                  <View className="w-1/2 mb-3">
                    <Text className="text-xs text-gray-400">Supplier</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {product.supplier || "N/A"}
                    </Text>
                  </View>
                  <View className="w-1/2 mb-3">
                    <Text className="text-xs text-gray-400">Location</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {product.location || "N/A"}
                    </Text>
                  </View>
                  <View className="w-1/2 mb-3">
                    <Text className="text-xs text-gray-400">Brand</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {product.brand || "N/A"}
                    </Text>
                  </View>
                  <View className="w-1/2 mb-3">
                    <Text className="text-xs text-gray-400">Rating</Text>
                    <View className="flex-row items-center">
                      <Icon name="star" size={16} color="#fbbf24" />
                      <Text className="text-sm font-medium text-gray-800 ml-1">
                        {product.rating || "0"} ({product.reviews || 0})
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          {activeTab === "history" && (
            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Stock History
              </Text>

              {/* Sample history items */}
              <View className="border-l-2 border-blue-200 pl-4 ml-2">
                <View className="mb-4">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-blue-500 rounded-full -ml-5 mr-3" />
                    <Text className="text-sm font-medium text-gray-800">
                      Stock Updated
                    </Text>
                    <Text className="text-xs text-gray-400 ml-auto">
                      2 hours ago
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 ml-4 mt-1">
                    Quantity changed from 45 to 50 units
                  </Text>
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full -ml-5 mr-3" />
                    <Text className="text-sm font-medium text-gray-800">
                      Stock Added
                    </Text>
                    <Text className="text-xs text-gray-400 ml-auto">
                      Yesterday
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 ml-4 mt-1">
                    Received 20 units from supplier
                  </Text>
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-red-500 rounded-full -ml-5 mr-3" />
                    <Text className="text-sm font-medium text-gray-800">
                      Stock Sold
                    </Text>
                    <Text className="text-xs text-gray-400 ml-auto">
                      3 days ago
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 ml-4 mt-1">
                    Sold 5 units to customer
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "stats" && (
            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Product Statistics
              </Text>

              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-4">
                  <View className="bg-blue-50 rounded-xl p-3">
                    <Icon name="currency-usd" size={24} color="#3b82f6" />
                    <Text className="text-2xl font-bold text-gray-800 mt-2">
                      {formatCurrency(product.price * product.stock)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Inventory Value
                    </Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pl-2">
                  <View className="bg-green-50 rounded-xl p-3">
                    <Icon name="trending-up" size={24} color="#10b981" />
                    <Text className="text-2xl font-bold text-gray-800 mt-2">
                      156
                    </Text>
                    <Text className="text-xs text-gray-500">Units Sold</Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pr-2">
                  <View className="bg-purple-50 rounded-xl p-3">
                    <Icon name="calendar" size={24} color="#8b5cf6" />
                    <Text className="text-2xl font-bold text-gray-800 mt-2">
                      45
                    </Text>
                    <Text className="text-xs text-gray-500">Days in Stock</Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pl-2">
                  <View className="bg-orange-50 rounded-xl p-3">
                    <Icon name="rotate-3d" size={24} color="#f97316" />
                    <Text className="text-2xl font-bold text-gray-800 mt-2">
                      2.3x
                    </Text>
                    <Text className="text-xs text-gray-500">Turnover Rate</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 bg-red-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="delete" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="pencil" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Edit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Stock Update Modal */}
        <Modal
          visible={showStockModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStockModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl w-80 p-5">
              <View className="items-center mb-4">
                <LinearGradient
                  colors={["#3b82f6", "#2563eb"]}
                  className="w-16 h-16 rounded-full items-center justify-center"
                >
                  <Icon name="package-up" size={32} color="#ffffff" />
                </LinearGradient>
              </View>

              <Text className="text-xl font-semibold text-gray-800 text-center mb-2">
                Update Stock
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                Enter the new stock quantity for {product.name}
              </Text>

              <TextInput
                value={stockUpdate}
                onChangeText={setStockUpdate}
                keyboardType="numeric"
                placeholder="Enter quantity"
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 mb-4"
              />

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowStockModal(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl"
                >
                  <Text className="text-gray-600 font-semibold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmStockUpdate}
                  className="flex-1 bg-blue-500 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold text-center">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default ProductDetailScreen;
