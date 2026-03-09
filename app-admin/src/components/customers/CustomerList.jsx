// components/customers/CustomerList.js
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import CustomerCard from "./CustomerCard";

const CustomerList = ({
  viewMode = "grid",
  searchQuery = "",
  filters = {},
  customers = [],
  onCustomerPress,
  isDarkMode: propIsDarkMode,
}) => {
  // Safely use navigation with fallback
  let navigation;
  try {
    navigation = useNavigation();
  } catch (error) {
    console.log("Navigation not available in CustomerList");
  }

  const { isDarkMode: storeIsDarkMode } = useThemeStore();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : storeIsDarkMode;
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Apply all filters to customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    // Search filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          (customer.email && customer.email.toLowerCase().includes(query)) ||
          (customer.phone && customer.phone.toLowerCase().includes(query)) ||
          (customer.company && customer.company.toLowerCase().includes(query)),
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((customer) => {
        const createdDate = new Date(customer.createdAt);
        switch (filters.dateRange) {
          case "today":
            return createdDate.toDateString() === now.toDateString();
          case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return createdDate >= monthAgo;
          }
          case "3months": {
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return createdDate >= threeMonthsAgo;
          }
          case "year": {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return createdDate >= yearAgo;
          }
          default:
            return true;
        }
      });
    }

    // Minimum orders filter
    if (
      filters.minOrders &&
      filters.minOrders !== "" &&
      !isNaN(parseInt(filters.minOrders))
    ) {
      const minOrders = parseInt(filters.minOrders);
      filtered = filtered.filter((c) => c.orderCount >= minOrders);
    }

    // Minimum spent filter
    if (
      filters.minSpent &&
      filters.minSpent !== "" &&
      !isNaN(parseFloat(filters.minSpent))
    ) {
      const minSpent = parseFloat(filters.minSpent);
      filtered = filtered.filter((c) => c.totalSpent >= minSpent);
    }

    // Contact preferences
    if (filters.hasPhone !== undefined && filters.hasPhone) {
      filtered = filtered.filter((c) => c.hasPhone === true);
    }

    if (filters.hasEmail !== undefined && !filters.hasEmail) {
      filtered = filtered.filter((c) => c.hasEmail === false);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
          break;
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "orders-high":
          filtered.sort((a, b) => b.orderCount - a.orderCount);
          break;
        case "spent-high":
          filtered.sort((a, b) => b.totalSpent - a.totalSpent);
          break;
        default:
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
      }
    } else {
      // Default sort by newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [customers, searchQuery, filters]);

  const handleCustomerPress = (customer) => {
    if (onCustomerPress) {
      onCustomerPress(customer);
    } else if (navigation) {
      navigation.navigate("CustomerDetail", { customerId: customer.id });
    }
  };

  const handleClearFilters = () => {
    // This will trigger a refresh by resetting filters in parent
    // The parent component should handle this
  };

  const handleAddCustomer = () => {
    if (navigation) {
      navigation.navigate("AddCustomer");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, marginBottom: 16 }}>
      <View className="flex-row justify-between items-center">
        <Text className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "customer" : "customers"} found
        </Text>
      </View>
    </Animated.View>
  );

  const renderItem = (item) => (
    <View 
      key={item.id}
      className={viewMode === "grid" ? "w-[48%] mx-[1%]" : "w-full"}
    >
      <CustomerCard
        customer={item}
        viewMode={viewMode}
        onPress={handleCustomerPress}
        isDarkMode={isDarkMode}
      />
    </View>
  );

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < filteredCustomers.length; i += 2) {
      const rowItems = filteredCustomers.slice(i, i + 2);
      rows.push(
        <View key={`row-${i}`} className="flex-row justify-between mb-3">
          {rowItems.map(item => renderItem(item))}
        </View>
      );
    }
    return rows;
  };

  if (!filteredCustomers || filteredCustomers.length === 0) {
    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      >
        <View className="px-4">
          {renderHeader()}
          <View className="items-center justify-center py-16">
            <Icon name="account-group" size={80} color={isDarkMode ? "#4B5563" : "#d1d5db"} />
            <Text className={`text-lg font-semibold mt-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No Customers Found
            </Text>
            <Text className={`text-sm text-center mt-2 px-8 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {searchQuery ||
              Object.keys(filters).some(
                (k) =>
                  filters[k] &&
                  filters[k] !== "all" &&
                  filters[k] !== "" &&
                  filters[k] !== false,
              )
                ? "Try adjusting your search or filters"
                : "Add your first customer by tapping the + button"}
            </Text>
            {searchQuery || Object.keys(filters).some(k => filters[k] && filters[k] !== "all" && filters[k] !== "") ? (
              <TouchableOpacity
                onPress={handleClearFilters}
                className="mt-4 bg-indigo-500 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">Clear Filters</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleAddCustomer}
                className="mt-4 bg-indigo-500 px-6 py-3 rounded-full flex-row items-center"
              >
                <Icon name="plus" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Add Customer</Text>
              </TouchableOpacity>
            )}
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
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      >
        <View className="pb-4">
          {viewMode === "grid" 
            ? renderGridItems() 
            : filteredCustomers.map(item => renderItem(item))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerList;