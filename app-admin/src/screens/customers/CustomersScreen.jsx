// screens/customers/CustomersScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/common/Header';
import CustomerList from '../../components/customers/CustomerList';
import FilterModal from '../../components/customers/FilterModal';

const { width } = Dimensions.get('window');

// Static customer stats
const customerStats = {
  total: 892,
  active: 723,
  inactive: 169,
  newThisMonth: 45,
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
    badge: "892",
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

const CustomersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest',
    minOrders: '',
    minSpent: '',
    dateRange: 'all',
    hasPhone: false,
    hasEmail: true,
  });

  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
    // Update status filter when chip is pressed
    setFilters(prev => ({ ...prev, status: filter }));
  };

  const handleOpenFilter = () => {
    setFilterVisible(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      sortBy: 'newest',
      minOrders: '',
      minSpent: '',
      dateRange: 'all',
      hasPhone: false,
      hasEmail: true,
    });
    setSelectedFilter('all');
    setSearchQuery('');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const filterChips = [
    { id: 'all', label: 'All', icon: 'account-group', count: customerStats.total },
    { id: 'active', label: 'Active', icon: 'check-circle', count: customerStats.active, color: '#10B981' },
    { id: 'inactive', label: 'Inactive', icon: 'close-circle', count: customerStats.inactive, color: '#EF4444' },
    { id: 'new', label: 'New', icon: 'account-plus', count: customerStats.newThisMonth, color: '#6366F1' },
  ];

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'status') return value !== 'all';
    if (key === 'sortBy') return value !== 'newest';
    if (key === 'dateRange') return value !== 'all';
    if (key === 'minOrders') return value !== '';
    if (key === 'minSpent') return value !== '';
    if (key === 'hasPhone') return value === true;
    if (key === 'hasEmail') return value === false;
    return false;
  }).length;

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
        title="Customers"
        backgroundColor="bg-white"
        textColor="text-gray-800"
        userName="John Doe"
        userEmail="john.doe@example.com"
        activeScreen="Customers"
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
              onPress={handleAddCustomer}
              className="w-10 h-10 bg-indigo-500 rounded-full items-center justify-center shadow-md shadow-indigo-500/30"
            >
              <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Stats Cards */}
      <View className="px-4 mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            <StatsCard
              title="Total Customers"
              value={customerStats.total}
              icon="account-group"
              gradient={["#6366F1", "#8B5CF6"]}
              subtitle="All time"
            />
            <StatsCard
              title="Active"
              value={customerStats.active}
              icon="check-circle"
              gradient={["#10B981", "#059669"]}
              subtitle={`${Math.round((customerStats.active / customerStats.total) * 100)}%`}
            />
            <StatsCard
              title="Inactive"
              value={customerStats.inactive}
              icon="close-circle"
              gradient={["#EF4444", "#DC2626"]}
              subtitle="Need attention"
            />
            <StatsCard
              title="New"
              value={customerStats.newThisMonth}
              icon="account-plus"
              gradient={["#F59E0B", "#D97706"]}
              subtitle="This month"
            />
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100">
          <Icon name="magnify" size={22} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search customers by name, email, phone..."
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
            onPress={handleOpenFilter}
            className="ml-2 p-2 border-l border-gray-200 relative"
          >
            <Icon name="tune" size={22} color="#4b5563" />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-indigo-500 rounded-full min-w-[18px] h-[18px] justify-center items-center border-2 border-white">
                <Text className="text-white text-[10px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <View className="px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {filterChips.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => handleFilterPress(filter.id)}
                className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                  selectedFilter === filter.id
                    ? "bg-indigo-500 border-indigo-500"
                    : "bg-white border-gray-200"
                } shadow-sm`}
              >
                <Icon
                  name={filter.icon}
                  size={18}
                  color={selectedFilter === filter.id ? "#ffffff" : filter.color || "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedFilter === filter.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {filter.label}
                </Text>
                <View
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    selectedFilter === filter.id ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      selectedFilter === filter.id ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={handleClearFilters}
                className="flex-row items-center px-4 py-2.5 rounded-full border border-red-200 bg-red-50"
              >
                <Icon name="close" size={18} color="#EF4444" />
                <Text className="ml-2 font-medium text-red-600">Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Customer List with filters */}
      <View className="flex-1 px-4">
        <CustomerList
          viewMode={viewMode}
          searchQuery={searchQuery}
          filters={filters}
        />
      </View>
    </View>
  );
};

export default CustomersScreen;