// screens/inventory/InventoryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/common/Header';
import StockList from '../../components/inventory/StockList';

const { width } = Dimensions.get('window');

// Static inventory stats
const inventoryStats = {
  totalProducts: 342,
  totalValue: 125890,
  lowStock: 23,
  outOfStock: 8,
  categories: 12,
};

// Navigation items for sidebar
const navigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "view-dashboard-outline",
    iconActive: "view-dashboard",
    screen: "Dashboard",
    badge: null,
  },
  {
    id: "products",
    title: "Products",
    icon: "package-variant-closed",
    iconActive: "package-variant",
    screen: "ProductsStack",
    badge: "156",
  },
  {
    id: "orders",
    title: "Orders",
    icon: "clipboard-list-outline",
    iconActive: "clipboard-list",
    screen: "OrdersStack",
    badge: "12",
  },
  {
    id: "customers",
    title: "Customers",
    icon: "account-group-outline",
    iconActive: "account-group",
    screen: "CustomersStack",
    badge: "892",
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: "warehouse-outline",
    iconActive: "warehouse",
    screen: "InventoryStack",
    badge: "Low Stock",
  },
  {
    id: "settings",
    title: "Settings",
    icon: "cog-outline",
    iconActive: "cog",
    screen: "SettingsStack",
    badge: null,
  },
];

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    lowStock: false,
    outOfStock: false,
    category: 'all',
    sortBy: 'name',
  });

  const handleStockMovement = () => {
    navigation.navigate('StockMovement');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const StatsCard = ({ title, value, icon, gradient, subtitle }) => (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 m-1 p-4 rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        minWidth: width * 0.3,
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
          <Icon name={icon} size={22} color="white" />
        </View>
      </View>
      <Text className="text-white/80 text-xs font-medium">{title}</Text>
      <Text className="text-2xl font-bold text-white mt-1">{value}</Text>
      {subtitle && <Text className="text-white/60 text-xs mt-1">{subtitle}</Text>}
    </LinearGradient>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Header
        title="Inventory"
        backgroundColor="bg-white"
        textColor="text-gray-800"
        userName="John Doe"
        userEmail="john.doe@example.com"
        activeScreen="Inventory"
        navigationItems={navigationItems}
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={toggleViewMode}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-2"
            >
              <Icon
                name={viewMode === "grid" ? "view-list" : "view-grid"}
                size={22}
                color="#4b5563"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleStockMovement}
              className="w-10 h-10 bg-indigo-500 rounded-full items-center justify-center shadow-md shadow-indigo-500/30"
            >
              <Icon name="swap-horizontal" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Stats Cards */}
      <View className="px-4 mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            <StatsCard
              title="Total Products"
              value={inventoryStats.totalProducts}
              icon="package-variant"
              gradient={["#6366F1", "#8B5CF6"]}
              subtitle="In catalog"
            />
            <StatsCard
              title="Total Value"
              value={formatCurrency(inventoryStats.totalValue)}
              icon="currency-usd"
              gradient={["#10B981", "#059669"]}
              subtitle="Current stock"
            />
            <StatsCard
              title="Low Stock"
              value={inventoryStats.lowStock}
              icon="alert"
              gradient={["#F59E0B", "#D97706"]}
              subtitle="Need reorder"
            />
            <StatsCard
              title="Out of Stock"
              value={inventoryStats.outOfStock}
              icon="close-circle"
              gradient={["#EF4444", "#DC2626"]}
              subtitle="Critical"
            />
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <BlurView
          intensity={80}
          tint="light"
          className="overflow-hidden rounded-3xl shadow-md"
          style={{
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <View className="flex-row items-center px-4 py-1 bg-white/70">
            <Icon name="magnify" size={22} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-800"
              placeholder="Search products, SKU, location..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>

      {/* Filter Chips */}
      <View className="px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))}
              className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                filters.lowStock
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white border-gray-200"
              } shadow-sm`}
            >
              <Icon
                name="alert"
                size={18}
                color={filters.lowStock ? "#ffffff" : "#F59E0B"}
              />
              <Text
                className={`ml-2 font-medium ${
                  filters.lowStock ? "text-white" : "text-gray-700"
                }`}
              >
                Low Stock
              </Text>
              <View
                className={`ml-2 px-2 py-0.5 rounded-full ${
                  filters.lowStock ? "bg-white/20" : "bg-orange-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    filters.lowStock ? "text-white" : "text-orange-600"
                  }`}
                >
                  {inventoryStats.lowStock}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, outOfStock: !prev.outOfStock }))}
              className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                filters.outOfStock
                  ? "bg-red-500 border-red-500"
                  : "bg-white border-gray-200"
              } shadow-sm`}
            >
              <Icon
                name="close-circle"
                size={18}
                color={filters.outOfStock ? "#ffffff" : "#EF4444"}
              />
              <Text
                className={`ml-2 font-medium ${
                  filters.outOfStock ? "text-white" : "text-gray-700"
                }`}
              >
                Out of Stock
              </Text>
              <View
                className={`ml-2 px-2 py-0.5 rounded-full ${
                  filters.outOfStock ? "bg-white/20" : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    filters.outOfStock ? "text-white" : "text-red-600"
                  }`}
                >
                  {inventoryStats.outOfStock}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Stock List */}
      <View className="flex-1 px-4">
        <StockList
          viewMode={viewMode}
          searchQuery={searchQuery}
          filters={filters}
        />
      </View>
    </View>
  );
};

export default InventoryScreen;