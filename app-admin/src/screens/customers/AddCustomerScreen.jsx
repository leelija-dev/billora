// screens/customers/AddCustomerScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddCustomerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId } = route.params || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Load customer data if editing
  useEffect(() => {
    if (customerId) {
      // Simulate loading customer data
      const mockCustomer = {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        company: "Smith Enterprises",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        notes: "Premium customer",
      };
      setFormData(mockCustomer);
    }
  }, [customerId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        "Success",
        customerId
          ? "Customer updated successfully"
          : "Customer created successfully",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Customer deleted successfully");
            navigation.goBack();
          },
        },
      ],
    );
  };

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center"
        >
          <Icon name="arrow-left" size={22} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {customerId ? "Edit Customer" : "Add Customer"}
        </Text>
        {customerId ? (
          <TouchableOpacity
            onPress={handleDelete}
            className="w-10 h-10 bg-red-100 rounded-2xl items-center justify-center"
          >
            <Icon name="delete" size={20} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Form Header */}
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-5 rounded-3xl mb-4"
          >
            <Text className="text-white text-lg font-bold">
              {customerId
                ? "Edit Customer Information"
                : "New Customer Information"}
            </Text>
            <Text className="text-white/80 text-sm mt-1">
              {customerId
                ? "Update the customer details below"
                : "Fill in the details to add a new customer"}
            </Text>
          </LinearGradient>

          {/* Basic Information */}
          <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              Basic Information
            </Text>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Name <Text className="text-red-500">*</Text>
              </Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl px-4 border ${
                  errors.name ? "border-red-300" : "border-gray-200"
                }`}
              >
                <Icon name="account-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 py-3 text-gray-900"
                  placeholder="Enter customer name"
                  placeholderTextColor="#9ca3af"
                  value={formData.name}
                  onChangeText={(text) => updateForm("name", text)}
                />
              </View>
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Email <Text className="text-red-500">*</Text>
              </Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl px-4 border ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
              >
                <Icon name="email-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 py-3 text-gray-900"
                  placeholder="Enter email address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => updateForm("email", text)}
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Phone
              </Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl px-4 border ${
                  errors.phone ? "border-red-300" : "border-gray-200"
                }`}
              >
                <Icon name="phone-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 py-3 text-gray-900"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => updateForm("phone", text)}
                />
              </View>
              {errors.phone && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </Text>
              )}
            </View>

            {/* Company */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Company
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                <Icon name="office-building" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 py-3 text-gray-900"
                  placeholder="Enter company name"
                  placeholderTextColor="#9ca3af"
                  value={formData.company}
                  onChangeText={(text) => updateForm("company", text)}
                />
              </View>
            </View>
          </View>

          {/* Address Information */}
          <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              Address
            </Text>

            {/* Street */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Street Address
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                <Icon name="home-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 py-3 text-gray-900"
                  placeholder="Enter street address"
                  placeholderTextColor="#9ca3af"
                  value={formData.street}
                  onChangeText={(text) => updateForm("street", text)}
                />
              </View>
            </View>

            {/* City and State */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  City
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <Icon name="city" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 py-3 text-gray-900"
                    placeholder="City"
                    placeholderTextColor="#9ca3af"
                    value={formData.city}
                    onChangeText={(text) => updateForm("city", text)}
                  />
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  State
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <TextInput
                    className="flex-1 py-3 text-gray-900"
                    placeholder="State"
                    placeholderTextColor="#9ca3af"
                    value={formData.state}
                    onChangeText={(text) => updateForm("state", text)}
                  />
                </View>
              </View>
            </View>

            {/* ZIP and Country */}
            <View className="flex-row">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  ZIP Code
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <Icon name="zip-box" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 py-3 text-gray-900"
                    placeholder="ZIP"
                    placeholderTextColor="#9ca3af"
                    value={formData.zip}
                    onChangeText={(text) => updateForm("zip", text)}
                  />
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Country
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <Icon name="earth" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 py-3 text-gray-900"
                    placeholder="Country"
                    placeholderTextColor="#9ca3af"
                    value={formData.country}
                    onChangeText={(text) => updateForm("country", text)}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-6">
            <Text className="text-gray-900 font-bold text-lg mb-4">Notes</Text>
            <View className="bg-gray-50 rounded-xl px-4 border border-gray-200">
              <TextInput
                className="py-3 text-gray-900 min-h-[100px]"
                placeholder="Add any notes about this customer..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.notes}
                onChangeText={(text) => updateForm("notes", text)}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} className="mb-8">
            <LinearGradient
              colors={["#6366F1", "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 rounded-2xl"
            >
              <Text className="text-white font-bold text-center text-lg">
                {customerId ? "Update Customer" : "Create Customer"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCustomerScreen;
