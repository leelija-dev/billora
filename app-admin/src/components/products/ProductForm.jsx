// components/products/ProductForm.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { productsAPI } from "../../api";
import { useMutation } from "../../hooks/useApi";
import { useProductStore } from "../../store/productStore";
import { useUIStore } from "../../store/uiStore";
import Button from "../common/Button";
import Input from "../common/Input";

// Mock data for dropdowns - Replace with actual API calls
const categories = [
  { id: "1", name: "Apparel", icon: "tshirt-crew" },
  { id: "2", name: "Footwear", icon: "shoe-sneaker" },
  { id: "3", name: "Accessories", icon: "watch" },
  { id: "4", name: "Outerwear", icon: "jacket" },
  { id: "5", name: "Knitwear", icon: "knitting" },
  { id: "6", name: "Electronics", icon: "laptop" },
];

const brands = [
  { id: "1", name: "Nike" },
  { id: "2", name: "Adidas" },
  { id: "3", name: "Puma" },
  { id: "4", name: "Zara" },
  { id: "5", name: "H&M" },
];

const units = [
  { id: "1", name: "Piece", code: "pc" },
  { id: "2", name: "Kilogram", code: "kg" },
  { id: "3", name: "Gram", code: "g" },
  { id: "4", name: "Liter", code: "l" },
  { id: "5", name: "Meter", code: "m" },
  { id: "6", name: "Box", code: "box" },
  { id: "7", name: "Pair", code: "pr" },
  { id: "8", name: "Dozen", code: "dz" },
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
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // Dropdown visibility states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

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
      sku: "",
      description: "",
      selling_price: "",
      purchase_price: "",
      gst_percentage: "",
      discount_percentage: "",
      unit_amount: "",
      is_active: true,
      created_by: "1", // This should come from auth store
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
        sku: selectedProduct.sku || "",
        description: selectedProduct.description || "",
        selling_price: selectedProduct.selling_price?.toString() || "",
        purchase_price: selectedProduct.purchase_price?.toString() || "",
        gst_percentage: selectedProduct.gst_percentage?.toString() || "",
        discount_percentage: selectedProduct.discount_percentage?.toString() || "",
        unit_amount: selectedProduct.unit_amount?.toString() || "",
        is_active: selectedProduct.is_active ?? true,
        created_by: selectedProduct.created_by || "1",
      });
      setSelectedCategory(selectedProduct.category_id || "");
      setSelectedBrand(selectedProduct.brand_id || "");
      setSelectedUnit(selectedProduct.unit_id || "");
      setIsActive(selectedProduct.is_active ?? true);
    }
  }, [isEditing, selectedProduct, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const productData = {
        ...data,
        selling_price: parseFloat(data.selling_price) || 0,
        purchase_price: parseFloat(data.purchase_price) || 0,
        gst_percentage: parseFloat(data.gst_percentage) || 0,
        discount_percentage: parseFloat(data.discount_percentage) || 0,
        unit_amount: parseFloat(data.unit_amount) || 1,
        category_id: selectedCategory,
        brand_id: selectedBrand,
        unit_id: selectedUnit,
        is_active: isActive,
        created_by: data.created_by || "1",
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

  const renderDropdown = (items, selectedValue, onSelect, onClose, title) => (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1 justify-center items-center p-5">
          <View className={`w-full max-h-96 rounded-xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className={`p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Text className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Select {title}
              </Text>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  } ${selectedValue === item.id ? isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50' : ''}`}
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                >
                  <Text className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-16 pt-0"
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload Section - Keep as is */}
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

        {/* Basic Information Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Basic Information
          </Text>

          {/* Product Name */}
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

          {/* SKU */}
          <Controller
            control={control}
            name="sku"
            rules={{
              required: "SKU is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="SKU"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter SKU"
                error={errors.sku?.message}
                leftIcon="barcode"
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
        </View>

        {/* Category, Brand, Unit Section */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Classification
          </Text>

          {/* Category Dropdown */}
          <View className="mb-4">
            <Text className={`text-sm mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Category <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowCategoryDropdown(true)}
              className={`flex-row items-center p-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Icon name="shape" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text className={`flex-1 ml-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name 
                  : 'Select category'}
              </Text>
              <Icon name="chevron-down" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Brand Dropdown */}
          <View className="mb-4">
            <Text className={`text-sm mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Brand <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowBrandDropdown(true)}
              className={`flex-row items-center p-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Icon name="factory" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text className={`flex-1 ml-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedBrand 
                  ? brands.find(b => b.id === selectedBrand)?.name 
                  : 'Select brand'}
              </Text>
              <Icon name="chevron-down" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Unit Dropdown */}
          <View className="mb-4">
            <Text className={`text-sm mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Unit <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowUnitDropdown(true)}
              className={`flex-row items-center p-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Icon name="scale" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text className={`flex-1 ml-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedUnit 
                  ? `${units.find(u => u.id === selectedUnit)?.name} (${units.find(u => u.id === selectedUnit)?.code})`
                  : 'Select unit'}
              </Text>
              <Icon name="chevron-down" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Unit Amount */}
          <Controller
            control={control}
            name="unit_amount"
            rules={{
              required: "Unit amount is required",
              validate: {
                positive: (value) =>
                  parseFloat(value) > 0 || "Unit amount must be greater than 0",
                numeric: (value) =>
                  !isNaN(value) || "Unit amount must be a number",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Unit Amount"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter unit amount"
                keyboardType="decimal-pad"
                error={errors.unit_amount?.message}
                leftIcon="counter"
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
            Pricing & Taxes
          </Text>

          <View className="flex-row gap-4 mb-4">
            {/* Selling Price */}
            <View className="flex-1">
              <Controller
                control={control}
                name="selling_price"
                rules={{
                  required: "Selling price is required",
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
                    error={errors.selling_price?.message}
                    leftIcon="currency-usd"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>

            {/* Purchase Price */}
            <View className="flex-1">
              <Controller
                control={control}
                name="purchase_price"
                rules={{
                  required: "Purchase price is required",
                  validate: {
                    positive: (value) =>
                      parseFloat(value) > 0 || "Price must be greater than 0",
                    numeric: (value) =>
                      !isNaN(value) || "Price must be a number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Purchase Price"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.purchase_price?.message}
                    leftIcon="cart"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mb-4">
            {/* GST Percentage */}
            <View className="flex-1">
              <Controller
                control={control}
                name="gst_percentage"
                rules={{
                  validate: {
                    numeric: (value) =>
                      !value || !isNaN(value) || "GST must be a number",
                    range: (value) =>
                      !value || 
                      (parseFloat(value) >= 0 && parseFloat(value) <= 100) ||
                      "GST must be between 0 and 100",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="GST (%)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.gst_percentage?.message}
                    leftIcon="percent"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>

            {/* Discount Percentage */}
            <View className="flex-1">
              <Controller
                control={control}
                name="discount_percentage"
                rules={{
                  validate: {
                    numeric: (value) =>
                      !value || !isNaN(value) || "Discount must be a number",
                    range: (value) =>
                      !value || 
                      (parseFloat(value) >= 0 && parseFloat(value) <= 100) ||
                      "Discount must be between 0 and 100",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Discount (%)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.discount_percentage?.message}
                    leftIcon="sale"
                    isDarkMode={isDarkMode}
                  />
                )}
              />
            </View>
          </View>

          {/* Profit Margin Display */}
          {watch("selling_price") && watch("purchase_price") && (
            <LinearGradient
              colors={isDarkMode ? ["#065f46", "#064e3b"] : ["#d1fae5", "#a7f3d0"]}
              className="p-3 rounded-xl"
            >
              <Text className={isDarkMode ? "text-green-400" : "text-green-800"}>
                Profit Margin:{" "}
                {(
                  ((watch("selling_price") - watch("purchase_price")) /
                    watch("purchase_price")) *
                  100
                ).toFixed(1)}
                % (₹{(watch("selling_price") - watch("purchase_price")).toFixed(2)})
              </Text>
            </LinearGradient>
          )}
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
                {isActive ? "Product is Active" : "Product is Inactive"}
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
          title={isEditing ? "Update Product" : "Create Product"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid || loading || !selectedCategory || !selectedBrand || !selectedUnit}
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
            <Text className="text-white font-semibold text-lg">Delete Product</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Dropdown Modals */}
      {showCategoryDropdown && renderDropdown(
        categories, 
        selectedCategory, 
        setSelectedCategory, 
        () => setShowCategoryDropdown(false),
        "Category"
      )}

      {showBrandDropdown && renderDropdown(
        brands, 
        selectedBrand, 
        setSelectedBrand, 
        () => setShowBrandDropdown(false),
        "Brand"
      )}

      {showUnitDropdown && renderDropdown(
        units, 
        selectedUnit, 
        setSelectedUnit, 
        () => setShowUnitDropdown(false),
        "Unit"
      )}
    </SafeAreaView>
  );
};

export default ProductForm;