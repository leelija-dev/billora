// Updated CategoryList component
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Add this import if missing
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import CategoryCard from "./CategoryCard";

const CategoryList = ({
  viewMode = "grid",
  searchQuery = "",
  sortBy = "name",
  categories = [], // New prop for real categories
  onRefresh = () => {}, // New prop for refresh callback
}) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter and sort categories based on props (using prop categories)
  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    let filtered = [...categories];
    // Search filter (client-side refinement on server results)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.slug?.toLowerCase().includes(query),
      );
    }
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return (b.productCount || 0) - (a.productCount || 0);
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'value':
          return (b.totalValue || 0) - (a.totalValue || 0);
        default:
          return 0;
      }
    });
    return filtered;
  }, [categories, searchQuery, sortBy]);

  // Statistics (using prop categories)
  const stats = useMemo(() => {
    if (!Array.isArray(categories)) return {
      total: 0,
      active: 0,
      totalProducts: 0,
      empty: 0,
      totalValue: 0,
    };
    const activeCount = categories.filter(c => c.is_active).length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    const emptyCategories = categories.filter(c => (c.productCount || 0) === 0).length;
    const totalValue = categories.reduce((sum, c) => sum + (c.totalValue || 0), 0);
    return {
      total: categories.length,
      active: activeCount,
      totalProducts,
      empty: emptyCategories,
      totalValue,
    };
  }, [categories]);

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryDetail", { categoryId: category.id });
  };

  const handleEditCategory = (category) => {
    navigation.navigate("AddCategory", { categoryId: category.id });
  };

  // Local handlers (can be extended with props for real API calls)
  const handleDeleteCategory = (categoryId) => {
    // For now, local filter; extend with prop onDelete for real delete
    // setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleToggleFavorite = (categoryId) => {
    // Local toggle; extend if needed
    // setCategories((prev) =>
    //   prev.map((c) =>
    //     c.id === categoryId ? { ...c, isFavorite: !c.isFavorite } : c,
    //   ),
    // );
  };

  const onRefreshLocal = () => {
    setRefreshing(true);
    onRefresh(); // Call parent refresh (from hook)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // UX delay
  };

  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, marginBottom: 16 }}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1 ? "category" : "categories"} found
        </Text>
        <View className={`flex-row items-center px-3 py-1.5 rounded-full shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="shape" size={16} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          <Text className={`text-sm ml-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {stats.active} active
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderGridItem = (item) => (
    <View key={item.id} className="w-[48%] mx-[1%] mb-3">
      <CategoryCard category={item} onUpdate={handleToggleFavorite} />
    </View>
  );

  const renderListItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleCategoryPress(item)}
      className={`flex-row rounded-xl mb-3 p-3 shadow-sm ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {/* Icon with Gradient */}
      <LinearGradient
        colors={item.colors || ["#3b82f6", "#2563eb"]}
        className="w-16 h-16 rounded-xl items-center justify-center"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={item.icon || "shape"} size={28} color="#ffffff" />
      </LinearGradient>
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
            <Icon
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={item.isFavorite ? "#ef4444" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <Icon name="package-variant" size={14} color="#9ca3af" />
            <Text className={`text-xs ml-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {item.productCount || 0} products
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-1 ${
                item.is_active ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {item.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <Text className={`text-xs font-semibold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            ${(item.totalValue || 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < filteredCategories.length; i += 2) {
      const rowItems = filteredCategories.slice(i, i + 2);
      rows.push(
        <View key={`row-${i}`} className="flex-row justify-between mb-2">
          {rowItems.map(item => renderGridItem(item))}
        </View>
      );
    }
    return rows;
  };

  // Removed local loading state as parent handles it

  if (!filteredCategories || filteredCategories.length === 0) {
    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshLocal}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="px-4">
          {renderHeader()}
          <View className="items-center justify-center py-16">
            <Icon name="shape" size={80} color="#d1d5db" />
            <Text className={`text-lg font-semibold mt-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No Categories Found
            </Text>
            <Text className={`text-sm text-center mt-2 px-8 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {searchQuery
                ? "Try adjusting your search"
                : "Tap the + button to add your first category"}
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
            onRefresh={onRefreshLocal}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="pb-4">
          {viewMode === "grid"
            ? renderGridItems()
            : filteredCategories.map(item => renderListItem(item))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryList;