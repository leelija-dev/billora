// components/customers/CustomerCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatRelativeTime } from '../../utils/helpers';

const CustomerCard = ({ customer, onPress, viewMode = 'grid' }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(customer);
    } else {
      navigation.navigate('CustomerDetail', { customerId: customer.id });
    }
  };

  const isActive = customer.status === 'active';

  if (viewMode === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <LinearGradient
            colors={isActive ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
            style={{borderRadius:100}}
          >
            <Text className="text-white text-xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-gray-900 font-bold text-lg">{customer.name}</Text>
                <Text className="text-gray-500 text-sm">{customer.email}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                isActive ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {customer.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="flex-row mt-3">
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Orders</Text>
                <Text className="text-gray-900 font-semibold">{customer.orderCount}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Total Spent</Text>
                <Text className="text-gray-900 font-semibold">${customer.totalSpent.toFixed(2)}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Since</Text>
                <Text className="text-gray-900 font-semibold text-xs">
                  {formatRelativeTime(customer.createdAt)}
                </Text>
              </View>
            </View>

            {customer.phone && (
              <View className="flex-row items-center mt-2">
                <Icon name="phone" size={14} color="#9ca3af" />
                <Text className="text-gray-500 text-xs ml-1">{customer.phone}</Text>
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
      className="w-[48%] mx-[1%] bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isActive ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
        className="w-16 h-16 rounded-2xl items-center justify-center self-center mb-3"
        style={{borderRadius:100}}
      >
        <Text className="text-white text-2xl font-bold">
          {customer.name.charAt(0).toUpperCase()}
        </Text>
      </LinearGradient>

      <Text className="text-gray-900 font-bold text-base text-center" numberOfLines={1}>
        {customer.name}
      </Text>
      <Text className="text-gray-500 text-xs text-center mb-2" numberOfLines={1}>
        {customer.email}
      </Text>

      <View className={`self-center px-3 py-1 rounded-full mb-3 ${
        isActive ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <Text className={`text-xs font-medium ${
          isActive ? 'text-green-600' : 'text-red-600'
        }`}>
          {customer.status.toUpperCase()}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <View className="items-center">
          <Text className="text-gray-400 text-xs">Orders</Text>
          <Text className="text-gray-900 font-bold">{customer.orderCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs">Spent</Text>
          <Text className="text-gray-900 font-bold">${customer.totalSpent.toFixed(0)}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center mt-2">
        <Icon name="clock-outline" size={12} color="#9ca3af" />
        <Text className="text-gray-400 text-xs ml-1">
          {formatRelativeTime(customer.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerCard;