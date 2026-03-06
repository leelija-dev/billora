// components/products/ProductCard.js
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProductCard = ({ product, onUpdateStock }) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);
  const [currentStock, setCurrentStock] = useState(product?.stock || 0);
  const [showActions, setShowActions] = useState(false);
  const scaleValue = useState(new Animated.Value(1))[0];

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

  const profitMargin = cost ? (((price - cost) / price) * 100).toFixed(1) : 0;
  const isLowStock = currentStock <= reorderLevel;
  const isOutOfStock = currentStock <= 0;

  const handlePress = () => {
    navigation.navigate("ProductDetail", { productId: id });
  };

  const handleEdit = () => {
    setShowActions(false);
    navigation.navigate("AddProduct", { productId: id });
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert("Delete Product", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          // Handle delete
          Alert.alert("Success", "Product deleted successfully");
        },
        style: "destructive",
      },
    ]);
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStockUpdate = (increment) => {
    const newStock = currentStock + increment;
    if (newStock >= 0) {
      setCurrentStock(newStock);
      onUpdateStock?.(id, newStock);
    }
  };

  const getStockStatus = () => {
    if (isOutOfStock)
      return {
        label: "Out of Stock",
        color: "text-red-500",
        bg: "bg-red-50",
        icon: "alert-circle",
        gradient: ["#ef4444", "#dc2626"],
      };
    if (isLowStock)
      return {
        label: "Low Stock",
        color: "text-orange-500",
        bg: "bg-orange-50",
        icon: "alert",
        gradient: ["#f97316", "#ea580c"],
      };
    return {
      label: "In Stock",
      color: "text-green-500",
      bg: "bg-green-50",
      icon: "check-circle",
      gradient: ["#22c55e", "#16a34a"],
    };
  };

  const stockStatus = getStockStatus();

  const handleLongPress = () => {
    setShowActions(true);
  };

  return (
    <>
      <TouchableOpacity
        className="w-full bg-white rounded-2xl shadow-lg overflow-hidden"
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        {/* Image Section with Gradient Overlay */}
        <View className="relative h-40 bg-gray-100">
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Icon name="package-variant" size={40} color="#9ca3af" />
            </View>
          )}

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            className="absolute bottom-0 left-0 right-0 h-12"
          />

          {/* Badges */}
          <View className="absolute top-2 left-2 flex-col gap-1">
            {discount > 0 && (
              <LinearGradient
                colors={["#ef4444", "#dc2626"]}
                className="px-2 py-1 rounded-full"
                style={{borderRadius:100}}
              >
                <Text className="text-white text-xs font-bold">
                  -{discount}%
                </Text>
              </LinearGradient>
            )}
            {isNew && (
              <LinearGradient
                colors={["#3b82f6", "#2563eb"]}
                className="px-2 py-1 rounded-full"
                style={{borderRadius:100}}
              >
                <Text className="text-white text-xs font-bold">NEW</Text>
              </LinearGradient>
            )}
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 bg-white/95 w-8 h-8 rounded-full items-center justify-center shadow-md"
            onPress={handleFavoritePress}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={isFavorite ? "#ef4444" : "#6b7280"}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Stock Status Badge */}
          <View className="absolute bottom-2 left-2 right-2 flex-row justify-between items-center">
            <LinearGradient
              colors={stockStatus.gradient}
              className="px-2 py-1 rounded-full flex-row items-center"
              style={{borderRadius:100}}
            >
              <Icon name={stockStatus.icon} size={12} color="#ffffff" />
              <Text className="text-white text-xs font-medium ml-1">
                {stockStatus.label}
              </Text>
            </LinearGradient>

            <View className="bg-white/95 px-2 py-1 rounded-full">
              <Text className="text-xs font-bold">{currentStock}</Text>
            </View>
          </View>
        </View>

        {/* Product Details */}
        <View className="p-3">
          {/* SKU and Category */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-400 text-xs font-medium">
              #{sku || "N/A"}
            </Text>
            <View className="bg-blue-50 px-2 py-1 rounded-full">
              <Text className="text-blue-500 text-xs font-semibold">
                {category || "General"}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text
            className="text-base font-semibold text-gray-800 mb-1"
            numberOfLines={2}
          >
            {name}
          </Text>

          {/* Supplier & Location */}
          <View className="flex-row items-center mb-2">
            {supplier && (
              <>
                <Icon name="factory" size={12} color="#9ca3af" />
                <Text
                  className="text-xs text-gray-500 ml-1 mr-2"
                  numberOfLines={1}
                >
                  {supplier}
                </Text>
              </>
            )}
            {location && (
              <>
                <Icon name="map-marker" size={12} color="#9ca3af" />
                <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
                  {location}
                </Text>
              </>
            )}
          </View>

          {/* Price Section */}
          <View className="bg-gray-50 p-2 rounded-xl mb-2">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-gray-500">Price:</Text>
              <View className="flex-row items-baseline">
                <Text className="text-lg font-bold text-green-600">
                  ${price?.toFixed(2)}
                </Text>
                {originalPrice > 0 && (
                  <Text className="text-xs text-gray-400 line-through ml-2">
                    ${originalPrice?.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>

            {cost > 0 && (
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-500">Profit:</Text>
                <View className="flex-row items-center">
                  <Text className="text-sm text-green-600 font-medium">
                    ${(price - cost).toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-400 ml-1">
                    ({profitMargin}%)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-blue-100">
            <View className="flex-row gap-1">
              <TouchableOpacity
                className="w-8 h-8 bg-red-50 rounded-lg items-center justify-center"
                onPress={() => handleStockUpdate(-1)}
              >
                <Icon name="minus" size={18} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-8 h-8 bg-green-50 rounded-lg items-center justify-center"
                onPress={() => handleStockUpdate(1)}
              >
                <Icon name="plus" size={18} color="#22c55e" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-8 h-8 bg-blue-50 rounded-lg items-center justify-center"
              onPress={handleEdit}
            >
              <Icon name="pencil" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {/* Last Updated */}
          {lastUpdated && (
            <Text className="text-xs text-gray-300 text-right mt-1">
              {new Date(lastUpdated).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            <View className="items-center pt-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            <View className="p-5">
              <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Product Actions
              </Text>

              <TouchableOpacity
                className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-2"
                onPress={handleEdit}
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Icon name="pencil" size={22} color="#3b82f6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    Edit Product
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Modify product details
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 bg-red-50 rounded-xl"
                onPress={handleDelete}
              >
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                  <Icon name="delete" size={22} color="#ef4444" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    Delete Product
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Remove from inventory
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4 p-3 bg-gray-100 rounded-xl items-center"
                onPress={() => setShowActions(false)}
              >
                <Text className="text-base font-semibold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ProductCard;
