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
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { useCategoryDetail } from "../../hooks/useCategoryDetail";
import ErrorState from "../../components/common/ErrorState";
import Loading from "../../components/common/Loading";

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {};
  const { isDarkMode } = useThemeStore();
  const { 
    category, 
    loading, 
    error, 
    updateCategory, 
    deleteCategory,
    products
  } = useCategoryDetail(categoryId);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = () => {
    navigation.navigate("AddCategory", { categoryId });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? Products in this category will become uncategorized.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteCategory();
            if (result.success) {
              Alert.alert("Success", "Category deleted successfully");
              navigation.goBack();
            } else {
              Alert.alert("Error", result.error || "Failed to delete category");
            }
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Category: ${category?.name}\nDescription: ${category?.description}\nProducts: ${category?.productCount || 0}`,
        title: category?.name,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleViewProduct = (product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Custom Header for Loading State */}
          <View className={`px-4 py-3 flex-row items-center border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
            </TouchableOpacity>
            <Text className={`flex-1 text-center text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Category Details
            </Text>
            <View className="w-10" />
          </View>
          <Loading text="Loading category..." />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !category) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Custom Header for Error State */}
          <View className={`px-4 py-3 flex-row items-center border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
            </TouchableOpacity>
            <Text className={`flex-1 text-center text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Category Details
            </Text>
            <View className="w-10" />
          </View>
          <ErrorState
            title="Category Not Found"
            description="The category you're looking for doesn't exist."
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SafeAreaView className="flex-1 pb-16" edges={["top", "left", "right"]}>
        {/* Custom Header with Back, Share, and Edit Buttons */}
        <View className={`px-4 py-3 flex-row items-center border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Icon 
              name="arrow-left" 
              size={24} 
              color={isDarkMode ? '#FFFFFF' : '#1F2937'} 
            />
          </TouchableOpacity>

          {/* Title */}
          <Text className={`flex-1 text-center text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Category Details
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-2">
            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon 
                name="share-variant" 
                size={22} 
                color={isDarkMode ? '#FFFFFF' : '#1F2937'} 
              />
            </TouchableOpacity>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={handleEdit}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}
            >
              <Icon 
                name="pencil" 
                size={22} 
                color="#3b82f6" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Category Header with Gradient */}
          <LinearGradient
            colors={category.colors || ["#3b82f6", "#2563eb"]}
            className="rounded-2xl p-6 mt-4 mb-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="items-center">
              <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mb-4">
                <Icon 
                  name={category.icon || "shape"} 
                  size={40} 
                  color="#ffffff" 
                />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                {category.name}
              </Text>
              <View className="flex-row items-center">
                <View className="bg-white/20 px-3 py-1 rounded-full mr-2">
                  <Text className="text-white text-sm">
                    {category.productCount || 0} Products
                  </Text>
                </View>
                {category.is_active && (
                  <View className="bg-green-500/20 px-3 py-1 rounded-full">
                    <Text className="text-green-300 text-sm">Active</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>

          {/* Tabs */}
          <View className={`flex-row rounded-2xl p-1 mb-4 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {["details", "products", "stats"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === tab ? "bg-blue-500" : ""
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    activeTab === tab 
                      ? "text-white" 
                      : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "details" && (
            <>
              {/* Description */}
              {category.description && (
                <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <Text className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Description
                  </Text>
                  <Text className={`leading-6 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </Text>
                </View>
              )}

              {/* Category Details Grid */}
              <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Text className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Category Information
                </Text>

                <View className="flex-row flex-wrap">
                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Category ID
                    </Text>
                    <Text className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      #{category.id}
                    </Text>
                  </View>

                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Status
                    </Text>
                    <View className="flex-row items-center">
                      <View className={`w-2 h-2 rounded-full mr-1 ${
                        category.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <Text className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Created By
                    </Text>
                    <Text className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.created_by || "Admin"}
                    </Text>
                  </View>

                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Created At
                    </Text>
                    <Text className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {new Date(category.created_at).toLocaleDateString()}
                    </Text>
                  </View>

                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Last Updated
                    </Text>
                    <Text className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {new Date(category.updated_at).toLocaleDateString()}
                    </Text>
                  </View>

                  <View className="w-1/2 mb-4">
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Product Count
                    </Text>
                    <Text className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.productCount || 0}
                    </Text>
                  </View>
                </View>

                {/* Category Meta */}
                {(category.meta_title || category.meta_description) && (
                  <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Text className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      SEO Information
                    </Text>
                    {category.meta_title && (
                      <Text className={`text-xs mb-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Meta Title: {category.meta_title}
                      </Text>
                    )}
                    {category.meta_description && (
                      <Text className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Meta Description: {category.meta_description}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </>
          )}

          {activeTab === "products" && (
            <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <View className="flex-row justify-between items-center mb-4">
                <Text className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Products in this Category
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Products", { categoryId: category.id })}
                  className="bg-blue-500 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              {products && products.length > 0 ? (
                products.slice(0, 5).map((product, index) => (
                  <TouchableOpacity
                    key={product.id}
                    onPress={() => handleViewProduct(product)}
                    className={`flex-row items-center p-3 ${
                      index < products.length - 1 ? 'border-b' : ''
                    } ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
                  >
                    <View className={`w-12 h-12 rounded-lg overflow-hidden ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {product.image ? (
                        <Image
                          source={{ uri: product.image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full items-center justify-center">
                          <Icon name="package-variant" size={20} color="#9ca3af" />
                        </View>
                      )}
                    </View>

                    <View className="flex-1 ml-3">
                      <Text className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {product.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          SKU: {product.sku}
                        </Text>
                        <Text className={`text-xs mx-2 ${
                          isDarkMode ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          •
                        </Text>
                        <Text className={`text-xs font-semibold ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          ${product.price}
                        </Text>
                      </View>
                    </View>

                    <View className={`px-2 py-1 rounded-full ${
                      product.stock > 0
                        ? isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                        : isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        product.stock > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {product.stock} in stock
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center justify-center py-8">
                  <Icon name="package-variant" size={48} color="#9ca3af" />
                  <Text className={`text-center mt-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No products in this category
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AddProduct", { categoryId: category.id })}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white font-medium">Add Product</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {activeTab === "stats" && (
            <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Text className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Category Statistics
              </Text>

              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-4 pr-2">
                  <View className={`rounded-xl p-4 ${
                    isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <Icon name="package-variant" size={24} color="#3b82f6" />
                    <Text className={`text-2xl font-bold mt-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.productCount || 0}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Total Products
                    </Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pl-2">
                  <View className={`rounded-xl p-4 ${
                    isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
                  }`}>
                    <Icon name="currency-usd" size={24} color="#10b981" />
                    <Text className={`text-2xl font-bold mt-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      ${(category.totalValue || 0).toLocaleString()}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Total Value
                    </Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pr-2">
                  <View className={`rounded-xl p-4 ${
                    isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <Icon name="star" size={24} color="#8b5cf6" />
                    <Text className={`text-2xl font-bold mt-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.avgRating || "4.5"}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Avg. Rating
                    </Text>
                  </View>
                </View>

                <View className="w-1/2 mb-4 pl-2">
                  <View className={`rounded-xl p-4 ${
                    isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'
                  }`}>
                    <Icon name="trending-up" size={24} color="#f97316" />
                    <Text className={`text-2xl font-bold mt-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.growth || "+12%"}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Growth Rate
                    </Text>
                  </View>
                </View>
              </View>

              {/* Additional Stats */}
              <View className="mt-2">
                <View className={`flex-row justify-between py-3 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Best Selling Product
                  </Text>
                  <Text className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {category.bestSeller || "Classic T-Shirt"}
                  </Text>
                </View>

                <View className={`flex-row justify-between py-3 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Top Brand
                  </Text>
                  <Text className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {category.topBrand || "Nike"}
                  </Text>
                </View>

                <View className="flex-row justify-between py-3">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Monthly Revenue
                  </Text>
                  <Text className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    ${(category.monthlyRevenue || 12500).toLocaleString()}
                  </Text>
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
      </SafeAreaView>
    </View>
  );
};

export default CategoryDetailScreen;