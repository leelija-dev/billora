import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useCustomers } from "../../hooks/useCustomers";
import Header from "../../components/common/Header";
import CustomerFilters from "../../components/customers/CustomerFilters";
import CustomerList from "../../components/customers/CustomerList";
import TrashedCustomersModal from "../../components/customers/TrashedCustomersModal";

const CustomersScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const {
    customers = [],
    loading,
    error,
    totalDue,
    refreshCustomers,
    searchCustomers,
    deleteCustomer,
    getTrashedCustomers,
    restoreCustomer,
    forceDeleteCustomer,
  } = useCustomers() || {};

  const [showFilters, setShowFilters] = useState(false);
  const [showTrashed, setShowTrashed] = useState(false);
  const [trashedCustomers, setTrashedCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("name");
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dueStatus: "all",
    minDue: "",
    maxDue: "",
    sortBy: "name",
    sortOrder: "asc",
    dateRange: "all",
    city: "",
  });

  // Use refs to track state without causing re-renders
  const lastRefreshTime = useRef(Date.now());
  const isRefreshing = useRef(false);
  const isMounted = useRef(true);

  // Calculate statistics
  const totalCustomers = customers?.length || 0;
  const customersWithDue = useMemo(() => 
    customers.filter(c => (c.due_amount || 0) > 0).length, 
    [customers]
  );
  const averageDue = totalCustomers > 0 ? (totalDue / totalCustomers).toFixed(2) : 0;

  // Stable refresh callback
  const stableRefresh = useCallback(async () => {
    if (isRefreshing.current || !isMounted.current) return;
    
    isRefreshing.current = true;
    setRefreshing(true);
    
    try {
      await refreshCustomers();
      lastRefreshTime.current = Date.now();
    } finally {
      if (isMounted.current) {
        setRefreshing(false);
        isRefreshing.current = false;
      }
    }
  }, [refreshCustomers]);

  // Focus effect
  useFocusEffect(
    useCallback(() => {
      if (isRefreshing.current) {
        console.log('Already refreshing, skipping...');
        return;
      }
      
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime.current;
      
      if (timeSinceLastRefresh > 5000 || customers.length === 0) {
        console.log('Refreshing customers on focus...');
        stableRefresh();
      }

      return () => {
        console.log('Customers screen unfocused');
      };
    }, [stableRefresh])
  );

  // Navigation listener
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const routes = navigation.getState()?.routes;
      const previousRoute = routes?.[routes.length - 2]?.name;
      
      if (previousRoute === 'AddCustomer' || previousRoute === 'CustomerDetail') {
        console.log(`Returning from ${previousRoute} - refreshing customers`);
        stableRefresh();
      }
    });

    return unsubscribe;
  }, [navigation, stableRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAddCustomer = () => {
    navigation.navigate("AddCustomer");
  };

  const handleViewTrashed = async () => {
    const trashed = await getTrashedCustomers();
    setTrashedCustomers(trashed);
    setShowTrashed(true);
  };

  const handleRestoreCustomer = async (customerId) => {
    Alert.alert(
      "Restore Customer",
      "Are you sure you want to restore this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: async () => {
            const result = await restoreCustomer(customerId);
            if (result?.success) {
              Alert.alert("Success", "Customer restored successfully");
              // Refresh trashed list
              const trashed = await getTrashedCustomers();
              setTrashedCustomers(trashed);
              // Refresh main list
              await stableRefresh();
            } else {
              Alert.alert("Error", result?.error || "Failed to restore customer");
            }
          },
        },
      ]
    );
  };

  const handlePermanentDelete = async (customerId) => {
    Alert.alert(
      "Permanently Delete Customer",
      "This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Permanently",
          style: "destructive",
          onPress: async () => {
            const result = await forceDeleteCustomer(customerId);
            if (result?.success) {
              Alert.alert("Success", "Customer permanently deleted");
              // Refresh trashed list
              const trashed = await getTrashedCustomers();
              setTrashedCustomers(trashed);
            } else {
              Alert.alert("Error", result?.error || "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setSortBy(filters.sortBy);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setActiveFilters({
      dueStatus: "all",
      minDue: "",
      maxDue: "",
      sortBy: "name",
      sortOrder: "asc",
      dateRange: "all",
      city: "",
    });
    setSortBy("name");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchCustomers(query);
    } else {
      stableRefresh();
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleDeleteCustomer = async (customerId) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log('Deleting customer:', customerId);
            const result = await deleteCustomer(customerId);
            
            if (result?.success) {
              Alert.alert("Success", "Customer deleted successfully");
              await stableRefresh();
              lastRefreshTime.current = 0;
            } else {
              Alert.alert("Error", result?.error || "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    await stableRefresh();
  };

  // Navigation items for sidebar
  const navigationItems = useMemo(() => [
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
      badge: null,
    },
    {
      id: "customers",
      title: "Customers",
      icon: "account-group",
      screen: "Customers",
      badge: totalCustomers.toString(),
    },
    {
      id: "bills",
      title: "Bills",
      icon: "file-document",
      screen: "Bills",
      badge: null,
    },
    {
      id: "stocks",
      title: "Stocks",
      icon: "warehouse",
      screen: "Stocks",
      badge: null,
    },
    {
      id: "settings",
      title: "Settings",
      icon: "cog",
      screen: "Settings",
      badge: null,
    },
  ], [totalCustomers]);

  // Show loading state
  if (loading && customers.length === 0 && !refreshing) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="account-group" size={32} color="#3b82f6" />
        </View>
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Loading customers...
        </Text>
        <Text className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Please wait a moment
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#111827" : "#ffffff"} 
      />
      
      <Header
        title="Customers"
        userName={user?.name || "User"}
        userEmail={user?.email || "guest@example.com"}
        activeScreen="Customers"
        navigationItems={navigationItems}
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleViewTrashed}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="delete-restore" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
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
              onPress={handleAddCustomer}
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
            placeholder="Search by name, email, phone, address..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Icon name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleFilterPress}
            className={`ml-2 p-2 border-l relative ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <Icon name="tune" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            {Object.values(activeFilters).some(v => v && v !== "" && v !== "all" && v !== null) && (
              <View className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor={isDarkMode ? "#ffffff" : "#3b82f6"}
          />
        }
      >
        {/* Stats Cards */}
        <View className="flex-row flex-wrap px-4 py-3">
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            className="rounded-xl p-4 flex-1 mr-2"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className="text-white/80 text-xs">Total Customers</Text>
            <Text className="text-white text-2xl font-bold">{totalCustomers}</Text>
            <View className="flex-row items-center mt-1">
              <Icon name="account-group" size={16} color="#86efac" />
              <Text className="text-white/80 text-xs ml-1">Active customers</Text>
            </View>
          </LinearGradient>

          <View className={`rounded-xl p-4 flex-1 ml-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Due Amount
            </Text>
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              ${totalDue.toFixed(2)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="alert-circle" size={16} color="#f59e0b" />
              <Text className={`text-xs ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {customersWithDue} customers with due
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row px-4 mb-4">
          <View className={`rounded-xl p-3 flex-1 mr-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row items-center">
              <Icon name="cash" size={20} color="#10b981" />
              <Text className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Average Due
              </Text>
            </View>
            <Text className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              ${averageDue}
            </Text>
            <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Per customer
            </Text>
          </View>

          <View className={`rounded-xl p-3 flex-1 ml-2 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row items-center">
              <Icon name="map-marker" size={20} color="#8b5cf6" />
              <Text className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Cities
              </Text>
            </View>
            <Text className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {new Set(customers.map(c => c.city).filter(Boolean)).size}
            </Text>
            <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Unique locations
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        {(activeFilters.dueStatus !== 'all' || activeFilters.city) && (
          <View className="px-4 mb-3 flex-row flex-wrap">
            {activeFilters.dueStatus !== 'all' && (
              <View className={`flex-row items-center mr-2 mb-2 px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Due: {activeFilters.dueStatus}
                </Text>
                <TouchableOpacity 
                  onPress={() => setActiveFilters({...activeFilters, dueStatus: 'all'})}
                  className="ml-2"
                >
                  <Icon name="close" size={16} color={isDarkMode ? "#9CA3AF" : "#6b7280"} />
                </TouchableOpacity>
              </View>
            )}
            {activeFilters.city && (
              <View className={`flex-row items-center mr-2 mb-2 px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  City: {activeFilters.city}
                </Text>
                <TouchableOpacity 
                  onPress={() => setActiveFilters({...activeFilters, city: ''})}
                  className="ml-2"
                >
                  <Icon name="close" size={16} color={isDarkMode ? "#9CA3AF" : "#6b7280"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Sort Options */}
        <View className="flex-row px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setSortBy('name')}
                className={`flex-row items-center mr-2 px-4 py-2 rounded-full border ${
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
                onPress={() => setSortBy('due')}
                className={`flex-row items-center mr-2 px-4 py-2 rounded-full border ${
                  sortBy === 'due'
                    ? "bg-blue-500 border-blue-500"
                    : isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                }`}
              >
                <Icon
                  name="cash"
                  size={16}
                  color={sortBy === 'due' ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
                />
                <Text
                  className={`ml-2 text-sm ${
                    sortBy === 'due'
                      ? "text-white"
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Due Amount
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortBy('date')}
                className={`flex-row items-center mr-2 px-4 py-2 rounded-full border ${
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
                  Date
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortBy('city')}
                className={`flex-row items-center px-4 py-2 rounded-full border ${
                  sortBy === 'city'
                    ? "bg-blue-500 border-blue-500"
                    : isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                }`}
              >
                <Icon
                  name="map-marker"
                  size={16}
                  color={sortBy === 'city' ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
                />
                <Text
                  className={`ml-2 text-sm ${
                    sortBy === 'city'
                      ? "text-white"
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  City
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Customer List */}
        <View className="flex-1 px-4 pb-4">
          <CustomerList
            customers={customers}
            viewMode={viewMode}
            searchQuery={searchQuery}
            sortBy={sortBy}
            filters={activeFilters}
            onRefresh={onRefresh}
            onDelete={handleDeleteCustomer}
            loading={loading}
          />
        </View>
      </ScrollView>

      {/* Filters Modal */}
      <CustomerFilters
        visible={showFilters}
        onClose={handleFiltersClose}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        initialFilters={activeFilters}
      />

      {/* Trashed Customers Modal */}
      <TrashedCustomersModal
        visible={showTrashed}
        onClose={() => setShowTrashed(false)}
        customers={trashedCustomers}
        onRestore={handleRestoreCustomer}
        onPermanentDelete={handlePermanentDelete}
      />
    </View>
  );
};

export default CustomersScreen;