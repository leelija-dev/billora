// components/products/ProductForm.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { productsAPI } from "../../api";
import { useMutation } from "../../hooks/useApi";
import { useProductStore } from "../../store/productStore";
import { useUIStore } from "../../store/uiStore";
import Button from "../common/Button";
import Input from "../common/Input";

const categories = [
  { id: "apparel", label: "Apparel", icon: "tshirt-crew" },
  { id: "footwear", label: "Footwear", icon: "shoe-sneaker" },
  { id: "accessories", label: "Accessories", icon: "watch" },
  { id: "outerwear", label: "Outerwear", icon: "jacket" },
  { id: "knitwear", label: "Knitwear", icon: "knitting" },
  { id: "electronics", label: "Electronics", icon: "laptop" },
];

const ProductForm = ({ productId }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useThemeStore();
  const { selectedProduct, updateProduct, addProduct } = useProductStore();
  const { showSuccess, showError } = useUIStore();

  const isEditing = productId || selectedProduct?.id;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

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
      price: "",
      originalPrice: "",
      sku: "",
      category: "",
      stock: "",
      minStock: "",
      images: [],
    },
  });

  const { mutate: createProduct } = useMutation(productsAPI.createProduct);
  const { mutate: updateProductApi } = useMutation((data) =>
    productsAPI.updateProduct(
      productId || selectedProduct?.id,
      data,
    ),
  );

  useEffect(() => {
    if (isEditing && selectedProduct) {
      reset({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price?.toString() || "",
        originalPrice: selectedProduct.originalPrice?.toString() || "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock?.toString() || "",
        minStock: selectedProduct.minStock?.toString() || "",
      });
      setSelectedCategory(selectedProduct.category?.toLowerCase() || "");
    }
  }, [isEditing, selectedProduct, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const productData = {
        ...data,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice
          ? parseFloat(data.originalPrice)
          : null,
        stock: parseInt(data.stock),
        minStock: data.minStock ? parseInt(data.minStock) : 0,
        category: selectedCategory,
      };

      if (isEditing) {
        const response = await updateProductApi(productData);
        updateProduct(selectedProduct.id, response.product);
        showSuccess("Product updated successfully");
      } else {
        const response = await createProduct(productData);
        addProduct(response.product);
        showSuccess("Product created successfully");
      }

      navigation.goBack();
    } catch (error) {
      showError(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await productsAPI.deleteProduct(selectedProduct.id);
              navigation.goBack();
              showSuccess("Product deleted successfully");
            } catch (error) {
              showError(error.message || "Failed to delete product");
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
        {/* Image Upload Section */}
        <TouchableOpacity className="mb-6">
          <View className={`w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed items-center justify-center ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-200 border-gray-300'
          }`}>
            <Icon name="camera-plus" size={40} color="#9ca3af" />
            <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Add Product Images
            </Text>
          </View>
        </TouchableOpacity>

        {/* Category Selection */}
        <View className="mb-6">
          <Text className={`text-base font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`items-center px-4 py-3 rounded-xl border ${
                    selectedCategory === cat.id
                      ? "bg-blue-500 border-blue-500"
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon
                    name={cat.icon}
                    size={24}
                    color={selectedCategory === cat.id ? "#ffffff" : (isDarkMode ? '#9CA3AF' : '#6b7280')}
                  />
                  <Text
                    className={`text-xs mt-1 ${
                      selectedCategory === cat.id
                        ? "text-white"
                        : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Form Fields */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Basic Information
          </Text>

          <Controller
            control={control}
            name="name"
            rules={{
              required: "Product name is required",
              maxLength: {
                value: 100,
                message: "Name must be less than 100 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Product Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product name"
                error={errors.name?.message}
                leftIcon="tag"
                containerClassName="mb-4"
                isDarkMode={isDarkMode}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: 1000,
                message: "Description must be less than 1000 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product description"
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

          <Controller
            control={control}
            name="sku"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="SKU"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter SKU (optional)"
                error={errors.sku?.message}
                leftIcon="barcode"
                containerClassName="mb-4"
                isDarkMode={isDarkMode}
              />
            )}
          />
        </View>

        {/* Pricing Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Pricing
          </Text>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="price"
                rules={{
                  required: "Price is required",
                  validate: {
                    positive: (value) =>
                      parseFloat(value) > 0 || "Price must be greater than 0",
                    numeric: (value) =>
                      !isNaN(value) || "Price must be a number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Selling Price"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.price?.message}
                    leftIcon="currency-usd"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name="originalPrice"
                rules={{
                  validate: {
                    numeric: (value) =>
                      !value ||
                      !isNaN(value) ||
                      "Original price must be a number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Original Price"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.originalPrice?.message}
                    leftIcon="currency-usd"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>
          </View>

          {watch("price") && watch("originalPrice") && (
            <LinearGradient
              colors={isDarkMode ? ["#1e3a8a", "#1e40af"] : ["#f0f9ff", "#e0f2fe"]}
              className="p-3 rounded-xl"
            >
              <Text className={isDarkMode ? "text-blue-400" : "text-blue-800"}>
                Discount:{" "}
                {(
                  ((watch("originalPrice") - watch("price")) /
                    watch("originalPrice")) *
                  100
                ).toFixed(1)}
                %
              </Text>
            </LinearGradient>
          )}
        </View>

        {/* Inventory Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Inventory
          </Text>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="stock"
                rules={{
                  required: "Stock is required",
                  validate: {
                    positive: (value) =>
                      parseInt(value) >= 0 || "Stock must be 0 or greater",
                    integer: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Stock must be a whole number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Current Stock"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0"
                    keyboardType="number-pad"
                    error={errors.stock?.message}
                    leftIcon="package"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name="minStock"
                rules={{
                  validate: {
                    positive: (value) =>
                      !value ||
                      parseInt(value) >= 0 ||
                      "Min stock must be 0 or greater",
                    integer: (value) =>
                      !value ||
                      Number.isInteger(Number(value)) ||
                      "Min stock must be a whole number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Reorder Level"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0"
                    keyboardType="number-pad"
                    error={errors.minStock?.message}
                    leftIcon="alert"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title={isEditing ? "Update Product" : "Create Product"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid || loading}
          className="bg-blue-500 py-4 rounded-xl"
          textClassName="text-white font-semibold text-lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductForm;