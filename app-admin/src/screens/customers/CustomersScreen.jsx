// screens/customers/CustomersScreen.js
import React, { useState, useEffect } from 'react';
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
import { useThemeStore } from '../../store/themeStore';
import Header from '../../components/common/Header';
import CustomerList from '../../components/customers/CustomerList';
import FilterModal from '../../components/customers/FilterModal';

const { width } = Dimensions.get('window');

// Static customer stats based on actual data
const STATIC_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Smith Enterprises",
    status: "active",
    orderCount: 24,
    totalSpent: 5840.5,
    averageOrderValue: 243.35,
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    notes: "Premium customer, prefers email communication. Has been with us for over 2 years. Frequently orders bulk items for his business.",
    createdAt: "2024-01-15T10:30:00Z",
    lastOrder: "2024-03-15T10:30:00Z",
    preferredPayment: "Credit Card",
    taxId: "12-3456789",
    tags: ["premium", "business", "bulk-orders"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-002",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 234-5678",
    company: "Wilson Designs",
    status: "active",
    orderCount: 18,
    totalSpent: 4250.75,
    averageOrderValue: 236.15,
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    notes: "Interested in new collections. Loves seasonal items.",
    createdAt: "2024-01-20T14:20:00Z",
    lastOrder: "2024-03-14T14:20:00Z",
    preferredPayment: "PayPal",
    tags: ["designer", "seasonal"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 345-6789",
    company: "Brown Consulting",
    status: "active",
    orderCount: 12,
    totalSpent: 2890.25,
    averageOrderValue: 240.85,
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    notes: "Corporate account, needs invoices. Monthly orders.",
    createdAt: "2024-02-01T09:15:00Z",
    lastOrder: "2024-03-13T09:15:00Z",
    preferredPayment: "Bank Transfer",
    taxId: "98-7654321",
    tags: ["corporate", "monthly"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-004",
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "+1 (555) 456-7890",
    company: "Davis Law Firm",
    status: "active",
    orderCount: 8,
    totalSpent: 1950.0,
    averageOrderValue: 243.75,
    address: {
      street: "321 Elm Boulevard",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "USA",
    },
    notes: "Prefers phone calls. Legal professional, needs detailed invoices.",
    createdAt: "2024-02-10T16:45:00Z",
    lastOrder: "2024-03-12T16:45:00Z",
    preferredPayment: "Credit Card",
    tags: ["legal", "phone-pref"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-005",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 (555) 567-8901",
    company: "Lee Innovations",
    status: "inactive",
    orderCount: 5,
    totalSpent: 1250.5,
    averageOrderValue: 250.1,
    address: {
      street: "654 Cedar Lane",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "USA",
    },
    notes: "Temporary inactive - on sabbatical. Will return in June.",
    createdAt: "2024-02-15T11:30:00Z",
    lastOrder: "2024-02-28T11:30:00Z",
    preferredPayment: "PayPal",
    tags: ["tech", "inactive"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 678-9012",
    company: "Anderson Art",
    status: "active",
    orderCount: 15,
    totalSpent: 3675.8,
    averageOrderValue: 245.05,
    address: {
      street: "987 Maple Drive",
      city: "Philadelphia",
      state: "PA",
      zip: "19101",
      country: "USA",
    },
    notes: "VIP customer - sends referrals. Art gallery owner.",
    createdAt: "2024-01-05T13:20:00Z",
    lastOrder: "2024-03-10T13:20:00Z",
    preferredPayment: "Credit Card",
    tags: ["vip", "art", "referrals"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-007",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: null,
    company: "Wilson Tech",
    status: "active",
    orderCount: 10,
    totalSpent: 2450.0,
    averageOrderValue: 245.0,
    address: {
      street: "147 Birch Street",
      city: "San Antonio",
      state: "TX",
      zip: "78201",
      country: "USA",
    },
    notes: "New customer - tech startup founder. Interested in bulk discounts.",
    createdAt: "2024-03-01T10:00:00Z",
    lastOrder: "2024-03-11T10:00:00Z",
    preferredPayment: "Bank Transfer",
    tags: ["tech", "startup", "new"],
    hasPhone: false,
    hasEmail: true,
  },
  {
    id: "CUST-008",
    name: "Maria Garcia",
    email: null,
    phone: "+1 (555) 890-1234",
    company: "Garcia Designs",
    status: "inactive",
    orderCount: 3,
    totalSpent: 750.25,
    averageOrderValue: 250.08,
    address: {
      street: "258 Walnut Avenue",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      country: "USA",
    },
    notes: "On vacation until May. Interior designer.",
    createdAt: "2024-02-20T15:30:00Z",
    lastOrder: "2024-02-25T15:30:00Z",
    preferredPayment: "Credit Card",
    tags: ["design", "vacation"],
    hasPhone: true,
    hasEmail: false,
  },
  {
    id: "CUST-009",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 901-2345",
    company: "Taylor Construction",
    status: "active",
    orderCount: 32,
    totalSpent: 8920.0,
    averageOrderValue: 278.75,
    address: {
      street: "369 Spruce Street",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA",
    },
    notes: "Construction company - bulk orders every month.",
    createdAt: "2023-12-10T09:00:00Z",
    lastOrder: "2024-03-09T09:00:00Z",
    preferredPayment: "Bank Transfer",
    taxId: "45-6789012",
    tags: ["construction", "bulk", "monthly"],
    hasPhone: true,
    hasEmail: true,
  },
  {
    id: "CUST-010",
    name: "Jennifer Park",
    email: "jennifer.park@email.com",
    phone: "+1 (555) 012-3456",
    company: "Park Consulting",
    status: "active",
    orderCount: 7,
    totalSpent: 1850.5,
    averageOrderValue: 264.36,
    address: {
      street: "753 Aspen Road",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    notes: "Business consultant - orders for corporate events.",
    createdAt: "2024-02-25T11:45:00Z",
    lastOrder: "2024-03-08T11:45:00Z",
    preferredPayment: "Credit Card",
    tags: ["consulting", "corporate"],
    hasPhone: true,
    hasEmail: true,
  },
];

// Calculate stats from actual data
const calculateStats = () => {
  const total = STATIC_CUSTOMERS.length;
  const active = STATIC_CUSTOMERS.filter(c => c.status === 'active').length;
  const inactive = STATIC_CUSTOMERS.filter(c => c.status === 'inactive').length;
  const newThisMonth = STATIC_CUSTOMERS.filter(c => {
    const created = new Date(c.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return { total, active, inactive, newThisMonth };
};

const customerStats = calculateStats();

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
    badge: customerStats.total.toString(),
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
  const { isDarkMode } = useThemeStore();
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
    // Update selected filter based on status
    if (newFilters.status !== 'all') {
      setSelectedFilter(newFilters.status);
    } else {
      setSelectedFilter('all');
    }
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
    if (key === 'minOrders') return value !== '' && value !== null;
    if (key === 'minSpent') return value !== '' && value !== null;
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
        minWidth: width * 0.4,
        borderRadius: 10,
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
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      <Header
        title="Customers"
        userName="John Doe"
        userEmail="john.doe@example.com"
        activeScreen="Customers"
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
                name={viewMode === "grid" ? "view-list" : "view-grid"}
                size={22}
                color={isDarkMode ? "#9CA3AF" : "#4b5563"}
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
        <View className={`flex-row items-center rounded-2xl px-4 h-14 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <Icon name="magnify" size={22} color="#9ca3af" />
          <TextInput
            className={`flex-1 ml-3 text-base ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
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
            className={`ml-2 p-2 border-l relative ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <Icon name="tune" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-indigo-500 rounded-full min-w-[18px] h-[18px] justify-center items-center border-2 border-white dark:border-gray-900">
                <Text className="text-white text-[10px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                  } shadow-sm`}
                >
                  <Icon
                    name={filter.icon}
                    size={18}
                    color={
                      selectedFilter === filter.id 
                        ? "#ffffff" 
                        : isDarkMode 
                          ? '#9CA3AF' 
                          : filter.color || "#6b7280"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      selectedFilter === filter.id 
                        ? "text-white" 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {filter.label}
                  </Text>
                  <View
                    className={`ml-2 px-2 py-0.5 rounded-full ${
                      selectedFilter === filter.id 
                        ? "bg-white/20" 
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        selectedFilter === filter.id 
                          ? "text-white" 
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
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
                  className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                    isDarkMode 
                      ? 'bg-red-900/30 border-red-800' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <Icon name="close" size={18} color="#EF4444" />
                  <Text className={`ml-2 font-medium ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`}>Clear</Text>
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
          isDarkMode={isDarkMode}
        />

        {/* Customer List with filters */}
        <View className="flex-1 px-4">
          <CustomerList
            viewMode={viewMode}
            searchQuery={searchQuery}
            filters={filters}
            customers={STATIC_CUSTOMERS}
            isDarkMode={isDarkMode}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomersScreen;