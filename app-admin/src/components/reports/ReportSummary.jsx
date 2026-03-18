// components/reports/ReportSummary.js
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const ReportSummary = ({ summary, isDarkMode, dateRange }) => {
  const {
    totalSales = 0,
    totalPurchases = 0,
    totalProfit = 0,
    totalOrders = 0,
    averageOrderValue = 0,
  } = summary;

  const formatCurrency = (value) => {
    return `$${parseFloat(value || 0).toFixed(2)}`;
  };

  const summaryCards = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      icon: "cash",
      colors: ["#10b981", "#059669"],
      bgColor: "bg-green-500",
    },
    {
      title: "Total Purchases",
      value: formatCurrency(totalPurchases),
      icon: "cart",
      colors: ["#f59e0b", "#d97706"],
      bgColor: "bg-orange-500",
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: "chart-line",
      colors: ["#3b82f6", "#2563eb"],
      bgColor: "bg-blue-500",
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      icon: "shopping",
      colors: ["#8b5cf6", "#7c3aed"],
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <View className="px-4 py-3">
      {/* Date Range Indicator */}
      <View className={`flex-row items-center mb-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-xl shadow-sm`}>
        <Icon name="calendar-clock" size={20} color="#3b82f6" />
        <Text className={`ml-2 text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {dateRange || "Today"} Report
        </Text>
        <View className="ml-auto flex-row items-center">
          <Icon name="refresh" size={18} color="#9ca3af" />
          <Text className={`ml-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Auto-updated
          </Text>
        </View>
      </View>

      {/* Summary Cards Grid */}
      <View className="flex-row flex-wrap justify-between">
        {summaryCards.map((card, index) => (
          <View key={index} className="w-[48%] mb-3">
            <LinearGradient
              colors={card.colors}
              className="p-4 rounded-xl shadow-lg"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                  <Icon name={card.icon} size={20} color="#ffffff" />
                </View>
                <Text className="text-white/60 text-xs">This period</Text>
              </View>
              <Text className="text-white/80 text-xs font-medium">{card.title}</Text>
              <Text className="text-white text-xl font-bold mt-1">
                {card.value}
              </Text>
              <View className="flex-row items-center mt-2">
                <Icon name="trending-up" size={16} color="#ffffff" />
                <Text className="text-white/80 text-xs ml-1">
                  vs last period
                </Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </View>

      {/* Additional Stats */}
      <View className={`flex-row justify-between p-4 rounded-xl mt-2 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}>
        <View className="items-center flex-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Avg Order Value
          </Text>
          <Text className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {formatCurrency(averageOrderValue)}
          </Text>
        </View>
        <View className="w-px h-10 bg-gray-200 mx-2" />
        <View className="items-center flex-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Total Items Sold
          </Text>
          <Text className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {summary.totalItemsSold || 0}
          </Text>
        </View>
        <View className="w-px h-10 bg-gray-200 mx-2" />
        <View className="items-center flex-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Low Stock Items
          </Text>
          <Text className="text-lg font-bold mt-1 text-orange-500">
            {summary.lowStockItems || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReportSummary;