// components/products/ProductList.js
import React, { useState } from 'react';
import { FlatList, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from './ProductCard';

// Static product data
const STATIC_PRODUCTS = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    sku: 'TS-001-WHT',
    price: 29.99,
    cost: 18.50,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock: 45,
    category: 'Apparel',
    supplier: 'Fashion Corp',
    rating: 4.5,
    reviews: 128,
    discount: 40,
    isNew: false,
    isFavorite: false,
    location: 'Warehouse A - R12',
    reorderLevel: 20,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Slim Fit Jeans - Dark Blue',
    sku: 'JN-002-BLU',
    price: 79.99,
    cost: 45.00,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
    stock: 15,
    category: 'Apparel',
    supplier: 'Denim Co',
    rating: 4.2,
    reviews: 89,
    discount: 0,
    isNew: true,
    isFavorite: true,
    location: 'Warehouse A - R08',
    reorderLevel: 25,
    lastUpdated: '2024-01-20T14:20:00Z',
  },
  {
    id: '3',
    name: 'Leather Sneakers - White',
    sku: 'SN-003-WHT',
    price: 89.99,
    cost: 52.00,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    stock: 8,
    category: 'Footwear',
    supplier: 'Sporty Feet',
    rating: 4.8,
    reviews: 256,
    discount: 30,
    isNew: false,
    isFavorite: false,
    location: 'Warehouse B - F03',
    reorderLevel: 15,
    lastUpdated: '2024-01-18T09:15:00Z',
  },
  {
    id: '4',
    name: 'Wool Blend Overcoat - Camel',
    sku: 'OC-004-CML',
    price: 199.99,
    cost: 120.00,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500',
    stock: 5,
    category: 'Outerwear',
    supplier: 'Luxury Wear',
    rating: 4.6,
    reviews: 67,
    discount: 33,
    isNew: false,
    isFavorite: false,
    location: 'Warehouse C - H02',
    reorderLevel: 10,
    lastUpdated: '2024-01-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Cashmere Sweater - Gray',
    sku: 'SW-005-GRY',
    price: 129.99,
    cost: 75.00,
    originalPrice: 189.99,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500',
    stock: 12,
    category: 'Knitwear',
    supplier: 'Soft Touch',
    rating: 4.7,
    reviews: 145,
    discount: 31,
    isNew: true,
    isFavorite: true,
    location: 'Warehouse A - R15',
    reorderLevel: 8,
    lastUpdated: '2024-01-22T11:30:00Z',
  },
  {
    id: '6',
    name: 'Sports Watch - Black',
    sku: 'WT-006-BLK',
    price: 149.99,
    cost: 89.00,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 0,
    category: 'Accessories',
    supplier: 'TechTime',
    rating: 4.4,
    reviews: 203,
    discount: 0,
    isNew: false,
    isFavorite: false,
    location: 'Warehouse B - E10',
    reorderLevel: 5,
    lastUpdated: '2024-01-19T13:20:00Z',
  },
];

const ProductList = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(STATIC_PRODUCTS);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleEditProduct = (product) => {
    navigation.navigate('AddProduct', { productId: product.id });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const renderHeader = () => (
    <View className="flex-row flex-wrap justify-between mb-4 gap-2">
      <View className="flex-1 min-w-[22%] bg-white rounded-2xl p-3 items-center shadow-sm">
        <Text className="text-lg font-bold text-blue-500 mb-1">{products.length}</Text>
        <Text className="text-xs text-gray-500 text-center">Total Products</Text>
      </View>
      <View className="flex-1 min-w-[22%] bg-white rounded-2xl p-3 items-center shadow-sm">
        <Text className="text-lg font-bold text-green-500 mb-1">{totalStock}</Text>
        <Text className="text-xs text-gray-500 text-center">Total Stock</Text>
      </View>
      <View className="flex-1 min-w-[22%] bg-white rounded-2xl p-3 items-center shadow-sm">
        <Text className="text-lg font-bold text-yellow-500 mb-1">{lowStockCount}</Text>
        <Text className="text-xs text-gray-500 text-center">Low Stock</Text>
      </View>
      <View className="flex-1 min-w-[22%] bg-white rounded-2xl p-3 items-center shadow-sm">
        <Text className="text-lg font-bold text-purple-500 mb-1">${totalValue.toFixed(0)}</Text>
        <Text className="text-xs text-gray-500 text-center">Total Value</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={handleProductPress}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
        />
      )}
      ListHeaderComponent={renderHeader}
      contentContainerClassName="p-3 pb-6"
      columnWrapperClassName="justify-between"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-16">
          <Text className="text-6xl mb-4">📦</Text>
          <Text className="text-lg font-semibold text-gray-700 mb-2">No Products Found</Text>
          <Text className="text-sm text-gray-400 text-center">
            Tap the + button to add your first product
          </Text>
        </View>
      }
    />
  );
};

export default ProductList;