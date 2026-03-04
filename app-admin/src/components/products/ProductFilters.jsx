// components/products/ProductFilters.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';

const ProductFilters = ({ visible, onClose }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: null,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const categories = ['All', 'Apparel', 'Footwear', 'Accessories', 'Outerwear', 'Knitwear'];
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Stock', value: 'stock' },
    { label: 'Rating', value: 'rating' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: null,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
            <Text className="text-xl font-semibold text-gray-800">Filter Products</Text>
            <TouchableOpacity 
              onPress={onClose}
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
            >
              <Text className="text-lg text-gray-600">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="p-5 max-h-[70%]" showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">Search</Text>
              <Input
                value={filters.search}
                onChangeText={(value) => handleFilterChange('search', value)}
                placeholder="Product name or SKU..."
                leftIcon="🔍"
                className="bg-gray-50"
              />
            </View>

            {/* Category */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      className={`px-4 py-2 rounded-full ${
                        filters.category === cat ? 'bg-blue-500' : 'bg-gray-100'
                      }`}
                      onPress={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
                    >
                      <Text className={`text-sm ${
                        filters.category === cat ? 'text-white' : 'text-gray-600'
                      }`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">Price Range</Text>
              <View className="flex-row items-center gap-3">
                <Input
                  value={filters.minPrice}
                  onChangeText={(value) => handleFilterChange('minPrice', value)}
                  placeholder="Min"
                  keyboardType="numeric"
                  className="flex-1 bg-gray-50"
                />
                <Text className="text-lg text-gray-400">-</Text>
                <Input
                  value={filters.maxPrice}
                  onChangeText={(value) => handleFilterChange('maxPrice', value)}
                  placeholder="Max"
                  keyboardType="numeric"
                  className="flex-1 bg-gray-50"
                />
              </View>
            </View>

            {/* Stock Status */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">Stock Status</Text>
              <View className="flex-row gap-2">
                {[
                  { label: 'In Stock', value: true },
                  { label: 'Out of Stock', value: false },
                  { label: 'All', value: null },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    className={`flex-1 py-3 px-3 rounded-lg ${
                      filters.inStock === option.value ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => handleFilterChange('inStock', option.value)}
                  >
                    <Text className={`text-sm font-medium text-center ${
                      filters.inStock === option.value ? 'text-white' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">Sort By</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-1 min-w-[45%] py-3 px-3 rounded-lg ${
                      filters.sortBy === option.value ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => handleFilterChange('sortBy', option.value)}
                  >
                    <Text className={`text-sm font-medium text-center ${
                      filters.sortBy === option.value ? 'text-white' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Sort Order */}
              <View className="flex-row gap-2">
                {[
                  { label: 'Ascending', value: 'asc', icon: '↑' },
                  { label: 'Descending', value: 'desc', icon: '↓' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-lg ${
                      filters.sortOrder === option.value ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => handleFilterChange('sortOrder', option.value)}
                  >
                    <Text className={`text-lg mr-1 ${
                      filters.sortOrder === option.value ? 'text-white' : 'text-gray-600'
                    }`}>
                      {option.icon}
                    </Text>
                    <Text className={`text-sm font-medium ${
                      filters.sortOrder === option.value ? 'text-white' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 p-5 border-t border-gray-200">
            <Button
              title="Reset"
              onPress={resetFilters}
              variant="outline"
              className="flex-1"
            />
            <Button
              title="Apply Filters"
              onPress={applyFilters}
              className="flex-2"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductFilters;