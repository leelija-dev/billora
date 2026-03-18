// screens/reports/ReportsScreen.js
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useReports } from "../../hooks/useReports";
import Header from "../../components/common/Header";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportList from "../../components/reports/ReportList";
import ReportSummary from "../../components/reports/ReportSummary";
import { getNavigationItemsWithBadges } from "../../constants/navigationItems";
import { formatDate } from "../../utils/dateFormatter";

const ReportsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { 
    reports = [], 
    summary = {},
    loading, 
    error, 
    fetchReports,
    refreshReports,
    loading: reportsLoading
  } = useReports() || {};
  
  const [showFilters, setShowFilters] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [refreshing, setRefreshing] = useState(false);
  const [dateRangeText, setDateRangeText] = useState("Today");

  // Report types for filtering
  const reportTypes = [
    {
      id: "all",
      name: "All Reports",
      icon: "file-document-multiple",
      count: reports?.length || 0,
      color: "#3b82f6",
    },
    {
      id: "sales",
      name: "Sales",
      icon: "cash",
      count: reports?.filter(r => r.type === "sales")?.length || 0,
      color: "#10b981",
    },
    {
      id: "purchases",
      name: "Purchases",
      icon: "cart",
      count: reports?.filter(r => r.type === "purchases")?.length || 0,
      color: "#f59e0b",
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: "package",
      count: reports?.filter(r => r.type === "inventory")?.length || 0,
      color: "#8b5cf6",
    },
    {
      id: "profits",
      name: "Profits",
      icon: "chart-line",
      count: reports?.filter(r => r.type === "profits")?.length || 0,
      color: "#ec4899",
    },
  ];

  const handleFetchReports = useCallback(async () => {
    try {
      await fetchReports({
        start_date: formatDate(startDate, 'YYYY-MM-DD'),
        end_date: formatDate(endDate, 'YYYY-MM-DD'),
      });
      
      // Update date range text
      if (formatDate(startDate, 'YYYY-MM-DD') === formatDate(new Date(), 'YYYY-MM-DD') &&
          formatDate(endDate, 'YYYY-MM-DD') === formatDate(new Date(), 'YYYY-MM-DD')) {
        setDateRangeText("Today");
      } else {
        setDateRangeText(`${formatDate(startDate, 'MMM DD')} - ${formatDate(endDate, 'MMM DD')}`);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  }, [fetchReports, startDate, endDate]);

  // Initial fetch on mount
  useEffect(() => {
    handleFetchReports();
  }, []); // Empty dependency array - only run once on mount

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const handleFiltersApply = async (filters) => {
    setShowFilters(false);
    if (filters.startDate) setStartDate(new Date(filters.startDate));
    if (filters.endDate) setEndDate(new Date(filters.endDate));
    if (filters.reportType) setReportType(filters.reportType);
    
    await handleFetchReports();
  };

  const handleDateSearch = async () => {
    await handleFetchReports();
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleReportTypeSelect = (typeId) => {
    setReportType(typeId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Export reports");
  };

  const handlePrint = () => {
    // Implement print functionality
    console.log("Print reports");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshReports();
    } catch (err) {
      console.error("Error refreshing reports:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Focus effect - refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      handleFetchReports();
    }, [handleFetchReports])
  );

  // Navigation items for sidebar
  const navigationItems = useMemo(() => {
    const badges = {
      reports: reports.length.toString(),
      sales: summary.totalSales ? `$${summary.totalSales}` : null,
    };
    return getNavigationItemsWithBadges(badges);
  }, [reports.length, summary]);

  // Loading state
  if (loading && !refreshing) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading reports...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <Icon name="alert-circle" size={50} color="#ef4444" />
        <Text className="text-red-500 mt-4">Error: {error}</Text>
        <TouchableOpacity
          onPress={handleFetchReports}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      <Header
        title="Reports"
        userName={user?.name || "User"}
        userEmail={user?.email || "guest@example.com"}
        activeScreen="Reports"
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
                name={viewMode === "grid" ? "view-grid" : "view-list"}
                size={22}
                color={isDarkMode ? "#9CA3AF" : "#4b5563"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleExport}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="export" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrint}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="printer" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Date Range Selector */}
      <View className="px-4 pt-4 pb-2">
        <View className={`flex-row items-center rounded-2xl px-4 h-14 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Icon name="calendar-range" size={22} color="#9ca3af" />
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            className="flex-1 ml-3"
          >
            <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Start Date
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatDate(startDate, 'MMM DD, YYYY')}
            </Text>
          </TouchableOpacity>
          
          <Icon name="arrow-right" size={20} color="#9ca3af" />
          
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            className="flex-1 ml-3"
          >
            <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              End Date
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatDate(endDate, 'MMM DD, YYYY')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDateSearch}
            className="ml-2 bg-blue-500 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Date Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 py-2"
      >
        <TouchableOpacity
          onPress={() => {
            const today = new Date();
            setStartDate(today);
            setEndDate(today);
            handleDateSearch();
          }}
          className={`mr-2 px-4 py-2 rounded-full ${
            dateRangeText === "Today" ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Text className={dateRangeText === "Today" ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 7);
            setStartDate(start);
            setEndDate(end);
            handleDateSearch();
          }}
          className={`mr-2 px-4 py-2 rounded-full ${
            dateRangeText.includes('7') ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Text className={dateRangeText.includes('7') ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Last 7 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 30);
            setStartDate(start);
            setEndDate(end);
            handleDateSearch();
          }}
          className={`mr-2 px-4 py-2 rounded-full ${
            dateRangeText.includes('30') ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Text className={dateRangeText.includes('30') ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Last 30 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            setStartDate(start);
            setEndDate(end);
            handleDateSearch();
          }}
          className={`mr-2 px-4 py-2 rounded-full ${
            dateRangeText.includes('month') ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Text className={dateRangeText.includes('month') ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            This Month
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          maximumDate={endDate}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Report Summary Cards */}
        <ReportSummary 
          summary={summary} 
          isDarkMode={isDarkMode}
          dateRange={dateRangeText}
        />

        {/* Report Types Scroll */}
        <View className="py-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleReportTypeSelect(type.id)}
                className={`flex-row items-center mr-3 px-4 py-2.5 rounded-full border ${
                  reportType === type.id
                    ? "bg-blue-500 border-blue-500"
                    : isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-white'
                } shadow-sm`}
              >
                <Icon
                  name={type.icon}
                  size={18}
                  color={
                    reportType === type.id 
                      ? "#ffffff" 
                      : isDarkMode ? '#9CA3AF' : type.color
                  }
                />
                <Text
                  className={`ml-2 font-medium ${
                    reportType === type.id
                      ? "text-white"
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {type.name}
                </Text>
                <View
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    reportType === type.id
                      ? "bg-white/20"
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      reportType === type.id
                        ? "text-white"
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {type.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View className="px-4 pt-2 pb-4">
          <View className={`flex-row items-center rounded-2xl px-4 h-12 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Icon name="magnify" size={20} color="#9ca3af" />
            <TextInput
              className={`flex-1 ml-3 text-base ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Search reports..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleFilterPress}
              className={`ml-2 p-2 border-l ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <Icon name="tune" size={20} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Report List */}
        <View className="flex-1 px-4">
          <ReportList
            viewMode={viewMode}
            searchQuery={searchQuery}
            reportType={reportType}
            startDate={startDate}
            endDate={endDate}
            onRefresh={handleRefresh}
          />
        </View>
      </ScrollView>

      {/* Filters Modal */}
      <ReportFilters 
        visible={showFilters} 
        onClose={handleFiltersClose}
        onApply={handleFiltersApply}
        isDarkMode={isDarkMode}
        initialFilters={{
          startDate: startDate,
          endDate: endDate,
          reportType: reportType,
        }}
        summary={summary}
      />
    </View>
  );
};

export default ReportsScreen;