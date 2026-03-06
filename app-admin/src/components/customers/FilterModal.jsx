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

const FilterModal = ({
  visible,
  onClose,
  filters: initialFilters,
  onApply,
  onClear,
}) => {
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
            <View className="bg-white rounded-t-3xl max-h-[90%]">
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
                  <Text className="text-gray-900 font-bold text-base mb-3">
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
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Icon
                          name={option.icon}
                          size={18}
                          color={
                            filters.status === option.id
                              ? "white"
                              : option.color
                          }
                        />
                        <Text
                          className={`ml-2 text-sm ${
                            filters.status === option.id
                              ? "text-white font-medium"
                              : "text-gray-700"
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
                  <Text className="text-gray-900 font-bold text-base mb-3">
                    Sort By
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-1">
                    {sortOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => updateFilter("sortBy", option.id)}
                        className={`flex-row items-center justify-between px-4 py-3 rounded-xl ${
                          filters.sortBy === option.id
                            ? "bg-white shadow-sm"
                            : ""
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Icon
                            name={option.icon}
                            size={20}
                            color={
                              filters.sortBy === option.id
                                ? "#6366F1"
                                : "#9ca3af"
                            }
                          />
                          <Text
                            className={`ml-3 ${
                              filters.sortBy === option.id
                                ? "text-indigo-600 font-medium"
                                : "text-gray-600"
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
                  <Text className="text-gray-900 font-bold text-base mb-3">
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
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-sm ${
                              filters.dateRange === option.id
                                ? "text-white font-medium"
                                : "text-gray-700"
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
                  <Text className="text-gray-900 font-bold text-base mb-3">
                    Filter by Metrics
                  </Text>

                  {/* Minimum Orders */}
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                      Minimum Orders
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                      <Icon name="clipboard-list" size={20} color="#9ca3af" />
                      <TextInput
                        className="flex-1 ml-3 py-3 text-gray-900"
                        placeholder="e.g., 5"
                        placeholderTextColor="#9ca3af"
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
                    <Text className="text-gray-600 text-sm mb-2">
                      Minimum Spent ($)
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                      <Icon name="currency-usd" size={20} color="#9ca3af" />
                      <TextInput
                        className="flex-1 ml-3 py-3 text-gray-900"
                        placeholder="e.g., 100"
                        placeholderTextColor="#9ca3af"
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
                  <Text className="text-gray-900 font-bold text-base mb-3">
                    Contact Preferences
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateFilter("hasPhone", !filters.hasPhone)}
                    className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          filters.hasPhone ? "bg-indigo-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          name="phone"
                          size={18}
                          color={filters.hasPhone ? "#6366F1" : "#9ca3af"}
                        />
                      </View>
                      <Text className="ml-3 text-gray-700 font-medium">
                        Has Phone Number
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-md border-2 ${
                        filters.hasPhone
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-gray-300"
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
                          filters.hasEmail ? "bg-indigo-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          name="email"
                          size={18}
                          color={filters.hasEmail ? "#6366F1" : "#9ca3af"}
                        />
                      </View>
                      <Text className="ml-3 text-gray-700 font-medium">
                        Has Email Address
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-md border-2 ${
                        filters.hasEmail
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-gray-300"
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
                  <View className="mb-6 p-4 bg-indigo-50 rounded-xl">
                    <Text className="text-indigo-600 font-semibold text-sm mb-2">
                      Active Filters:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {filters.status !== "all" && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
                            Status: {filters.status === 'active' ? 'Active' : filters.status === 'inactive' ? 'Inactive' : 'All'}
                          </Text>
                        </View>
                      )}
                      {filters.sortBy !== "newest" && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
                            Sort:{" "}
                            {
                              sortOptions.find((o) => o.id === filters.sortBy)
                                ?.label
                            }
                          </Text>
                        </View>
                      )}
                      {filters.dateRange !== "all" && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
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
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
                            Min Orders: {filters.minOrders}
                          </Text>
                        </View>
                      )}
                      {filters.minSpent && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
                            Min Spent: ${filters.minSpent}
                          </Text>
                        </View>
                      )}
                      {filters.hasPhone && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
                            Has Phone
                          </Text>
                        </View>
                      )}
                      {!filters.hasEmail && (
                        <View className="bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-indigo-600 text-xs">
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
                    className="flex-1 bg-gray-100 py-4 rounded-xl mr-2"
                  >
                    <Text className="text-gray-700 font-semibold text-center">
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