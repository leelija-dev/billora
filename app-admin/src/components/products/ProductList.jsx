// components/products/ProductList.js
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import ProductCard from "./ProductCard";

// Static product data (keep your existing STATIC_PRODUCTS array here)
const STATIC_PRODUCTS = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    sku: "TS-001-WHT",
    price: 29.99,
    cost: 18.5,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    stock: 45,
    category: "Apparel",
    supplier: "Fashion Corp",
    rating: 4.5,
    reviews: 128,
    discount: 40,
    isNew: false,
    isFavorite: false,
    location: "Warehouse A - R12",
    reorderLevel: 20,
    lastUpdated: "2024-01-15T10:30:00Z",
    brand: "Fashionista",
  },
  {
    id: "2",
    name: "Slim Fit Jeans - Dark Blue",
    sku: "JN-002-BLU",
    price: 79.99,
    cost: 45.0,
    originalPrice: 0,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    stock: 15,
    category: "Apparel",
    supplier: "Denim Co",
    rating: 4.2,
    reviews: 89,
    discount: 0,
    isNew: true,
    isFavorite: true,
    location: "Warehouse A - R08",
    reorderLevel: 25,
    lastUpdated: "2024-01-20T14:20:00Z",
    brand: "DenimCo",
  },
  {
    id: "3",
    name: "Leather Sneakers - White",
    sku: "SN-003-WHT",
    price: 89.99,
    cost: 52.0,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    stock: 8,
    category: "Footwear",
    supplier: "Sporty Feet",
    rating: 4.8,
    reviews: 256,
    discount: 30,
    isNew: false,
    isFavorite: false,
    location: "Warehouse B - F03",
    reorderLevel: 15,
    lastUpdated: "2024-01-18T09:15:00Z",
    brand: "SportMax",
  },
  {
    id: "4",
    name: "Wool Blend Overcoat - Camel",
    sku: "OC-004-CML",
    price: 199.99,
    cost: 120.0,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
    stock: 5,
    category: "Outerwear",
    supplier: "Luxury Wear",
    rating: 4.6,
    reviews: 67,
    discount: 33,
    isNew: false,
    isFavorite: false,
    location: "Warehouse C - H02",
    reorderLevel: 10,
    lastUpdated: "2024-01-10T16:45:00Z",
    brand: "LuxeStyle",
  },
  {
    id: "5",
    name: "Cashmere Sweater - Gray",
    sku: "SW-005-GRY",
    price: 129.99,
    cost: 75.0,
    originalPrice: 189.99,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
    stock: 12,
    category: "Knitwear",
    supplier: "Soft Touch",
    rating: 4.7,
    reviews: 145,
    discount: 31,
    isNew: true,
    isFavorite: true,
    location: "Warehouse A - R15",
    reorderLevel: 8,
    lastUpdated: "2024-01-22T11:30:00Z",
    brand: "CashmereCo",
  },
  {
    id: "6",
    name: "Sports Watch - Black",
    sku: "WT-006-BLK",
    price: 149.99,
    cost: 89.0,
    originalPrice: 0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 0,
    category: "Accessories",
    supplier: "TechTime",
    rating: 4.4,
    reviews: 203,
    discount: 0,
    isNew: false,
    isFavorite: false,
    location: "Warehouse B - E10",
    reorderLevel: 5,
    lastUpdated: "2024-01-19T13:20:00Z",
    brand: "TechGear",
  },
];

const ProductList = ({
  viewMode = "grid",
  searchQuery = "",
  category = "all",
}) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter and sort products based on props
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.supplier.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [products, category, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(
      (p) => p.stock <= p.reorderLevel && p.stock > 0,
    ).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return {
      total: products.length,
      totalStock,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      totalValue,
    };
  }, [products]);

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handleEditProduct = (product) => {
    navigation.navigate("AddProduct", { productId: product.id });
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
    );
  };

  const handleToggleFavorite = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setProducts(STATIC_PRODUCTS);
      setRefreshing(false);
    }, 1000);
  };

  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, marginBottom: 16 }}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </Text>
        <View className={`flex-row items-center px-3 py-1.5 rounded-full shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="package-variant" size={16} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          <Text className={`text-sm ml-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {stats.total} total
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderGridItem = (item) => (
    <View key={item.id} className="w-[48%] mx-[1%] mb-3">
      <ProductCard product={item} onUpdateStock={handleUpdateStock} />
    </View>
  );

  const renderListItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleProductPress(item)}
      className={`flex-row rounded-xl mb-3 p-3 shadow-sm ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {item.sku}
            </Text>
            <Text
              className={`text-base font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              numberOfLines={1}
            >
              {item.name}
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

        <View className="flex-row items-center mt-1">
          <Icon name="tag" size={12} color="#9ca3af" />
          <Text className={`text-xs ml-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {item.category}
          </Text>
          <Text className={`text-xs mx-2 ${
            isDarkMode ? 'text-gray-700' : 'text-gray-300'
          }`}>
            •
          </Text>
          <Icon name="factory" size={12} color="#9ca3af" />
          <Text className={`text-xs ml-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {item.supplier}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <View>
            <Text className="text-lg font-bold text-blue-600">
              ${item.price.toFixed(2)}
            </Text>
            {item.originalPrice > 0 && (
              <Text className={`text-xs line-through ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                ${item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View className="flex-row items-center">
            <View
              className={`px-2 py-1 rounded-full ${
                item.stock === 0
                  ? isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                  : item.stock <= item.reorderLevel
                    ? isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'
                    : isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  item.stock === 0
                    ? "text-red-600"
                    : item.stock <= item.reorderLevel
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              >
                {item.stock} in stock
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const rowItems = filteredProducts.slice(i, i + 2);
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
          Loading products...
        </Text>
      </View>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
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
            <Icon name="package-variant" size={80} color="#d1d5db" />
            <Text className={`text-lg font-semibold mt-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No Products Found
            </Text>
            <Text className={`text-sm text-center mt-2 px-8 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {searchQuery || category !== "all"
                ? "Try adjusting your search or filters"
                : "Tap the + button to add your first product"}
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
            : filteredProducts.map(item => renderListItem(item))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductList;