// screens/reports/ReportDetailScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "../../store/themeStore";
import { useReports } from "../../hooks/useReports";
import { formatDate } from "../../utils/dateFormatter";

const ReportDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reportId, reportType } = route.params || {};
  const { isDarkMode } = useThemeStore();
  const { reports, loading: reportsLoading, fetchReports, summary } = useReports();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasFetched, setHasFetched] = useState(false); // Prevent infinite loops

  useEffect(() => {
    if (!hasFetched) {
      loadReportData();
      setHasFetched(true);
    }
  }, [reportId, summary, reportType]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      console.log('Loading report data for reportId:', reportId, 'reportType:', reportType);
      console.log('Available reports:', reports);
      
      // First check if we have reports already loaded
      if (reports && reports.length > 0) {
        const foundReport = reports.find(r => r.id == reportId); // Use == for string/number comparison
        console.log('Found report:', foundReport);
        if (foundReport) {
          setReport(foundReport);
          setLoading(false);
          return;
        }
      }

      // If no reports available, fetch them with a wider date range and get the response directly
      console.log('No reports available, fetching reports data with wider date range...');
      // Fetch reports for the last 30 days to find the actual report
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Import the API directly to get the response
      const { reportsAPI } = await import('../../api/reports');
      const response = await reportsAPI.getReports({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        type: reportType
      });
      
      console.log('Direct API Response:', response);
      
      // Process the response directly like the useReports hook does
      let reportsData = [];
      if (response?.data && response?.salesItem_details) {
        const apiData = response.data;
        const salesItems = response.salesItem_details;
        
        // Extract reports from salesItem_details
        if (Array.isArray(salesItems) && salesItems.length > 0) {
          reportsData = salesItems.map((item, index) => ({
            id: item.id || index + 1,
            title: `Sales Report - ${new Date(item.created_at).toLocaleDateString()}`,
            type: 'sales',
            amount: parseFloat(item.total_amount) || 0,
            count: parseInt(item.total_items) || 1,
            date: item.created_at,
            description: `Sales report for order #${item.id}`,
            status: item.status || 'completed',
            details: [
              { label: 'Order ID', value: `#${item.id}` },
              { label: 'Customer', value: `Customer ${item.customer_id}` },
              { label: 'Store', value: `Store ${item.store_id}` },
              { label: 'Paid Amount', value: `$${parseFloat(item.paid_amount || 0).toFixed(2)}` },
              { label: 'Total Items', value: item.total_items || '1' }
            ]
          }));
        }
      }
      
      console.log('Directly processed reports:', reportsData);
      
      // Try to find the report from the directly processed data
      if (reportsData && reportsData.length > 0) {
        const foundReport = reportsData.find(r => r.id == reportId);
        console.log('Found report from direct API:', foundReport);
        console.log('Looking for reportId:', reportId, 'type:', typeof reportId);
        console.log('Available report IDs:', reportsData.map(r => ({ id: r.id, type: typeof r.id })));
        if (foundReport) {
          setReport(foundReport);
          setLoading(false);
          return;
        }
      }

      // If still not found, create a summary report as fallback
      console.log('Report not found after direct API call, creating summary report');
      createSummaryReport();
    } catch (error) {
      console.error('Error loading report:', error);
      createSummaryReport();
    } finally {
      setLoading(false);
    }
  };

  const createSummaryReport = () => {
    // Create a summary report based on the report type and summary data
    const summaryReport = {
      id: reportId || 'summary',
      type: reportType || 'summary',
      title: `${reportType ? reportType.charAt(0).toUpperCase() + reportType.slice(1) : 'Summary'} Report`,
      date: new Date(),
      amount: summary?.totalSales || 0,
      count: summary?.totalOrders || 0,
      status: 'completed',
      description: `Overall ${reportType || 'summary'} report for the selected period`,
      // Add summary data as details
      totalSales: summary?.totalSales || 0,
      totalOrders: summary?.totalOrders || 0,
      totalDue: summary?.totalDue || 0,
      customerDues: summary?.customerDues || [],
      topProducts: summary?.topProducts || [],
      lowStockItems: summary?.lowStockItems || 0,
      details: [
        { label: 'Total Sales', value: formatCurrency(summary?.totalSales || 0) },
        { label: 'Total Orders', value: (summary?.totalOrders || 0).toString() },
        { label: 'Total Due', value: formatCurrency(summary?.totalDue || 0) },
        { label: 'Low Stock Items', value: (summary?.lowStockItems || 0).toString() },
      ],
      // Sample data for charts and tables
      data: [
        { name: 'Product A', quantity: 10, amount: 500 },
        { name: 'Product B', quantity: 8, amount: 400 },
        { name: 'Product C', quantity: 5, amount: 250 },
      ]
    };
    setReport(summaryReport);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${report?.title || 'Report'} - ${formatCurrency(report?.amount)}\nDate: ${formatDate(report?.date)}\nType: ${report?.type}`,
        title: report?.title || 'Report Details',
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share report");
    }
  };

  const handleExport = (format) => {
    Alert.alert(
      "Export Report",
      `Export as ${format.toUpperCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            Alert.alert("Success", `Report exported as ${format}`);
          },
        },
      ]
    );
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value || 0).toFixed(2)}`;
  };

  const getTypeIcon = () => {
    if (!report?.type) return { name: "file-document", color: "#6b7280", bg: "bg-gray-500" };
    
    switch (report.type.toLowerCase()) {
      case "sales":
        return { name: "cash", color: "#10b981", bg: "bg-green-500" };
      case "purchases":
        return { name: "cart", color: "#f59e0b", bg: "bg-orange-500" };
      case "inventory":
        return { name: "package", color: "#8b5cf6", bg: "bg-purple-500" };
      case "profits":
        return { name: "chart-line", color: "#3b82f6", bg: "bg-blue-500" };
      default:
        return { name: "file-document", color: "#6b7280", bg: "bg-gray-500" };
    }
  };

  const typeIcon = getTypeIcon();

  const tabs = [
    { id: "overview", label: "Overview", icon: "information" },
    { id: "details", label: "Details", icon: "format-list-bulleted" },
    { id: "charts", label: "Charts", icon: "chart-bar" },
    { id: "data", label: "Data", icon: "table" },
  ];

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading report details...
        </Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center p-5`}>
        <Icon name="file-document-remove" size={80} color="#9ca3af" />
        <Text className={`text-xl font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Report Not Found
        </Text>
        <Text className={`text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          The report you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-6 bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={isDarkMode ? ["#1f2937", "#111827"] : ["#ffffff", "#f3f4f6"]}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`w-10 h-10 rounded-2xl items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          >
            <Icon name="arrow-left" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
          </TouchableOpacity>
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={handleShare}
              className={`w-10 h-10 rounded-2xl items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <Icon name="share-variant" size={20} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleExport('pdf')}
              className={`w-10 h-10 rounded-2xl items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <Icon name="file-pdf-box" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className={`w-16 h-16 rounded-2xl ${typeIcon.bg} items-center justify-center mr-4`}>
            <Icon name={typeIcon.name} size={32} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {report.title || `${report.type} Report`}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="calendar" size={16} color="#9ca3af" />
              <Text className={`text-sm ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(report.date, 'MMMM DD, YYYY')}
              </Text>
              <View className="w-1 h-1 rounded-full bg-gray-400 mx-2" />
              <View className={`px-2 py-0.5 rounded-full ${typeIcon.bg}`}>
                <Text className="text-white text-xs capitalize">{report.type}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Bar */}
      <View className="px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-row items-center mr-2 px-3 py-1.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-blue-500'
                  : isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Icon
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? "#ffffff" : isDarkMode ? "#9CA3AF" : "#4b5563"}
              />
              <Text
                className={`ml-1.5 text-xs font-medium ${
                  activeTab === tab.id
                    ? 'text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {activeTab === "overview" && (
          <View className="pt-4 pb-24">
            {/* Report Information */}
            <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Report Information
              </Text>
              <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] mb-3">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Report ID
                  </Text>
                  <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    #{report.id}
                  </Text>
                </View>
                <View className="w-[48%] mb-3">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Type
                  </Text>
                  <Text className={`text-2xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {report.type}
                  </Text>
                </View>
                <View className="w-[48%]">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Amount
                  </Text>
                  <Text className="text-2xl font-bold text-green-600">
                    {formatCurrency(report.amount)}
                  </Text>
                </View>
                <View className="w-[48%]">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className={`w-2 h-2 rounded-full ${
                      report.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    } mr-2`} />
                    <Text className={`text-base font-medium capitalize ${
                      report.status === 'completed' ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      {report.status || 'Completed'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Report Details */}
            {report.details && report.details.length > 0 && (
              <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Report Details
                </Text>
                {report.details.map((detail, index) => (
                  <View key={index} className="flex-row justify-between py-2 border-b border-gray-200">
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {detail.label || `Detail ${index + 1}`}:
                    </Text>
                    <Text className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Description */}
            {report.description && (
              <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Description
                </Text>
                <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {report.description}
                </Text>
              </View>
            )}
            {/* Key Metrics */}
            <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Key Metrics
              </Text>
              <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] mb-3">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Amount
                  </Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {formatCurrency(report.amount)}
                  </Text>
                </View>
                <View className="w-[48%] mb-3">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Items
                  </Text>
                  <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {report.count || 0}
                  </Text>
                </View>
                <View className="w-[48%]">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Average Value
                  </Text>
                  <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formatCurrency(report.count ? report.amount / report.count : 0)}
                  </Text>
                </View>
                <View className="w-[48%]">
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className={`w-2 h-2 rounded-full ${
                      report.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    } mr-2`} />
                    <Text className={`text-base font-medium capitalize ${
                      report.status === 'completed' ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      {report.status || 'Completed'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            {report.description && (
              <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <Text className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Description
                </Text>
                <Text className={`text-base leading-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {report.description}
                </Text>
              </View>
            )}

            {/* Summary Cards */}
            <View className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Summary
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                    <Icon name="trending-up" size={24} color="#10b981" />
                  </View>
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Growth
                  </Text>
                  <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    +12.5%
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                    <Icon name="calendar-clock" size={24} color="#3b82f6" />
                  </View>
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Period
                  </Text>
                  <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Daily
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
                    <Icon name="star" size={24} color="#8b5cf6" />
                  </View>
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rating
                  </Text>
                  <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    4.8/5
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "details" && (
          <View className="pt-4 pb-24">
            {/* Detailed Information */}
            <View className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Report Details
              </Text>
              
              <View className="space-y-3">
                <DetailRow 
                  label="Report ID" 
                  value={report.id?.toString() || 'N/A'} 
                  isDarkMode={isDarkMode} 
                />
                <DetailRow 
                  label="Type" 
                  value={report.type || 'N/A'} 
                  isDarkMode={isDarkMode}
                  capitalize 
                />
                <DetailRow 
                  label="Date" 
                  value={formatDate(report.date, 'MMMM DD, YYYY')} 
                  isDarkMode={isDarkMode} 
                />
                <DetailRow 
                  label="Time" 
                  value={formatDate(report.date, 'HH:mm')} 
                  isDarkMode={isDarkMode} 
                />
                <DetailRow 
                  label="Amount" 
                  value={formatCurrency(report.amount)} 
                  isDarkMode={isDarkMode}
                  highlight 
                />
                <DetailRow 
                  label="Items Count" 
                  value={report.count?.toString() || '0'} 
                  isDarkMode={isDarkMode} 
                />
                <DetailRow 
                  label="Status" 
                  value={report.status || 'Completed'} 
                  isDarkMode={isDarkMode}
                  status 
                />
                <DetailRow 
                  label="Created By" 
                  value={report.createdBy || 'System'} 
                  isDarkMode={isDarkMode} 
                />
              </View>
            </View>

            {/* Additional Details */}
            {report.details && report.details.length > 0 && (
              <View className={`p-5 rounded-2xl mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Additional Information
                </Text>
                {report.details.map((detail, index) => (
                  <View key={index} className="flex-row justify-between py-2 border-b border-gray-200">
                    <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {detail.label}:
                    </Text>
                    <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "charts" && (
          <View className="pt-4 pb-24">
            {/* Chart Placeholders */}
            <View className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Performance Chart
              </Text>
              <View className={`h-64 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center`}>
                <Icon name="chart-line" size={48} color="#9ca3af" />
                <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Chart visualization will appear here
                </Text>
              </View>
            </View>

            <View className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Distribution
              </Text>
              <View className={`h-48 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} items-center justify-center`}>
                <Icon name="chart-pie" size={48} color="#9ca3af" />
                <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Pie chart will appear here
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "data" && (
          <View className="pt-4 pb-24">
            {/* Data Table */}
            <View className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <View className="flex-row justify-between items-center mb-4">
                <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Raw Data
                </Text>
                <TouchableOpacity
                  onPress={() => handleExport('excel')}
                  className="flex-row items-center bg-green-500 px-3 py-2 rounded-lg"
                >
                  <Icon name="microsoft-excel" size={16} color="#ffffff" />
                  <Text className="text-white text-sm ml-1">Export</Text>
                </TouchableOpacity>
              </View>

              {/* Table Header */}
              <View className={`flex-row p-3 rounded-lg mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Text className={`flex-1 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Item
                </Text>
                <Text className={`w-20 text-sm font-semibold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Quantity
                </Text>
                <Text className={`w-24 text-sm font-semibold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Amount
                </Text>
              </View>

              {/* Table Rows */}
              {report.data?.map((item, index) => (
                <View key={index} className="flex-row p-3 border-b border-gray-200">
                  <Text className={`flex-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.name || `Item ${index + 1}`}
                  </Text>
                  <Text className={`w-20 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.quantity || 0}
                  </Text>
                  <Text className={`w-24 text-sm text-right font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formatCurrency(item.amount || 0)}
                  </Text>
                </View>
              ))}

              {(!report.data || report.data.length === 0) && (
                <View className="items-center justify-center py-8">
                  <Icon name="table-off" size={48} color="#9ca3af" />
                  <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No data available
                  </Text>
                </View>
              )}

              {/* Table Footer */}
              {report.data && report.data.length > 0 && (
                <View className={`flex-row p-3 mt-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Text className={`flex-1 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Total
                  </Text>
                  <Text className={`w-20 text-sm font-semibold text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {report.data.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                  </Text>
                  <Text className={`w-24 text-sm font-semibold text-right text-blue-600`}>
                    {formatCurrency(report.data.reduce((sum, item) => sum + (item.amount || 0), 0))}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Helper Component for Detail Rows
const DetailRow = ({ label, value, isDarkMode, capitalize, highlight, status }) => {
  const getStatusColor = (val) => {
    const statusVal = val?.toLowerCase() || '';
    if (statusVal === 'completed') return 'text-green-500';
    if (statusVal === 'pending') return 'text-orange-500';
    if (statusVal === 'failed') return 'text-red-500';
    return isDarkMode ? 'text-white' : 'text-gray-800';
  };

  return (
    <View className="flex-row justify-between py-2 border-b border-gray-200">
      <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}:
      </Text>
      <Text 
        className={`text-sm font-medium ${
          highlight 
            ? 'text-blue-600 font-bold' 
            : status 
              ? getStatusColor(value)
              : capitalize 
                ? `capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`
                : isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        {value}
      </Text>
    </View>
  );
};

export default ReportDetailScreen;