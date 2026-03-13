// components/customers/CustomerCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '../../store/themeStore';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const CustomerCard = ({ customer, onPress, viewMode = 'grid' }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();

  const handlePress = () => {
    if (onPress) {
      onPress(customer);
    } else if (navigation) {
      navigation.navigate('CustomerDetail', { customerId: customer.id });
    }
  };

  const isActive = customer.status === 'active';

  if (viewMode === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`rounded-2xl p-4 mb-3 shadow-sm border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <LinearGradient
            colors={isActive ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
            style={{ borderRadius: 100 }}
          >
            <Text className="text-white text-xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className={`font-bold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{customer.name}</Text>
                <Text className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{customer.email || 'No email'}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                isActive 
                  ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-100')
                  : (isDarkMode ? 'bg-red-900/30' : 'bg-red-100')
              }`}>
                <Text className={`text-xs font-medium ${
                  isActive 
                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {customer.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="flex-row mt-3">
              <View className="flex-1">
                <Text className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Orders</Text>
                <Text className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{customer.orderCount}</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Total Spent</Text>
                <Text className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>${customer.totalSpent.toFixed(2)}</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Since</Text>
                <Text className={`font-semibold text-xs ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatRelativeTime(customer.createdAt)}
                </Text>
              </View>
            </View>

            {customer.phone && (
              <View className="flex-row items-center mt-2">
                <Icon name="phone" size={14} color="#9ca3af" />
                <Text className={`text-xs ml-1 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>{customer.phone}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid view
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`w-full mx-[1%] rounded-2xl p-4 mb-3 shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isActive ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
        className="w-16 h-16 rounded-2xl items-center justify-center self-center mb-3"
        style={{ borderRadius: 100 }}
      >
        <Text className="text-white text-2xl font-bold">
          {customer.name.charAt(0).toUpperCase()}
        </Text>
      </LinearGradient>

      <Text className={`font-bold text-base text-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`} numberOfLines={1}>
        {customer.name}
      </Text>
      <Text className={`text-xs text-center mb-2 ${
        isDarkMode ? 'text-gray-500' : 'text-gray-500'
      }`} numberOfLines={1}>
        {customer.email || 'No email'}
      </Text>

      <View className={`self-center px-3 py-1 rounded-full mb-3 ${
        isActive 
          ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-100')
          : (isDarkMode ? 'bg-red-900/30' : 'bg-red-100')
      }`}>
        <Text className={`text-xs font-medium ${
          isActive 
            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
            : (isDarkMode ? 'text-red-400' : 'text-red-600')
        }`}>
          {customer.status.toUpperCase()}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <View className="items-center">
          <Text className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>Orders</Text>
          <Text className={`font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{customer.orderCount}</Text>
        </View>
        <View className="items-center">
          <Text className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>Spent</Text>
          <Text className={`font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>${customer.totalSpent.toFixed(0)}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center mt-2">
        <Icon name="clock-outline" size={12} color="#9ca3af" />
        <Text className={`text-xs ml-1 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {formatRelativeTime(customer.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerCard;