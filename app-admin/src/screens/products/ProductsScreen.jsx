// screens/products/ProductsScreen.js
import { useNavigation } from "@react-navigation/native";
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
import ProductFilters from "../../components/products/ProductFilters";
import ProductList from "../../components/products/ProductList";

// Category chips data
const categories = [
  {
    id: "all",
    name: "All Products",
    icon: "package-variant",
    count: 156,
    color: "#3b82f6",
  },
  {
    id: "apparel",
    name: "Apparel",
    icon: "tshirt-crew",
    count: 78,
    color: "#ec4899",
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: "shoe-sneaker",
    count: 45,
    color: "#8b5cf6",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "watch",
    count: 23,
    color: "#f97316",
  },
  {
    id: "outerwear",
    name: "Outerwear",
    icon: "jacket",
    count: 10,
    color: "#10b981",
  },
];

const ProductsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const handleAddProduct = () => {
    navigation.navigate("AddProduct");
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

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

      <Header
        title="Products"
        userName="John Doe"
        userEmail="john@example.com"
        activeScreen="Products"
        navigationItems={navigationItems}
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={toggleViewMode}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon
                name={viewMode === "grid" ? "view-grid" : "view-list"}
                size={22}
                color={isDarkMode ? "#9CA3AF" : "#4b5563"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddProduct}
              className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center shadow-md shadow-blue-500/30"
            >
              <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className={`flex-row items-center rounded-2xl px-4 h-14 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="magnify" size={22} color="#9ca3af" />
          <TextInput
            className={`flex-1 ml-3 text-base ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            placeholder="Search products, SKU, category..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleFilterPress}
            className={`ml-2 p-2 border-l ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <Icon name="tune" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories Scroll */}
        <View className="py-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategorySelect(category.id)}
                className={`flex-row items-center mr-3 px-4 py-2.5 rounded-full border ${
                  selectedCategory === category.id
                    ? "bg-blue-500 border-blue-500"
                    : isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-white'
                } shadow-sm`}
              >
                <Icon
                  name={category.icon}
                  size={18}
                  color={
                    selectedCategory === category.id 
                      ? "#ffffff" 
                      : isDarkMode ? '#9CA3AF' : category.color
                  }
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedCategory === category.id
                      ? "text-white"
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </Text>
                <View
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      selectedCategory === category.id
                        ? "text-white"
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between px-4 py-3">
          <View className={`rounded-xl p-3 flex-1 mr-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Products
            </Text>
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              156
            </Text>
          </View>
          <View className={`rounded-xl p-3 flex-1 mx-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Low Stock
            </Text>
            <Text className="text-2xl font-bold text-orange-500">12</Text>
          </View>
          <View className={`rounded-xl p-3 flex-1 ml-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Out of Stock
            </Text>
            <Text className="text-2xl font-bold text-red-500">5</Text>
          </View>
        </View>

        {/* Product List */}
        <View className="flex-1 px-4">
          <ProductList
            viewMode={viewMode}
            searchQuery={searchQuery}
            category={selectedCategory}
          />
        </View>
      </ScrollView>

      {/* Filters Modal */}
      <ProductFilters 
        visible={showFilters} 
        onClose={handleFiltersClose}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default ProductsScreen;