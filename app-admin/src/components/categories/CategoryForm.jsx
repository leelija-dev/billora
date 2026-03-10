import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { categoriesAPI } from "../../api";
import { useMutation } from "../../hooks/useApi";
import { useCategoryStore } from "../../store/categoryStore";
import { useUIStore } from "../../store/uiStore";
import Button from "../common/Button";
import Input from "../common/Input";

// Predefined color options for categories
const colorOptions = [
  { name: "Blue", colors: ["#3b82f6", "#2563eb"] },
  { name: "Purple", colors: ["#8b5cf6", "#7c3aed"] },
  { name: "Pink", colors: ["#ec4899", "#db2777"] },
  { name: "Orange", colors: ["#f97316", "#ea580c"] },
  { name: "Green", colors: ["#10b981", "#059669"] },
  { name: "Red", colors: ["#ef4444", "#dc2626"] },
  { name: "Indigo", colors: ["#6366f1", "#4f46e5"] },
  { name: "Cyan", colors: ["#06b6d4", "#0891b2"] },
];

// Icon options for categories
const iconOptions = [
  "shape", "tshirt-crew", "shoe-sneaker", "watch", "jacket", 
  "bag-personal", "sunglasses", "hat-fedora", "diamond", 
  "cellphone", "laptop", "headphones", "camera", "book",
  "home", "food", "cup", "gift", "flower", "star"
];

const CategoryForm = ({ categoryId }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { selectedCategory, updateCategory, addCategory } = useCategoryStore();
  const { showSuccess, showError } = useUIStore();

  const isEditing = categoryId || selectedCategory?.id;
  const [loading, setLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState(colorOptions[0].colors);
  const [selectedIcon, setSelectedIcon] = useState("shape");
  const [isActive, setIsActive] = useState(true);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      meta_title: "",
      meta_description: "",
      slug: "",
      is_active: true,
      created_by: "1",
    },
  });

  const { mutate: createCategory } = useMutation(categoriesAPI.createCategory);
  const { mutate: updateCategoryApi } = useMutation((data) =>
    categoriesAPI.updateCategory(categoryId || selectedCategory?.id, data),
  );

  useEffect(() => {
    if (isEditing && selectedCategory) {
      reset({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
        meta_title: selectedCategory.meta_title || "",
        meta_description: selectedCategory.meta_description || "",
        slug: selectedCategory.slug || "",
        is_active: selectedCategory.is_active ?? true,
        created_by: selectedCategory.created_by || "1",
      });
      setSelectedColors(selectedCategory.colors || colorOptions[0].colors);
      setSelectedIcon(selectedCategory.icon || "shape");
      setIsActive(selectedCategory.is_active ?? true);
    }
  }, [isEditing, selectedCategory, reset]);

  const generateSlug = () => {
    const name = watch("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const categoryData = {
        ...data,
        colors: selectedColors,
        icon: selectedIcon,
        is_active: isActive,
        created_by: data.created_by || "1",
      };

      if (isEditing) {
        const response = await updateCategoryApi(categoryData);
        updateCategory(selectedCategory.id, response.category);
        showSuccess("Category updated successfully");
      } else {
        const response = await createCategory(categoryData);
        addCategory(response.category);
        showSuccess("Category created successfully");
      }

      navigation.goBack();
    } catch (error) {
      showError(error.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? Products in this category will become uncategorized.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await categoriesAPI.deleteCategory(selectedCategory.id);
              navigation.goBack();
              showSuccess("Category deleted successfully");
            } catch (error) {
              showError(error.message || "Failed to delete category");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-16 pt-0"
        showsVerticalScrollIndicator={false}
      >
        {/* Category Preview */}
        <LinearGradient
          colors={selectedColors}
          className="rounded-2xl p-6 mb-6 mt-4"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mb-3">
              <Icon name={selectedIcon} size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-xl font-bold">
              {watch("name") || "Category Name"}
            </Text>
            <Text className="text-white/80 text-sm mt-1 text-center">
              {watch("description") || "Category description will appear here"}
            </Text>
          </View>
        </LinearGradient>

        {/* Basic Information Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Basic Information
          </Text>

          {/* Category Name */}
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Category name is required",
              maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Category Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter category name"
                error={errors.name?.message}
                leftIcon="shape"
                containerClassName="mb-4"
                isDarkMode={isDarkMode}
              />
            )}
          />

          {/* Slug */}
          <View className="mb-4">
            <Controller
              control={control}
              name="slug"
              rules={{
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Slug can only contain lowercase letters, numbers, and hyphens",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Slug"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="category-url-slug"
                  error={errors.slug?.message}
                  leftIcon="link"
                  isDarkMode={isDarkMode}
                />
              )}
            />
            <TouchableOpacity
              onPress={generateSlug}
              className="absolute right-3 top-9"
            >
              <Text className="text-blue-500 text-sm">Generate</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: 500,
                message: "Description must be less than 500 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter category description"
                multiline
                numberOfLines={4}
                error={errors.description?.message}
                leftIcon="text"
                containerClassName="mb-4"
                inputClassName="h-24"
                isDarkMode={isDarkMode}
              />
            )}
          />
        </View>

        {/* Appearance Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Appearance
          </Text>

          {/* Color Selection */}
          <View className="mb-4">
            <Text className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Category Color
            </Text>
            <View className="flex-row flex-wrap">
              {colorOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColors(option.colors)}
                  className={`mr-2 mb-2 rounded-xl overflow-hidden border-2 ${
                    selectedColors === option.colors
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                >
                  <LinearGradient
                    colors={option.colors}
                    className="w-12 h-12"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon Selection */}
          <View>
            <Text className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Category Icon
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {iconOptions.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedIcon(icon)}
                  className={`mr-2 rounded-xl p-3 ${
                    selectedIcon === icon
                      ? 'bg-blue-500'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    name={icon}
                    size={24}
                    color={selectedIcon === icon ? '#ffffff' : isDarkMode ? '#9CA3AF' : '#4b5563'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* SEO Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            SEO Settings
          </Text>

          {/* Meta Title */}
          <Controller
            control={control}
            name="meta_title"
            rules={{
              maxLength: {
                value: 60,
                message: "Meta title should be less than 60 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Meta Title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="SEO title for category"
                error={errors.meta_title?.message}
                leftIcon="seo"
                containerClassName="mb-4"
                isDarkMode={isDarkMode}
              />
            )}
          />

          {/* Meta Description */}
          <Controller
            control={control}
            name="meta_description"
            rules={{
              maxLength: {
                value: 160,
                message: "Meta description should be less than 160 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Meta Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="SEO description for category"
                multiline
                numberOfLines={3}
                error={errors.meta_description?.message}
                leftIcon="text"
                inputClassName="h-20"
                isDarkMode={isDarkMode}
              />
            )}
          />
        </View>

        {/* Status Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Status
          </Text>

          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            className={`flex-row items-center justify-between p-3 rounded-xl border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center">
              <Icon 
                name={isActive ? "check-circle" : "close-circle"} 
                size={24} 
                color={isActive ? "#10b981" : "#ef4444"} 
              />
              <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {isActive ? "Category is Active" : "Category is Inactive"}
              </Text>
            </View>
            <View className={`w-12 h-6 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <View className={`w-6 h-6 rounded-full bg-white shadow-md transform ${
                isActive ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <Button
          title={isEditing ? "Update Category" : "Create Category"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid || loading}
          className="bg-blue-500 py-4 rounded-xl"
          textClassName="text-white font-semibold text-lg"
        />

        {/* Delete Button for Edit Mode */}
        {isEditing && (
          <TouchableOpacity
            onPress={handleDelete}
            className="mt-4 py-4 rounded-xl bg-red-500 items-center"
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg">Delete Category</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryForm;