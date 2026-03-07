// components/customers/FilterModal.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";

const FilterModal = ({
  visible,
  onClose,
  filters: initialFilters,
  onApply,
  onClear,
  isDarkMode: propIsDarkMode,
}) => {
  const { isDarkMode: storeIsDarkMode } = useThemeStore();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : storeIsDarkMode;
  const [filters, setFilters] = useState(initialFilters);

  // Update local filters when initialFilters change or modal opens
  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  const statusOptions = [
    {
      id: "all",
      label: "All Customers",
      icon: "account-group",
      color: "#6366F1",
    },
    {
      id: "active",
      label: "Active Only",
      icon: "check-circle",
      color: "#10B981",
    },
    {
      id: "inactive",
      label: "Inactive Only",
      icon: "close-circle",
      color: "#EF4444",
    },
  ];

  const sortOptions = [
    { id: "newest", label: "Newest First", icon: "sort-calendar-descending" },
    { id: "oldest", label: "Oldest First", icon: "sort-calendar-ascending" },
    {
      id: "name-asc",
      label: "Name (A-Z)",
      icon: "sort-alphabetical-ascending",
    },
    {
      id: "name-desc",
      label: "Name (Z-A)",
      icon: "sort-alphabetical-descending",
    },
    {
      id: "orders-high",
      label: "Most Orders",
      icon: "sort-numeric-descending",
    },
    { id: "spent-high", label: "Highest Spent", icon: "cash-multiple" },
  ];

  const dateRangeOptions = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "3months", label: "Last 3 Months" },
    { id: "year", label: "This Year" },
  ];

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      status: "all",
      sortBy: "newest",
      minOrders: "",
      minSpent: "",
      dateRange: "all",
      hasPhone: false,
      hasEmail: true,
    };
    setFilters(clearedFilters);
    onClear();
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Count active filters for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    if (filters.dateRange !== "all") count++;
    if (filters.minOrders && filters.minOrders !== "") count++;
    if (filters.minSpent && filters.minSpent !== "") count++;
    if (filters.hasPhone) count++;
    if (!filters.hasEmail) count++;
    return count;
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View className={`rounded-t-3xl max-h-[90%] ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Header with Gradient */}
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row justify-between items-center p-5 rounded-t-3xl"
              >
                <View className="flex-row items-center">
                  <Icon name="tune" size={24} color="white" />
                  <Text className="text-white font-bold text-xl ml-3">
                    Filter Customers
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {getActiveFilterCount() > 0 && (
                    <View className="bg-white/30 rounded-full px-2 py-1 mr-3">
                      <Text className="text-white text-xs font-bold">
                        {getActiveFilterCount()} active
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
                {/* Status Filter */}
                <View className="mb-6">
                  <Text className={`font-bold text-base mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Customer Status
                  </Text>
                  <View className="flex-row flex-wrap">
                    {statusOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => updateFilter("status", option.id)}
                        className={`flex-row items-center mr-3 mb-3 px-4 py-2.5 rounded-full border ${
                          filters.status === option.id
                            ? "bg-indigo-500 border-indigo-500"
                            : isDarkMode 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-white border-gray-200'
                        }`}
                      >
                        <Icon
                          name={option.icon}
                          size={18}
                          color={
                            filters.status === option.id
                              ? "white"
                              : isDarkMode ? '#9CA3AF' : option.color
                          }
                        />
                        <Text
                          className={`ml-2 text-sm ${
                            filters.status === option.id
                              ? "text-white font-medium"
                              : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sort By */}
                <View className="mb-6">
                  <Text className={`font-bold text-base mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Sort By
                  </Text>
                  <View className={`rounded-xl p-1 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    {sortOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => updateFilter("sortBy", option.id)}
                        className={`flex-row items-center justify-between px-4 py-3 rounded-xl ${
                          filters.sortBy === option.id
                            ? isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                            : ''
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Icon
                            name={option.icon}
                            size={20}
                            color={
                              filters.sortBy === option.id
                                ? "#6366F1"
                                : isDarkMode ? '#9CA3AF' : '#9ca3af'
                            }
                          />
                          <Text
                            className={`ml-3 ${
                              filters.sortBy === option.id
                                ? "text-indigo-600 dark:text-indigo-400 font-medium"
                                : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {option.label}
                          </Text>
                        </View>
                        {filters.sortBy === option.id && (
                          <Icon name="check" size={20} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Date Range */}
                <View className="mb-6">
                  <Text className={`font-bold text-base mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Registration Date
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row">
                      {dateRangeOptions.map((option) => (
                        <TouchableOpacity
                          key={option.id}
                          onPress={() => updateFilter("dateRange", option.id)}
                          className={`mr-2 px-4 py-2.5 rounded-full border ${
                            filters.dateRange === option.id
                              ? "bg-indigo-500 border-indigo-500"
                              : isDarkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-white border-gray-200'
                          }`}
                        >
                          <Text
                            className={`text-sm ${
                              filters.dateRange === option.id
                                ? "text-white font-medium"
                                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Numeric Filters */}
                <View className="mb-6">
                  <Text className={`font-bold text-base mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filter by Metrics
                  </Text>

                  {/* Minimum Orders */}
                  <View className="mb-4">
                    <Text className={`text-sm mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Minimum Orders
                    </Text>
                    <View className={`flex-row items-center rounded-xl px-4 border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <Icon name="clipboard-list" size={20} color="#9ca3af" />
                      <TextInput
                        className={`flex-1 ml-3 py-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        placeholder="e.g., 5"
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                        keyboardType="number-pad"
                        value={filters.minOrders}
                        onChangeText={(text) => updateFilter("minOrders", text)}
                      />
                      {filters.minOrders !== "" && (
                        <TouchableOpacity
                          onPress={() => updateFilter("minOrders", "")}
                        >
                          <Icon name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Minimum Spent */}
                  <View className="mb-4">
                    <Text className={`text-sm mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Minimum Spent ($)
                    </Text>
                    <View className={`flex-row items-center rounded-xl px-4 border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <Icon name="currency-usd" size={20} color="#9ca3af" />
                      <TextInput
                        className={`flex-1 ml-3 py-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        placeholder="e.g., 100"
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                        keyboardType="numeric"
                        value={filters.minSpent}
                        onChangeText={(text) => updateFilter("minSpent", text)}
                      />
                      {filters.minSpent !== "" && (
                        <TouchableOpacity
                          onPress={() => updateFilter("minSpent", "")}
                        >
                          <Icon name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>

                {/* Contact Preferences */}
                <View className="mb-6">
                  <Text className={`font-bold text-base mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Contact Preferences
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateFilter("hasPhone", !filters.hasPhone)}
                    className={`flex-row items-center justify-between py-3 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          filters.hasPhone 
                            ? (isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                        }`}
                      >
                        <Icon
                          name="phone"
                          size={18}
                          color={filters.hasPhone ? "#6366F1" : "#9ca3af"}
                        />
                      </View>
                      <Text className={`ml-3 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Has Phone Number
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-md border-2 ${
                        filters.hasPhone
                          ? "bg-indigo-500 border-indigo-500"
                          : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      } items-center justify-center`}
                    >
                      {filters.hasPhone && (
                        <Icon name="check" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => updateFilter("hasEmail", !filters.hasEmail)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          filters.hasEmail 
                            ? (isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                        }`}
                      >
                        <Icon
                          name="email"
                          size={18}
                          color={filters.hasEmail ? "#6366F1" : "#9ca3af"}
                        />
                      </View>
                      <Text className={`ml-3 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Has Email Address
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-md border-2 ${
                        filters.hasEmail
                          ? "bg-indigo-500 border-indigo-500"
                          : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      } items-center justify-center`}
                    >
                      {filters.hasEmail && (
                        <Icon name="check" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Active Filters Summary */}
                {getActiveFilterCount() > 0 && (
                  <View className={`mb-6 p-4 rounded-xl ${
                    isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                  }`}>
                    <Text className={`font-semibold text-sm mb-2 ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>
                      Active Filters:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {filters.status !== "all" && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Status: {filters.status === 'active' ? 'Active' : filters.status === 'inactive' ? 'Inactive' : 'All'}
                          </Text>
                        </View>
                      )}
                      {filters.sortBy !== "newest" && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Sort:{" "}
                            {
                              sortOptions.find((o) => o.id === filters.sortBy)
                                ?.label
                            }
                          </Text>
                        </View>
                      )}
                      {filters.dateRange !== "all" && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Date:{" "}
                            {
                              dateRangeOptions.find(
                                (o) => o.id === filters.dateRange,
                              )?.label
                            }
                          </Text>
                        </View>
                      )}
                      {filters.minOrders && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Min Orders: {filters.minOrders}
                          </Text>
                        </View>
                      )}
                      {filters.minSpent && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Min Spent: ${filters.minSpent}
                          </Text>
                        </View>
                      )}
                      {filters.hasPhone && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            Has Phone
                          </Text>
                        </View>
                      )}
                      {!filters.hasEmail && (
                        <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                          isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-xs ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                            No Email
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row mb-8">
                  <TouchableOpacity
                    onPress={handleClear}
                    className={`flex-1 py-4 rounded-xl mr-2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={`font-semibold text-center ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleApply}
                    className="flex-1 ml-2"
                  >
                    <LinearGradient
                      colors={["#6366F1", "#8B5CF6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="py-4 rounded-xl"
                      style={{ borderRadius: 13 }}
                    >
                      <Text className="text-white font-semibold text-center">
                        Apply{" "}
                        {getActiveFilterCount() > 0
                          ? `(${getActiveFilterCount()})`
                          : ""}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;