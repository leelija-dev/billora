// Updated CategoriesScreen component
import { useNavigation } from "@react-navigation/native";
import { useState, useMemo } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useCategories } from "../../hooks/useCategories";
import Header from "../../components/common/Header";
import CategoryFilters from "../../components/categories/CategoryFilters";
import CategoryList from "../../components/categories/CategoryList";

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const {
    categories = [],
    loading,
    error,
    refreshCategories,
    searchCategories,
    deleteCategory, // From hook
  } = useCategories() || {};

 

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  // Calculate dynamic stats from real categories
  const totalCategories = categories?.length || 0;
  const activeCategories = useMemo(() => 
    Array.isArray(categories) ? categories.filter(cat => cat.is_active).length : 0, [categories]
  );
  const emptyCategories = useMemo(() => 
    Array.isArray(categories) ? categories.filter(cat => (cat.productCount || 0) === 0).length : 0, [categories]
  );
  const totalProducts = useMemo(() => 
    Array.isArray(categories) ? categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0) : 0, [categories]
  );

  const handleAddCategory = () => {
    navigation.navigate("AddCategory");
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchCategories(query);
    } else {
      refreshCategories();
    }
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
      id: "categories",
      title: "Categories",
      icon: "shape",
      screen: "Categories",
      badge: totalCategories.toString(), // Dynamic badge
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

  // Show loading state
  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading categories...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />
      <Header
        title="Categories"
        userName={user?.name || "User"}
        userEmail={user?.email || "guest@example.com"}
        activeScreen="Categories"
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
              onPress={handleAddCategory}
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
            placeholder="Search categories..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
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
        {/* Stats Cards - Using dynamic calculations */}
        <View className="flex-row flex-wrap px-4 py-3">
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            className="rounded-xl p-4 flex-1 mr-2"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className="text-white/80 text-xs">Total Categories</Text>
            <Text className="text-white text-2xl font-bold">{totalCategories}</Text>
            <View className="flex-row items-center mt-1">
              <Icon name="arrow-up" size={16} color="#86efac" />
              <Text className="text-white/80 text-xs ml-1">+12% from last month</Text>
            </View>
          </LinearGradient>
          <View className={`rounded-xl p-4 flex-1 ml-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Active Categories
            </Text>
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {activeCategories}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {totalCategories > 0 ? ((activeCategories / totalCategories) * 100).toFixed(0) : 0}% active
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row px-4 mb-4">
          <View className={`rounded-xl p-3 flex-1 mr-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row items-center">
              <Icon name="package-variant" size={20} color="#3b82f6" />
              <Text className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Products
              </Text>
            </View>
            <Text className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {totalProducts}
            </Text>
          </View>
          <View className={`rounded-xl p-3 flex-1 ml-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row items-center">
              <Icon name="alert-circle" size={20} color="#f97316" />
              <Text className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Empty Categories
              </Text>
            </View>
            <Text className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {emptyCategories}
            </Text>
          </View>
        </View>
        {/* Quick Actions */}
        <View className="flex-row px-4 mb-4">
          <TouchableOpacity
            onPress={() => setSortBy('name')}
            className={`flex-row items-center mr-3 px-4 py-2 rounded-full border ${
              sortBy === 'name'
                ? "bg-blue-500 border-blue-500"
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
            }`}
          >
            <Icon
              name="sort-alphabetical"
              size={16}
              color={sortBy === 'name' ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
            />
            <Text
              className={`ml-2 text-sm ${
                sortBy === 'name'
                  ? "text-white"
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('products')}
            className={`flex-row items-center mr-3 px-4 py-2 rounded-full border ${
              sortBy === 'products'
                ? "bg-blue-500 border-blue-500"
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
            }`}
          >
            <Icon
              name="package-variant"
              size={16}
              color={sortBy === 'products' ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
            />
            <Text
              className={`ml-2 text-sm ${
                sortBy === 'products'
                  ? "text-white"
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Product Count
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('date')}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              sortBy === 'date'
                ? "bg-blue-500 border-blue-500"
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
            }`}
          >
            <Icon
              name="calendar"
              size={16}
              color={sortBy === 'date' ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
            />
            <Text
              className={`ml-2 text-sm ${
                sortBy === 'date'
                  ? "text-white"
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Latest
            </Text>
          </TouchableOpacity>
        </View>
        {/* Category List - Pass real categories and refresh */}
        <View className="flex-1 px-4">
          <CategoryList
            categories={categories} // Pass real data
            viewMode={viewMode}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onRefresh={refreshCategories} // Pass hook refresh
            onDelete={deleteCategory} // Optional: pass for delete integration
          />
        </View>
      </ScrollView>
      {/* Filters Modal */}
      <CategoryFilters
        visible={showFilters}
        onClose={handleFiltersClose}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default CategoriesScreen;