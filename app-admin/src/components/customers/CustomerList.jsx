// components/customers/CustomerList.js
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Static customers data
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
    notes: "Premium customer",
    createdAt: "2024-01-15T10:30:00Z",
    lastOrder: "2024-03-15T10:30:00Z",
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
    notes: "Interested in new collections",
    createdAt: "2024-01-20T14:20:00Z",
    lastOrder: "2024-03-14T14:20:00Z",
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
    notes: "Corporate account",
    createdAt: "2024-02-01T09:15:00Z",
    lastOrder: "2024-03-13T09:15:00Z",
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
    notes: "Prefers phone calls",
    createdAt: "2024-02-10T16:45:00Z",
    lastOrder: "2024-03-12T16:45:00Z",
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
    notes: "Temporary inactive",
    createdAt: "2024-02-15T11:30:00Z",
    lastOrder: "2024-02-28T11:30:00Z",
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
    notes: "VIP customer",
    createdAt: "2024-01-05T13:20:00Z",
    lastOrder: "2024-03-10T13:20:00Z",
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
    notes: "New customer",
    createdAt: "2024-03-01T10:00:00Z",
    lastOrder: "2024-03-11T10:00:00Z",
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
    notes: "On vacation",
    createdAt: "2024-02-20T15:30:00Z",
    lastOrder: "2024-02-25T15:30:00Z",
    hasPhone: true,
    hasEmail: false,
  },
];

const CustomerList = ({
  viewMode = "grid",
  searchQuery = "",
  filters = {},
  onCustomerPress,
}) => {
  // Safely use navigation with fallback
  let navigation;
  try {
    navigation = useNavigation();
  } catch (error) {
    console.log("Navigation not available in CustomerList");
  }

  const [refreshing, setRefreshing] = useState(false);
  const [customers] = useState(STATIC_CUSTOMERS);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Debug: Log initial customers count
  useEffect(() => {
    console.log("Total customers:", customers.length);
  }, []);

  // Apply all filters to customers
  const filteredCustomers = useMemo(() => {
    console.log("Applying filters:", filters);
    console.log("Search query:", searchQuery);

    let filtered = [...customers];

    // Log before filtering
    console.log("Before any filter:", filtered.length);

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((c) => c.status === filters.status);
      console.log(`After status filter (${filters.status}):`, filtered.length);
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
      console.log("After search filter:", filtered.length);
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
      console.log("After date filter:", filtered.length);
    }

    // Minimum orders filter
    if (
      filters.minOrders &&
      filters.minOrders !== "" &&
      !isNaN(parseInt(filters.minOrders))
    ) {
      const minOrders = parseInt(filters.minOrders);
      filtered = filtered.filter((c) => c.orderCount >= minOrders);
      console.log("After min orders filter:", filtered.length);
    }

    // Minimum spent filter
    if (
      filters.minSpent &&
      filters.minSpent !== "" &&
      !isNaN(parseFloat(filters.minSpent))
    ) {
      const minSpent = parseFloat(filters.minSpent);
      filtered = filtered.filter((c) => c.totalSpent >= minSpent);
      console.log("After min spent filter:", filtered.length);
    }

    // Contact preferences
    if (filters.hasPhone !== undefined && filters.hasPhone) {
      filtered = filtered.filter((c) => c.hasPhone === true);
      console.log("After has phone filter:", filtered.length);
    }

    if (filters.hasEmail !== undefined && !filters.hasEmail) {
      filtered = filtered.filter((c) => c.hasEmail === false);
      console.log("After has email filter:", filtered.length);
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

    console.log("Final filtered count:", filtered.length);
    return filtered;
  }, [customers, searchQuery, filters]);

  const handleCustomerPress = (customer) => {
    if (onCustomerPress) {
      onCustomerPress(customer);
    } else if (navigation) {
      navigation.navigate("CustomerDetail", { customerId: customer.id });
    } else {
      console.log("Customer pressed:", customer.id);
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
        <Text className="text-gray-600 text-sm">
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "customer" : "customers"} found
        </Text>
      </View>
    </Animated.View>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCustomerPress(item)}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <LinearGradient
          colors={
            item.status === "active"
              ? ["#10B981", "#059669"]
              : ["#EF4444", "#DC2626"]
          }
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
          style={{borderRadius:100}}
        >
          <Text className="text-white text-xl font-bold">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-gray-900 font-bold text-lg">
                {item.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {item.email || "No email"}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${
                item.status === "active" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  item.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row mt-3">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs">Orders</Text>
              <Text className="text-gray-900 font-semibold">
                {item.orderCount}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs">Total Spent</Text>
              <Text className="text-gray-900 font-semibold">
                ${item.totalSpent.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs">Avg Order</Text>
              <Text className="text-gray-900 font-semibold">
                ${item.averageOrderValue.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            {item.phone && (
              <View className="flex-row items-center mr-3">
                <Icon name="phone" size={14} color="#9ca3af" />
                <Text className="text-gray-500 text-xs ml-1">{item.phone}</Text>
              </View>
            )}
            {item.company && (
              <View className="flex-row items-center">
                <Icon name="office-building" size={14} color="#9ca3af" />
                <Text className="text-gray-500 text-xs ml-1">
                  {item.company}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCustomerPress(item)}
      className="w-[48%] mx-[1%] bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          item.status === "active"
            ? ["#10B981", "#059669"]
            : ["#EF4444", "#DC2626"]
        }
        className="w-16 h-16 rounded-2xl items-center justify-center self-center mb-3"
        style={{borderRadius:100}}
      >
        <Text className="text-white text-2xl font-bold">
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </LinearGradient>

      <Text
        className="text-gray-900 font-bold text-base text-center"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text
        className="text-gray-500 text-xs text-center mb-2"
        numberOfLines={1}
      >
        {item.email || "No email"}
      </Text>

      <View
        className={`self-center px-3 py-1 rounded-full mb-3 ${
          item.status === "active" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            item.status === "active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <View className="items-center">
          <Text className="text-gray-400 text-xs">Orders</Text>
          <Text className="text-gray-900 font-bold">{item.orderCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs">Spent</Text>
          <Text className="text-gray-900 font-bold">
            ${item.totalSpent.toFixed(0)}
          </Text>
        </View>
      </View>

      {item.phone && (
        <View className="flex-row items-center justify-center mt-2">
          <Icon name="phone" size={12} color="#9ca3af" />
          <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
            {item.phone}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (!filteredCustomers || filteredCustomers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Icon name="account-group" size={80} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-700 mt-4">
          No Customers Found
        </Text>
        <Text className="text-sm text-gray-400 text-center mt-2 px-8">
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
        <TouchableOpacity
          onPress={() => {
            // Reset filters
            if (onCustomerPress) {
              // This is a hack to trigger a refresh - you might want to pass a reset function from parent
              window.location.reload?.(); // Only works in web
            }
          }}
          className="mt-4 bg-indigo-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Clear Filters</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredCustomers}
      keyExtractor={(item) => item.id}
      numColumns={viewMode === "grid" ? 2 : 1}
      key={viewMode}
      renderItem={viewMode === "grid" ? renderGridItem : renderListItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#6366F1"]}
          tintColor="#6366F1"
        />
      }
    />
  );
};

export default CustomerList;
