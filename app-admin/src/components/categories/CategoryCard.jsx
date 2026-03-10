import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";

const CategoryCard = ({ category, onUpdate }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const [isFavorite, setIsFavorite] = useState(category?.isFavorite || false);
  const [showActions, setShowActions] = useState(false);
  const scaleValue = useState(new Animated.Value(1))[0];

  if (!category) return null;

  const {
    id,
    name,
    description,
    icon,
    color,
    productCount,
    totalValue,
    image,
    is_active,
    created_at,
  } = category;

  const handlePress = () => {
    navigation.navigate("CategoryDetail", { categoryId: id });
  };

  const handleEdit = () => {
    setShowActions(false);
    navigation.navigate("AddCategory", { categoryId: id });
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert("Delete Category", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert("Success", "Category deleted successfully");
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

  const handleLongPress = () => {
    setShowActions(true);
  };

  // Generate gradient colors based on category or default
  const gradientColors = color || ["#3b82f6", "#2563eb"];

  return (
    <>
      <TouchableOpacity
        className={`w-full rounded-2xl shadow-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={gradientColors}
          className="p-4"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
                <Icon name={icon || "shape"} size={24} color="#ffffff" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white text-lg font-bold" numberOfLines={1}>
                  {name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="bg-white/20 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-xs">
                      {productCount || 0} Products
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Favorite Button */}
            <TouchableOpacity
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/20'
              }`}
              onPress={handleFavoritePress}
            >
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <Icon
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={16}
                  color={isFavorite ? "#ef4444" : "#ffffff"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Body */}
        <View className="p-4">
          {/* Description */}
          {description && (
            <Text
              className={`text-sm mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          {/* Stats Grid */}
          <View className="flex-row mb-3">
            <View className="flex-1">
              <Text className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Total Value
              </Text>
              <Text className={`text-base font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                ${(totalValue || 0).toLocaleString()}
              </Text>
            </View>

            <View className="flex-1">
              <Text className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Status
              </Text>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-1 ${
                  is_active ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <Text className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className={`flex-row justify-between items-center pt-3 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <Text className={`text-xs ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Created {new Date(created_at).toLocaleDateString()}
            </Text>

            <TouchableOpacity
              className={`px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}
              onPress={() => navigation.navigate("Products", { categoryId: id })}
            >
              <Text className="text-blue-500 text-xs font-medium">
                View Products
              </Text>
            </TouchableOpacity>
          </View>
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
          <View className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="items-center pt-2">
              <View className={`w-12 h-1 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
            </View>

            <View className="p-5">
              <Text className={`text-lg font-semibold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Category Actions
              </Text>

              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl mb-2 ${
                  isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
                onPress={handleEdit}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                }`}>
                  <Icon name="pencil" size={22} color="#3b82f6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`text-base font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Edit Category
                  </Text>
                  <Text className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Modify category details
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl mb-2 ${
                  isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
                }`}
                onPress={() => navigation.navigate("Products", { categoryId: id })}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <Icon name="package-variant" size={22} color="#22c55e" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`text-base font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    View Products
                  </Text>
                  <Text className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    See all products in this category
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl ${
                  isDarkMode ? 'bg-red-900/30' : 'bg-red-50'
                }`}
                onPress={handleDelete}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  isDarkMode ? 'bg-red-900/50' : 'bg-red-100'
                }`}>
                  <Icon name="delete" size={22} color="#ef4444" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`text-base font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Delete Category
                  </Text>
                  <Text className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Remove from categories
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`mt-4 p-3 rounded-xl items-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                onPress={() => setShowActions(false)}
              >
                <Text className={`text-base font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
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

export default CategoryCard;