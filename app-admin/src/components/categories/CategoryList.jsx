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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import CategoryCard from "./CategoryCard";

// Static category data
const STATIC_CATEGORIES = [
  {
    id: "1",
    name: "Apparel",
    description: "Clothing, fashion wear, and accessories for all ages",
    icon: "tshirt-crew",
    colors: ["#3b82f6", "#2563eb"],
    productCount: 78,
    totalValue: 45600,
    is_active: true,
    isFavorite: false,
    created_at: "2024-01-15T10:30:00Z",
    slug: "apparel",
  },
  {
    id: "2",
    name: "Footwear",
    description: "Shoes, sneakers, boots, and sandals",
    icon: "shoe-sneaker",
    colors: ["#ec4899", "#db2777"],
    productCount: 45,
    totalValue: 23400,
    is_active: true,
    isFavorite: true,
    created_at: "2024-01-10T14:20:00Z",
    slug: "footwear",
  },
  {
    id: "3",
    name: "Accessories",
    description: "Watches, jewelry, bags, and fashion accessories",
    icon: "watch",
    colors: ["#8b5cf6", "#7c3aed"],
    productCount: 23,
    totalValue: 18900,
    is_active: true,
    isFavorite: false,
    created_at: "2024-01-20T09:15:00Z",
    slug: "accessories",
  },
  {
    id: "4",
    name: "Outerwear",
    description: "Jackets, coats, and winter wear",
    icon: "jacket",
    colors: ["#f97316", "#ea580c"],
    productCount: 10,
    totalValue: 8900,
    is_active: true,
    isFavorite: false,
    created_at: "2024-01-18T16:45:00Z",
    slug: "outerwear",
  },
  {
    id: "5",
    name: "Knitwear",
    description: "Sweaters, cardigans, and knitted garments",
    icon: "knitting",
    colors: ["#10b981", "#059669"],
    productCount: 15,
    totalValue: 12300,
    is_active: true,
    isFavorite: true,
    created_at: "2024-01-22T11:30:00Z",
    slug: "knitwear",
  },
  {
    id: "6",
    name: "Electronics",
    description: "Gadgets, devices, and electronic accessories",
    icon: "laptop",
    colors: ["#ef4444", "#dc2626"],
    productCount: 0,
    totalValue: 0,
    is_active: false,
    isFavorite: false,
    created_at: "2024-01-19T13:20:00Z",
    slug: "electronics",
  },
];

const CategoryList = ({
  viewMode = "grid",
  searchQuery = "",
  sortBy = "name",
}) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter and sort categories based on props
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Search filter
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

  // Statistics
  const stats = useMemo(() => {
    const activeCount = categories.filter(c => c.is_active).length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    const emptyCategories = categories.filter(c => c.productCount === 0).length;
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

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleToggleFavorite = (categoryId) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, isFavorite: !c.isFavorite } : c,
      ),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setCategories(STATIC_CATEGORIES);
      setRefreshing(false);
    }, 1000);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading categories...
        </Text>
      </View>
    );
  }

  if (!filteredCategories || filteredCategories.length === 0) {
    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
            onRefresh={onRefresh}
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