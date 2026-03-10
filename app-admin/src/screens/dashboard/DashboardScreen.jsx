import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useDashboard } from "../../hooks/useDashboard";
import Header from "../../components/common/Header";
import StatsCard from "../../components/dashboard/StatsCard";

const { width } = Dimensions.get("window");

// Static dashboard data - NO API CALLS (use this as fallback)
const STATIC_DASHBOARD_DATA = {
  stats: {
    totalRevenue: 125890,
    totalOrders: 1256,
    totalCustomers: 892,
    totalProducts: 342,
    revenueTrend: 12.5,
    ordersTrend: 8.2,
    customersTrend: 5.7,
    productsTrend: 3.1,
  },
  revenueData: {
    daily: [
      { date: "Mon", revenue: 4500 },
      { date: "Tue", revenue: 6200 },
      { date: "Wed", revenue: 5800 },
      { date: "Thu", revenue: 7100 },
      { date: "Fri", revenue: 8900 },
      { date: "Sat", revenue: 10500 },
      { date: "Sun", revenue: 8200 },
    ],
    weekly: [
      { week: "W1", revenue: 45200 },
      { week: "W2", revenue: 48900 },
      { week: "W3", revenue: 52300 },
      { week: "W4", revenue: 57800 },
    ],
    monthly: [
      { month: "Jan", revenue: 45200 },
      { month: "Feb", revenue: 48900 },
      { month: "Mar", revenue: 52300 },
      { month: "Apr", revenue: 57800 },
      { month: "May", revenue: 61200 },
      { month: "Jun", revenue: 65800 },
    ],
  },
  orderStatus: {
    pending: 45,
    processing: 78,
    shipped: 123,
    delivered: 890,
    cancelled: 34,
  },
  topProducts: [
    {
      id: 1,
      name: "Classic White T-Shirt",
      sales: 245,
      revenue: 7350,
      trend: "+12%",
    },
    { id: 2, name: "Slim Fit Jeans", sales: 189, revenue: 15120, trend: "+8%" },
    {
      id: 3,
      name: "Leather Sneakers",
      sales: 156,
      revenue: 14040,
      trend: "+15%",
    },
    {
      id: 4,
      name: "Cashmere Sweater",
      sales: 134,
      revenue: 13400,
      trend: "+5%",
    },
    { id: 5, name: "Sports Watch", sales: 98, revenue: 7840, trend: "+22%" },
  ],
  recentOrders: [
    {
      id: "ORD-001",
      orderNumber: "ORD-001",
      customer: { name: "John Smith" },
      total: 299.99,
      status: "delivered",
      items: [{ quantity: 3 }],
      createdAt: "2024-03-15T10:30:00Z",
    },
    {
      id: "ORD-002",
      orderNumber: "ORD-002",
      customer: { name: "Emma Wilson" },
      total: 189.5,
      status: "processing",
      items: [{ quantity: 2 }],
      createdAt: "2024-03-14T14:20:00Z",
    },
    {
      id: "ORD-003",
      orderNumber: "ORD-003",
      customer: { name: "Michael Brown" },
      total: 79.99,
      status: "pending",
      items: [{ quantity: 1 }],
      createdAt: "2024-03-14T09:15:00Z",
    },
    {
      id: "ORD-004",
      orderNumber: "ORD-004",
      customer: { name: "Sarah Davis" },
      total: 459.99,
      status: "shipped",
      items: [{ quantity: 4 }],
      createdAt: "2024-03-13T16:45:00Z",
    },
    {
      id: "ORD-005",
      orderNumber: "ORD-005",
      customer: { name: "David Lee" },
      total: 129.99,
      status: "delivered",
      items: [{ quantity: 2 }],
      createdAt: "2024-03-13T11:30:00Z",
    },
  ],
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
    badge: null,
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

const DashboardScreen = () => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  
  // Use real API data instead of static data
  const { dashboardData, loading, error, refreshData } = useDashboard();
  
  const cardWidth = Math.min(200, width * 0.8);
  const gap = 16;
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [viewMode, setViewMode] = useState("grid");
  const [notificationCount] = useState(5);
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#FEF3C7", text: "#D97706", darkBg: "#92400E", darkText: "#FCD34D" },
      processing: { bg: "#DBEAFE", text: "#2563EB", darkBg: "#1E3A8A", darkText: "#93C5FD" },
      shipped: { bg: "#E0E7FF", text: "#4F46E5", darkBg: "#3730A3", darkText: "#A5B4FC" },
      delivered: { bg: "#D1FAE5", text: "#059669", darkBg: "#065F46", darkText: "#6EE7B7" },
      cancelled: { bg: "#FEE2E2", text: "#DC2626", darkBg: "#7F1D1D", darkText: "#FCA5A5" },
    };
    return colors[status] || colors.pending;
  };

  const getChartData = () => {
    if (!dashboardData) return { labels: [], datasets: [] };
    
    switch (selectedPeriod) {
      case "day":
        return {
          labels: dashboardData.revenueData?.daily?.map((d) => d.date) || [],
          datasets: [
            {
              data: dashboardData.revenueData?.daily?.map((d) => d.revenue) || [],
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
      case "week":
        return {
          labels: dashboardData.revenueData?.weekly?.map((w) => w.week) || [],
          datasets: [
            {
              data: dashboardData.revenueData?.weekly?.map((w) => w.revenue) || [],
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
      case "month":
        return {
          labels: dashboardData.revenueData?.monthly?.map((m) => m.month) || [],
          datasets: [
            {
              data: dashboardData.revenueData?.monthly?.map((m) => m.revenue) || [],
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
      default:
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ data: [4500, 6200, 5800, 7100, 8900, 10500, 8200] }],
        };
    }
  };

  const chartConfig = {
    backgroundColor: isDarkMode ? "#1F2937" : "#ffffff",
    backgroundGradientFrom: isDarkMode ? "#1F2937" : "#ffffff",
    backgroundGradientTo: isDarkMode ? "#1F2937" : "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#6366F1",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: isDarkMode ? "#374151" : "#E5E7EB",
      strokeWidth: 1,
    },
    formatYLabel: (value) => {
      const num = parseFloat(value);
      if (num >= 1000) {
        return `$${Math.round(num / 1000)}k`;
      }
      return `$${Math.round(num)}`;
    },
  };

  const onRefresh = () => {
    setRefreshing(true);
    refreshData();
    setRefreshing(false);
  };

  const handleNavigate = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleNotificationPress = () => {
    console.log("Notifications opened");
  };

  const handleSearchPress = () => {
    Alert.alert("Search", "Search functionality will be implemented here");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logged out"),
      },
    ]);
  };

  // Show loading state if needed
  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading...</Text>
      </View>
    );
  }

  // Show error state if needed
  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  // If dashboardData is null for some reason, use a default empty object
  const data = dashboardData || STATIC_DASHBOARD_DATA;

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <Header
        title="Dashboard"
        userName={user?.name || "User"}
        userEmail={user?.email || "guest@example.com"}
        activeScreen="Dashboard"
        navigationItems={navigationItems}
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onSearchPress={handleSearchPress}
        onLogout={handleLogout}
      />

      <ScrollView
        className="flex-1"
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
        {/* Welcome Banner */}
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mx-4 mt-4 p-5 rounded-3xl"
          style={{
            shadowColor: "#6366F1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
            borderRadius: 10
          }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-sm">Welcome back!</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {user?.name || "User"}
              </Text>
              <Text className="text-white/60 text-xs mt-2">
                Here's what's happening with your store today.
              </Text>
            </View>
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center">
              <Icon name="view-dashboard" size={32} color="white" />
            </View>
          </View>
        </LinearGradient>

        {/* Stats Cards - Horizontal Scroll */}
        <View className="px-4 mt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row" style={{ gap }}>
              <StatsCard
                icon="💰"
                title="Total Revenue"
                value={formatCurrency(data.stats.totalRevenue)}
                trend={data.stats.revenueTrend}
                gradient={["#6366F1", "#8B5CF6"]}
                style={{ width: cardWidth }}
              />
              <StatsCard
                icon="📋"
                title="Total Orders"
                value={formatNumber(data.stats.totalOrders)}
                trend={data.stats.ordersTrend}
                gradient={["#F59E0B", "#D97706"]}
                style={{ width: cardWidth }}
              />
              <StatsCard
                icon="👥"
                title="Customers"
                value={formatNumber(data.stats.totalCustomers)}
                trend={data.stats.customersTrend}
                gradient={["#10B981", "#059669"]}
                style={{ width: cardWidth }}
              />
              <StatsCard
                icon="📦"
                title="Products"
                value={formatNumber(data.stats.totalProducts)}
                trend={data.stats.productsTrend}
                gradient={["#EF4444", "#DC2626"]}
                style={{ width: cardWidth }}
              />
            </View>
          </ScrollView>
        </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between px-4 mt-4">
          <View className={`rounded-xl p-4 flex-1 mr-2 border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Avg. Order Value
            </Text>
            <Text className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(
                data.stats.totalRevenue / data.stats.totalOrders,
              )}
            </Text>
          </View>
          <View className={`rounded-xl p-4 flex-1 ml-2 border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Conversion Rate
            </Text>
            <Text className="text-xl font-bold text-green-600 mt-1">24.8%</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View className={`mx-4 mt-6 p-4 rounded-3xl border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Overview
              </Text>
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total: {formatCurrency(data.stats.totalRevenue)}
              </Text>
            </View>
            <View className={`flex-row p-1 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {["day", "week", "month"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl ${
                    selectedPeriod === period 
                      ? isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                      : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedPeriod === period
                        ? "text-indigo-600"
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <LineChart
            data={getChartData()}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginLeft: -16,
              borderRadius: 16,
            }}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={5}
          />
        </View>

        {/* Order Status */}
        <View className={`mx-4 mt-6 p-5 rounded-3xl border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Status
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Orders")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around">
            {Object.entries(data.orderStatus).map(
              ([status, count]) => {
                const colors = getStatusColor(status);
                const bgColor = isDarkMode ? colors.darkBg : colors.bg;
                const textColor = isDarkMode ? colors.darkText : colors.text;
                
                return (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleNavigate("Orders", { status })}
                    className="items-center"
                  >
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                      style={{ backgroundColor: bgColor }}
                    >
                      <Text
                        className="text-xl font-bold"
                        style={{ color: textColor }}
                      >
                        {count}
                      </Text>
                    </View>
                    <Text className={`text-xs capitalize ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>

        {/* Top Products */}
        <View className={`mx-4 mt-6 p-5 rounded-3xl border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Products
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Products")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {data.topProducts.map((product, index) => (
            <TouchableOpacity
              key={product.id}
              onPress={() =>
                handleNavigate("ProductDetail", { productId: product.id })
              }
              className={`flex-row items-center py-3 ${
                index !== data.topProducts.length - 1
                  ? isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'
                  : ''
              }`}
            >
              <View className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${
                isDarkMode ? 'bg-purple-900/30' : 'bg-indigo-100'
              }`}>
                <Text className={`font-bold ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}>
                  #{index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </Text>
                <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {product.sales} sales • {formatCurrency(product.revenue)}
                </Text>
              </View>
              <View className="flex-row items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <Ionicons name="trending-up" size={12} color="#059669" />
                <Text className="text-green-600 dark:text-green-400 text-xs font-semibold ml-1">
                  {product.trend}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View className={`mx-4 mt-6 mb-8 p-5 rounded-3xl border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Orders
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Orders")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {data.recentOrders.map((order, index) => {
            const colors = getStatusColor(order.status);
            const bgColor = isDarkMode ? colors.darkBg : colors.bg;
            const textColor = isDarkMode ? colors.darkText : colors.text;
            
            return (
              <TouchableOpacity
                key={order.id}
                onPress={() =>
                  handleNavigate("OrderDetail", { orderId: order.id })
                }
                className={`flex-row items-center py-3 ${
                  index !== data.recentOrders.length - 1
                    ? isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'
                    : ''
                }`}
              >
                <LinearGradient
                  colors={["#6366F1", "#8B5CF6"]}
                  className="w-12 h-12 min-w-12 min-h-12 rounded-2xl items-center justify-center mr-3"
                  style={{ borderRadius: 40, overflow: 'hidden' }}
                >
                  <Text className="text-white font-bold">
                    #{order.orderNumber.slice(-3)}
                  </Text>
                </LinearGradient>
                <View className="flex-1">
                  <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.customer.name}
                  </Text>
                  <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"} •{" "}
                    {formatCurrency(order.total)}
                  </Text>
                </View>
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: bgColor }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: textColor }}
                  >
                    {order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;