import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import Header from "../../components/common/Header";

const { width } = Dimensions.get("window");

const BillHistoryScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, today, week, month
  
  // Mock bills data
  const mockBills = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      customerName: "John Smith",
      totalAmount: 1299.99,
      paidAmount: 1300.00,
      status: "paid",
      paymentMethod: "cash",
      createdAt: "2024-03-15T10:30:00Z",
      items: 5,
      store: "Main Store"
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      customerName: "Emma Wilson",
      totalAmount: 549.50,
      paidAmount: 550.00,
      status: "paid",
      paymentMethod: "card",
      createdAt: "2024-03-14T14:20:00Z",
      items: 3,
      store: "Main Store"
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      customerName: "Michael Brown",
      totalAmount: 899.99,
      paidAmount: 900.00,
      status: "partial",
      paymentMethod: "upi",
      createdAt: "2024-03-14T09:15:00Z",
      items: 2,
      store: "Branch Store"
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      customerName: "Sarah Davis",
      totalAmount: 2199.99,
      paidAmount: 0,
      status: "pending",
      paymentMethod: null,
      createdAt: "2024-03-13T16:45:00Z",
      items: 8,
      store: "Main Store"
    },
    {
      id: 5,
      invoiceNumber: "INV-005",
      customerName: "David Lee",
      totalAmount: 449.99,
      paidAmount: 450.00,
      status: "paid",
      paymentMethod: "cash",
      createdAt: "2024-03-13T11:30:00Z",
      items: 4,
      store: "Branch Store"
    },
  ];

  const fetchBills = async (search = "", dateFilter = null) => {
    try {
      setLoading(true);
      let url = `http://localhost:8000/api/invoice/bill-history`;
      
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      
      if (dateFilter) {
        const separator = search ? '&' : '?';
        url += `${separator}start_date=${dateFilter.start}&end_date=${dateFilter.end}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setBills(data.data || mockBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills(mockBills);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills(searchQuery);
  };

  const searchBills = (query) => {
    setSearchQuery(query);
    fetchBills(query);
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: { bg: "#D1FAE5", text: "#059669", darkBg: "#065F46", darkText: "#6EE7B7" },
      partial: { bg: "#FEF3C7", text: "#D97706", darkBg: "#92400E", darkText: "#FCD34D" },
      pending: { bg: "#FEE2E2", text: "#DC2626", darkBg: "#7F1D1D", darkText: "#FCA5A5" },
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const renderBillItem = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BillDetail", { billId: item.id })}
        className={`mb-3 p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Text className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {item.invoiceNumber}
              </Text>
              <View className={`ml-2 px-2 py-1 rounded-full ${
                isDarkMode ? statusColors.darkBg : statusColors.bg
              }`}>
                <Text className={`text-xs font-medium ${
                  isDarkMode ? statusColors.darkText : statusColors.text
                }`}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text className={`text-sm mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.customerName}
            </Text>

            <View className="flex-row items-center">
              <Icon name="store" size={14} color="#9ca3af" />
              <Text className={`text-xs ml-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.store} • {item.items} items
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <Icon name="clock" size={14} color="#9ca3af" />
              <Text className={`text-xs ml-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className={`font-bold text-lg ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {formatCurrency(item.totalAmount)}
            </Text>
            
            {item.paidAmount > 0 && (
              <Text className={`text-sm ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                Paid: {formatCurrency(item.paidAmount)}
              </Text>
            )}
            
            {item.paymentMethod && (
              <View className="flex-row items-center mt-1">
                <Icon name="credit-card" size={12} color="#9ca3af" />
                <Text className={`text-xs ml-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.paymentMethod}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filterOptions = [
    { id: "all", label: "All Bills", icon: "format-list-bulleted" },
    { id: "today", label: "Today", icon: "calendar-today" },
    { id: "week", label: "This Week", icon: "calendar-week" },
    { id: "month", label: "This Month", icon: "calendar-month" },
  ];

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      {/* Header */}
      <Header
        title="Bill History"
        userName="John Doe"
        userEmail="john@example.com"
        activeScreen="Billing"
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate("BillGeneration")}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Icon name="plus" size={24} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 py-3">
          <View className={`flex-row items-center rounded-xl px-4 h-12 shadow-sm border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <Icon name="magnify" size={20} color="#9ca3af" />
            <TextInput
              className={`flex-1 ml-3 text-base ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Search by invoice ID, customer name, product..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={searchBills}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => searchBills("")}>
                <Icon name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Options */}
        <View className="px-4 pb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    setFilter(option.id);
                    // Apply date filter logic here
                    fetchBills(searchQuery);
                  }}
                  className={`flex-row items-center px-4 py-2 rounded-full border ${
                    filter === option.id
                      ? "bg-blue-500 border-blue-500"
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                  } shadow-sm`}
                >
                  <Icon
                    name={option.icon}
                    size={18}
                    color={filter === option.id ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#6b7280"}
                  />
                  <Text className={`ml-2 text-sm font-medium ${
                    filter === option.id ? "text-white" : isDarkMode ? "#9CA3AF" : "#6b7280"
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Bills List */}
        <View className="px-4">
          <FlatList
            data={bills}
            renderItem={renderBillItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDarkMode ? "#9CA3AF" : "#6b7280"}
                colors={[isDarkMode ? "#9CA3AF" : "#6b7280"]}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="items-center py-12">
                <Icon name="file-document-outline" size={64} color="#9ca3af" />
                <Text className={`mt-4 text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {searchQuery ? "No bills found matching your search" : "No bills found"}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("BillGeneration")}
                  className={`mt-4 px-6 py-3 rounded-xl ${
                    isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white font-medium">Generate Your First Bill</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BillHistoryScreen;
