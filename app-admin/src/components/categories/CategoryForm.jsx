import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { categoriesAPI } from "../../api";
import { useCategoryStore } from "../../store/categoryStore";
import { useUIStore } from "../../store/uiStore";
import { useCategoryForm } from "../../hooks/useCategoryForm";
import Button from "../common/Button";
import Input from "../common/Input";

const CategoryForm = ({ categoryId }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { showSuccess, showError } = useUIStore();
  const { loading, error, saveCategory, clearError } = useCategoryForm(categoryId);

  const isEditing = categoryId || selectedCategory?.id;
  const currentUserId = user?.id?.toString() || "1";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      created_by: currentUserId,
      user_id: currentUserId,
    },
  });

  useEffect(() => {
    if (isEditing && selectedCategory) {
      reset({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
        is_active: selectedCategory.is_active ?? true,
        created_by: selectedCategory.created_by?.toString() || currentUserId,
        user_id: selectedCategory.user_id?.toString() || currentUserId,
      });
    }
  }, [isEditing, selectedCategory, reset, currentUserId]);

  const onSubmit = async (data) => {
    try {
      const categoryData = {
        userId: parseInt(data.user_id),
        name: data.name,
        description: data.description,
        isActive: data.is_active,
        createdBy: parseInt(data.created_by),
      };

      const result = await saveCategory(categoryData);
      
      if (result.success) {
        showSuccess(isEditing ? "Category updated successfully" : "Category created successfully");
        navigation.goBack();
      } else {
        showError(result.error || "Failed to save category");
      }
    } catch (error) {
      showError(error.message || "Failed to save category");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await categoriesAPI.delete(selectedCategory.id);
              showSuccess("Category deleted successfully");
              navigation.goBack();
            } catch (error) {
              showError(error.message || "Failed to delete category");
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (error) {
      showError(error);
      clearError();
    }
  }, [error, showError, clearError]);

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-16 pt-0"
        showsVerticalScrollIndicator={false}
      >
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
                label="Category Name *"
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

          {/* Active Status */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className={`text-base font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Category Status
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {watch("is_active") ? "Active" : "Inactive"}
              </Text>
            </View>
            <Controller
              control={control}
              name="is_active"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    value ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <View
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
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

        {/* Delete Button - Only show when editing */}
        {isEditing && (
          <TouchableOpacity
            onPress={handleDelete}
            className={`mt-4 py-4 rounded-xl border-2 ${
              isDarkMode 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-red-500 bg-red-50'
            }`}
          >
            <Text className="text-red-500 font-semibold text-center">
              Delete Category
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryForm;