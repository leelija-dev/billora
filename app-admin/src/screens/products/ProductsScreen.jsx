// screens/products/ProductsScreen.js
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductFilters from '../../components/products/ProductFilters';
import ProductList from '../../components/products/ProductList';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="bg-white px-4 pt-2 pb-4 border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-gray-800">Products</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="w-11 h-11 bg-gray-100 rounded-full items-center justify-center"
              onPress={handleFilterPress}
            >
              <Text className="text-xl">🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-11 h-11 bg-blue-500 rounded-full items-center justify-center"
              onPress={handleAddProduct}
            >
              <Text className="text-2xl text-white font-semibold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12"
          onPress={handleFilterPress}
        >
          <Text className="text-base mr-2 opacity-50">🔍</Text>
          <Text className="text-sm text-gray-400">
            Search products, SKU, category...
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ProductList />
      </View>

      <ProductFilters visible={showFilters} onClose={handleFiltersClose} />
    </SafeAreaView>
  );
};

export default ProductsScreen;