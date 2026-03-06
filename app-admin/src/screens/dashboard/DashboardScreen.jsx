// screens/dashboard/DashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../components/common/Header";
import StatsCard from "../../components/dashboard/StatsCard";

const { width } = Dimensions.get("window");

// Static dashboard data - NO API CALLS
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
  const cardWidth = Math.min(200, width * 0.8); // Max 300px or 80% of screen
  const gap = 16;
  const navigation = useNavigation();
  const [dashboardData] = useState(STATIC_DASHBOARD_DATA);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [notificationCount] = useState(5);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#FEF3C7", text: "#D97706" },
      processing: { bg: "#DBEAFE", text: "#2563EB" },
      shipped: { bg: "#E0E7FF", text: "#4F46E5" },
      delivered: { bg: "#D1FAE5", text: "#059669" },
      cancelled: { bg: "#FEE2E2", text: "#DC2626" },
    };
    return colors[status] || colors.pending;
  };

  const getChartData = () => {
    switch (selectedPeriod) {
      case "day":
        return {
          labels: dashboardData.revenueData.daily.map((d) => d.date),
          datasets: [
            {
              data: dashboardData.revenueData.daily.map((d) => d.revenue),
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
      case "week":
        return {
          labels: dashboardData.revenueData.weekly.map((w) => w.week),
          datasets: [
            {
              data: dashboardData.revenueData.weekly.map((w) => w.revenue),
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
      case "month":
        return {
          labels: dashboardData.revenueData.monthly.map((m) => m.month),
          datasets: [
            {
              data: dashboardData.revenueData.monthly.map((m) => m.revenue),
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
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
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
      stroke: "#E5E7EB",
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
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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



  // Custom right component that INCLUDES both view mode toggle AND default icons
  const renderCustomRightComponent = () => (
    <View className="flex-row items-center">
      {/* View mode toggle */}
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

      {/* Notification Bell - manually added since rightComponent overrides default */}
      <TouchableOpacity
        className="p-2 relative mr-1"
        onPress={handleNotificationPress}
        activeOpacity={0.7}
      >
        <Icon name="bell-outline" size={24} color="#1f2937" />
        {notificationCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-[20px] justify-center items-center border-2 border-white">
            <Text className="text-white text-[10px] font-bold">
              {notificationCount > 9 ? "9+" : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Search Icon - manually added */}
      <TouchableOpacity
        className="p-2"
        onPress={handleSearchPress}
        activeOpacity={0.7}
      >
        <Icon name="magnify" size={24} color="#1f2937" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 pb-16">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with custom right component that includes all icons */}
      <Header
        title="Dashboard"
        backgroundColor="bg-white"
        textColor="text-gray-800"
        userName="John Doe"
        userEmail="john.doe@example.com"
        activeScreen="Dashboard"
        navigationItems={navigationItems}
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onSearchPress={handleSearchPress}
        onLogout={handleLogout}
      // Don't pass rightComponent - let Header use its default
      // OR use the custom one below that includes everything
      // rightComponent={renderCustomRightComponent()}
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
            borderRadius: 10,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-sm">Welcome back!</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                John Doe
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
            value={formatCurrency(dashboardData.stats.totalRevenue)}
            trend={dashboardData.stats.revenueTrend}
            gradient={["#6366F1", "#8B5CF6"]}
            style={{ width: cardWidth }}
          />
          <StatsCard
            icon="📋"
            title="Total Orders"
            value={formatNumber(dashboardData.stats.totalOrders)}
            trend={dashboardData.stats.ordersTrend}
            gradient={["#F59E0B", "#D97706"]}
            style={{ width: cardWidth }}
          />
          <StatsCard
            icon="👥"
            title="Customers"
            value={formatNumber(dashboardData.stats.totalCustomers)}
            trend={dashboardData.stats.customersTrend}
            gradient={["#10B981", "#059669"]}
            style={{ width: cardWidth }}
          />
          <StatsCard
            icon="📦"
            title="Products"
            value={formatNumber(dashboardData.stats.totalProducts)}
            trend={dashboardData.stats.productsTrend}
            gradient={["#EF4444", "#DC2626"]}
            style={{ width: cardWidth }}
          />
        </View>
      </ScrollView>
    </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between px-4 mt-4">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-xs">Avg. Order Value</Text>
            <Text className="text-xl font-bold text-gray-800 mt-1">
              {formatCurrency(
                dashboardData.stats.totalRevenue /
                dashboardData.stats.totalOrders,
              )}
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm border border-gray-100">
            <Text className="text-gray-500 text-xs">Conversion Rate</Text>
            <Text className="text-xl font-bold text-green-600 mt-1">24.8%</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View className="mx-4 mt-6 bg-white p-4 rounded-3xl border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Revenue Overview
              </Text>
              <Text className="text-sm text-gray-500">
                Total: {formatCurrency(dashboardData.stats.totalRevenue)}
              </Text>
            </View>
            <View className="flex-row bg-gray-100 p-1 rounded-2xl">
              {["day", "week", "month"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl ${selectedPeriod === period ? "bg-white shadow-sm" : ""
                    }`}
                >
                  <Text
                    className={`text-sm font-medium ${selectedPeriod === period
                        ? "text-indigo-600"
                        : "text-gray-500"
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
        <View className="mx-4 mt-6 bg-white p-5 rounded-3xl border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Order Status
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Orders")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around">
            {Object.entries(dashboardData.orderStatus).map(
              ([status, count]) => {
                const colors = getStatusColor(status);
                return (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleNavigate("Orders", { status })}
                    className="items-center"
                  >
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Text
                        className="text-xl font-bold"
                        style={{ color: colors.text }}
                      >
                        {count}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-600 capitalize">
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>

        {/* Top Products */}
        <View className="mx-4 mt-6 bg-white p-5 rounded-3xl border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Top Products
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Products")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {dashboardData.topProducts.map((product, index) => (
            <TouchableOpacity
              key={product.id}
              onPress={() =>
                handleNavigate("ProductDetail", { productId: product.id })
              }
              className={`flex-row items-center py-3 ${index !== dashboardData.topProducts.length - 1
                  ? "border-b border-gray-100"
                  : ""
                }`}
            >
              <View className="w-8 h-8 bg-indigo-100 rounded-xl items-center justify-center mr-3">
                <Text className="text-indigo-600 font-bold">#{index + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">
                  {product.name}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {product.sales} sales • {formatCurrency(product.revenue)}
                </Text>
              </View>
              <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
                <Ionicons name="trending-up" size={12} color="#059669" />
                <Text className="text-green-600 text-xs font-semibold ml-1">
                  {product.trend}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View className="mx-4 mt-6 mb-8 bg-white p-5 rounded-3xl border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Recent Orders
            </Text>
            <TouchableOpacity onPress={() => handleNavigate("Orders")}>
              <Text className="text-indigo-600 text-sm font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentOrders.map((order, index) => {
            const colors = getStatusColor(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                onPress={() =>
                  handleNavigate("OrderDetail", { orderId: order.id })
                }
                className={`flex-row items-center py-3 ${index !== dashboardData.recentOrders.length - 1
                    ? "border-b border-gray-100"
                    : ""
                  }`}
              >
                <LinearGradient
                  colors={["#6366F1", "#8B5CF6"]}
                  className="w-12 h-12 min-w-12 min-h-12 rounded-2xl items-center justify-center mr-3"
                  style={{borderRadius:40, overflow:'hidden',}}
                >
                  <Text className="text-white font-bold">
                    #{order.orderNumber.slice(-3)}
                  </Text>
                </LinearGradient>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {order.customer.name}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"} •{" "}
                    {formatCurrency(order.total)}
                  </Text>
                </View>
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: colors.bg }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.text }}
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
