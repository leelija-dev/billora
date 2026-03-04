// components/products/ProductCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = ({ product, onPress, onEdit, onDelete, onUpdateStock }) => {
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);
  const [currentStock, setCurrentStock] = useState(product?.stock || 0);

  if (!product) return null;

  const {
    id,
    name,
    sku,
    price,
    cost,
    originalPrice,
    image,
    category,
    supplier,
    rating,
    reviews,
    discount,
    isNew,
    lastUpdated,
    location,
    reorderLevel,
  } = product;

  const profitMargin = cost ? ((price - cost) / price * 100).toFixed(1) : 0;
  const isLowStock = currentStock <= reorderLevel;
  const isOutOfStock = currentStock <= 0;

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handleStockUpdate = (increment) => {
    const newStock = currentStock + increment;
    if (newStock >= 0) {
      setCurrentStock(newStock);
      onUpdateStock?.(id, newStock);
    }
  };

  return (
    <TouchableOpacity 
      className="w-[47%] bg-white rounded-2xl mx-1 my-2 shadow-lg overflow-hidden"
      onPress={() => onPress?.(product)}
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View className="relative h-40 bg-gray-100">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-4xl text-gray-300">📦</Text>
          </View>
        )}
        
        {/* Badges */}
        <View className="absolute top-2 left-2 flex-col gap-1">
          {discount > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">-{discount}%</Text>
            </View>
          )}
          {isNew && (
            <View className="bg-green-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">NEW</Text>
            </View>
          )}
          {isLowStock && !isOutOfStock && (
            <View className="bg-yellow-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">⚠️ LOW</Text>
            </View>
          )}
          {isOutOfStock && (
            <View className="bg-gray-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">OUT</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity 
          className="absolute top-2 right-2 bg-white/95 w-8 h-8 rounded-full items-center justify-center shadow-sm"
          onPress={handleFavoritePress}
        >
          <Text className="text-lg">{isFavorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View className="p-3">
        {/* SKU and Category */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 text-xs font-medium">#{sku || 'N/A'}</Text>
          <View className="bg-blue-50 px-2 py-1 rounded-full">
            <Text className="text-blue-500 text-xs font-semibold">{category || 'General'}</Text>
          </View>
        </View>

        {/* Product Name */}
        <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
          {name}
        </Text>

        {/* Supplier */}
        {supplier && (
          <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
            🏭 {supplier}
          </Text>
        )}

        {/* Location */}
        {location && (
          <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
            📍 {location}
          </Text>
        )}

        {/* Price Section */}
        <View className="bg-gray-50 p-2 rounded-xl mb-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-500">Selling:</Text>
            <Text className="text-base font-bold text-green-600">{formatCurrency(price)}</Text>
          </View>
          
          {cost > 0 && (
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-gray-500">Cost:</Text>
              <Text className="text-sm text-red-500 font-medium">{formatCurrency(cost)}</Text>
            </View>
          )}

          {originalPrice > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-gray-500">MRP:</Text>
              <Text className="text-xs text-gray-400 line-through">{formatCurrency(originalPrice)}</Text>
            </View>
          )}
        </View>

        {/* Profit Margin */}
        {cost > 0 && (
          <View className="mb-2">
            <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.min(profitMargin, 100)}%` }}
              />
            </View>
            <Text className="text-xs text-green-600 font-medium mt-1">
              Margin: {profitMargin}% 
              {profitMargin > 30 ? ' 🚀' : profitMargin > 15 ? ' 📈' : ' 📉'}
            </Text>
          </View>
        )}

        {/* Stock Management */}
        <View className="flex-row justify-between items-center bg-gray-100 p-2 rounded-xl mb-2">
          <View className="flex-row items-center gap-1">
            <Text className="text-xs text-gray-600">Stock:</Text>
            <Text className={`text-sm font-semibold ${
              isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-600' : 'text-gray-800'
            }`}>
              {currentStock} units
            </Text>
            {reorderLevel > 0 && (
              <Text className="text-xs text-gray-400">(min: {reorderLevel})</Text>
            )}
          </View>

          {/* Quick Stock Update */}
          <View className="flex-row gap-1">
            <TouchableOpacity 
              className="w-7 h-7 bg-red-100 rounded-full items-center justify-center"
              onPress={() => handleStockUpdate(-1)}
            >
              <Text className="text-lg font-semibold text-gray-600">−</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-7 h-7 bg-green-100 rounded-full items-center justify-center"
              onPress={() => handleStockUpdate(1)}
            >
              <Text className="text-lg font-semibold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rating */}
        {rating > 0 && (
          <View className="flex-row items-center mb-1">
            <Text className="text-xs mr-1">⭐</Text>
            <Text className="text-xs font-semibold text-yellow-600 mr-1">{rating.toFixed(1)}</Text>
            <Text className="text-xs text-gray-400">({reviews || 0})</Text>
          </View>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <Text className="text-xs text-gray-300 text-right mt-1">
            Updated: {new Date(lastUpdated).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;