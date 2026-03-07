// components/customers/CustomerForm.js
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '../../store/themeStore';

// Static customers data for editing
const STATIC_CUSTOMERS = {
  "CUST-001": {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Smith Enterprises",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    notes: "Premium customer, prefers email communication. Has been with us for over 2 years. Frequently orders bulk items for his business.",
    taxId: "12-3456789",
    tags: ["premium", "business", "bulk-orders"],
  },
  "CUST-002": {
    id: "CUST-002",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 234-5678",
    company: "Wilson Designs",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    notes: "Interested in new collections. Loves seasonal items.",
    tags: ["designer", "seasonal"],
  },
  "CUST-003": {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 345-6789",
    company: "Brown Consulting",
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    notes: "Corporate account, needs invoices. Monthly orders.",
    taxId: "98-7654321",
    tags: ["corporate", "monthly"],
  },
  "CUST-004": {
    id: "CUST-004",
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "+1 (555) 456-7890",
    company: "Davis Law Firm",
    address: {
      street: "321 Elm Boulevard",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "USA",
    },
    notes: "Prefers phone calls. Legal professional, needs detailed invoices.",
    tags: ["legal", "phone-pref"],
  },
  "CUST-005": {
    id: "CUST-005",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 (555) 567-8901",
    company: "Lee Innovations",
    address: {
      street: "654 Cedar Lane",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "USA",
    },
    notes: "Temporary inactive - on sabbatical. Will return in June.",
    tags: ["tech", "inactive"],
  },
  "CUST-006": {
    id: "CUST-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 678-9012",
    company: "Anderson Art",
    address: {
      street: "987 Maple Drive",
      city: "Philadelphia",
      state: "PA",
      zip: "19101",
      country: "USA",
    },
    notes: "VIP customer - sends referrals. Art gallery owner.",
    tags: ["vip", "art", "referrals"],
  },
  "CUST-007": {
    id: "CUST-007",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "",
    company: "Wilson Tech",
    address: {
      street: "147 Birch Street",
      city: "San Antonio",
      state: "TX",
      zip: "78201",
      country: "USA",
    },
    notes: "New customer - tech startup founder. Interested in bulk discounts.",
    tags: ["tech", "startup", "new"],
  },
  "CUST-008": {
    id: "CUST-008",
    name: "Maria Garcia",
    email: "",
    phone: "+1 (555) 890-1234",
    company: "Garcia Designs",
    address: {
      street: "258 Walnut Avenue",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      country: "USA",
    },
    notes: "On vacation until May. Interior designer.",
    tags: ["design", "vacation"],
  },
  "CUST-009": {
    id: "CUST-009",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 901-2345",
    company: "Taylor Construction",
    address: {
      street: "369 Spruce Street",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA",
    },
    notes: "Construction company - bulk orders every month.",
    taxId: "45-6789012",
    tags: ["construction", "bulk", "monthly"],
  },
  "CUST-010": {
    id: "CUST-010",
    name: "Jennifer Park",
    email: "jennifer.park@email.com",
    phone: "+1 (555) 012-3456",
    company: "Park Consulting",
    address: {
      street: "753 Aspen Road",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    notes: "Business consultant - orders for corporate events.",
    tags: ["consulting", "corporate"],
  },
};

const InputField = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  icon, 
  required = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  errors,
  secureTextEntry = false,
  autoCapitalize = 'none',
  editable = true,
  isDarkMode = false,
}) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-2">
      <Text className={`text-sm font-medium ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
    </View>
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View
          className={`flex-row items-center rounded-xl px-4 border ${
            errors[name] 
              ? 'border-red-500' 
              : isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          } ${!editable ? 'opacity-60' : ''}`}
        >
          {icon && (
            <View className="w-8 h-8 items-center justify-center">
              <Icon name={icon} size={20} color="#9ca3af" />
            </View>
          )}
          <TextInput
            className={`flex-1 py-3 ${icon ? 'ml-2' : ''} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            placeholder={placeholder}
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            editable={editable}
          />
        </View>
      )}
    />
    {errors[name] && (
      <View className="flex-row items-center mt-1">
        <Icon name="alert-circle" size={14} color="#EF4444" />
        <Text className="text-red-500 text-xs ml-1">{errors[name].message}</Text>
      </View>
    )}
  </View>
);

const CustomerForm = ({ isDarkMode: propIsDarkMode }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode: storeIsDarkMode } = useThemeStore();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : storeIsDarkMode;
  const { customerId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customer, setCustomer] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      taxId: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
      },
      notes: '',
    },
    mode: 'onChange',
  });

  // Watch form values for live preview
  const formValues = watch();

  useEffect(() => {
    if (customerId && STATIC_CUSTOMERS[customerId]) {
      const customerData = STATIC_CUSTOMERS[customerId];
      setCustomer(customerData);
      reset({
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        company: customerData.company || '',
        taxId: customerData.taxId || '',
        address: customerData.address || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'USA',
        },
        notes: customerData.notes || '',
      });
    }
  }, [customerId, reset]);

  const onSubmit = (data) => {
    Alert.alert(
      'Success',
      customerId ? 'Customer updated successfully' : 'Customer created successfully',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    Alert.alert('Success', 'Customer deleted successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const isFormValid = () => {
    return formValues.name && formValues.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} edges={['top']}>
      {/* Header */}
      <View className={`flex-row items-center justify-between px-4 py-3 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <Icon name="arrow-left" size={22} color={isDarkMode ? "#9CA3AF" : "#374151"} />
        </TouchableOpacity>
        <Text className={`text-lg font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {customerId ? 'Edit Customer' : 'New Customer'}
        </Text>
        {customerId ? (
          <TouchableOpacity
            onPress={handleDelete}
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
            }`}
          >
            <Icon name="delete" size={20} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Hero Section */}
          <LinearGradient
            colors={["#4158D0", "#C850C0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mx-4 mt-4 p-6 rounded-3xl"
            style={{
              shadowColor: "#4158D0",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
              borderRadius: 13,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center">
                <Icon name="account-plus" size={32} color="white" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-2xl font-bold">
                  {customerId ? 'Edit Customer' : 'Add Customer'}
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  {customerId 
                    ? 'Update customer information below'
                    : 'Fill in the details to add a new customer'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Live Preview (only when editing/adding) */}
          {formValues.name && (
            <View className={`mx-4 mt-4 p-4 rounded-2xl border ${
              isDarkMode ? 'bg-gray-800 border-indigo-900' : 'bg-white border-indigo-100'
            }`}>
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#4158D0", "#C850C0"]}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-xl font-bold">
                    {formValues.name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View className="flex-1 ml-3">
                  <Text className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formValues.name || 'Customer Name'}
                  </Text>
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formValues.email || 'email@example.com'}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>New</Text>
                </View>
              </View>
            </View>
          )}

          {/* Main Form */}
          <View className="p-4">
            {/* Basic Information Card */}
            <View className={`rounded-3xl border mb-4 overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <LinearGradient
                colors={isDarkMode ? ["#1F2937", "#111827"] : ["#f8f9ff", "#ffffff"]}
                className={`px-5 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                    isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
                  }`}>
                    <Icon name="account-details" size={18} color="#6366F1" />
                  </View>
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Basic Information</Text>
                </View>
              </LinearGradient>
              
              <View className="p-5">
                <InputField
                  control={control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter customer full name"
                  icon="account-outline"
                  required
                  errors={errors}
                  autoCapitalize="words"
                  isDarkMode={isDarkMode}
                />

                <InputField
                  control={control}
                  name="email"
                  label="Email Address"
                  placeholder="customer@example.com"
                  icon="email-outline"
                  required
                  keyboardType="email-address"
                  errors={errors}
                  isDarkMode={isDarkMode}
                />

                <InputField
                  control={control}
                  name="phone"
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  icon="phone-outline"
                  keyboardType="phone-pad"
                  errors={errors}
                  isDarkMode={isDarkMode}
                />

                <InputField
                  control={control}
                  name="company"
                  label="Company"
                  placeholder="Company name (optional)"
                  icon="office-building"
                  errors={errors}
                  autoCapitalize="words"
                  isDarkMode={isDarkMode}
                />

                <InputField
                  control={control}
                  name="taxId"
                  label="Tax ID / VAT Number"
                  placeholder="Enter tax ID (optional)"
                  icon="file-document-outline"
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
              </View>
            </View>

            {/* Address Card */}
            <View className={`rounded-3xl border mb-4 overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <LinearGradient
                colors={isDarkMode ? ["#1F2937", "#111827"] : ["#f8f9ff", "#ffffff"]}
                className={`px-5 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                    isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                    <Icon name="map-marker" size={18} color="#10B981" />
                  </View>
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Address Information</Text>
                </View>
              </LinearGradient>
              
              <View className="p-5">
                <InputField
                  control={control}
                  name="address.street"
                  label="Street Address"
                  placeholder="Enter street address"
                  icon="home-outline"
                  errors={errors}
                  autoCapitalize="words"
                  isDarkMode={isDarkMode}
                />

                <View className="flex-row mb-4">
                  <View className="flex-1 mr-2">
                    <Controller
                      control={control}
                      name="address.city"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>City</Text>
                          <View className={`flex-row items-center rounded-xl px-4 border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <Icon name="city" size={20} color="#9ca3af" />
                            <TextInput
                              className={`flex-1 ml-2 py-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                              placeholder="City"
                              placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Controller
                      control={control}
                      name="address.state"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>State</Text>
                          <View className={`flex-row items-center rounded-xl px-4 border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <TextInput
                              className={`flex-1 py-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                              placeholder="State"
                              placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </View>

                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <Controller
                      control={control}
                      name="address.zip"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>ZIP Code</Text>
                          <View className={`flex-row items-center rounded-xl px-4 border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <Icon name="zip-box" size={20} color="#9ca3af" />
                            <TextInput
                              className={`flex-1 ml-2 py-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                              placeholder="ZIP"
                              placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Controller
                      control={control}
                      name="address.country"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Country</Text>
                          <View className={`flex-row items-center rounded-xl px-4 border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <Icon name="earth" size={20} color="#9ca3af" />
                            <TextInput
                              className={`flex-1 ml-2 py-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                              placeholder="Country"
                              placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Tags Preview (if editing) */}
            {customer?.tags && customer.tags.length > 0 && (
              <View className={`rounded-3xl border mb-4 p-5 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <View className="flex-row items-center mb-4">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                    isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                  }`}>
                    <Icon name="tag-multiple" size={18} color="#8B5CF6" />
                  </View>
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Tags</Text>
                </View>
                <View className="flex-row flex-wrap">
                  {customer.tags.map((tag, index) => (
                    <View
                      key={index}
                      className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                        isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                      }`}
                    >
                      <Text className={`text-xs font-medium ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Notes Card */}
            <View className={`rounded-3xl border mb-6 overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <LinearGradient
                colors={isDarkMode ? ["#1F2937", "#111827"] : ["#f8f9ff", "#ffffff"]}
                className={`px-5 py-4 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                    isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'
                  }`}>
                    <Icon name="note-text" size={18} color="#F59E0B" />
                  </View>
                  <Text className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Notes</Text>
                </View>
              </LinearGradient>
              
              <View className="p-5">
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className={`rounded-xl px-4 border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <TextInput
                        className={`py-3 min-h-[100px] ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        placeholder="Add any notes about this customer..."
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#9ca3af'}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isFormValid() || loading}
              className="mb-8"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isFormValid() ? ["#4158D0", "#C850C0"] : (isDarkMode ? ["#374151", "#374151"] : ["#E5E7EB", "#E5E7EB"])}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 rounded-2xl"
                style={{
                  shadowColor: isFormValid() ? "#4158D0" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isFormValid() ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: isFormValid() ? 5 : 2,
                  borderRadius: 13,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Icon 
                    name={customerId ? "account-edit" : "account-plus"} 
                    size={20} 
                    color={isFormValid() ? "white" : (isDarkMode ? "#6B7280" : "#9CA3AF")} 
                  />
                  <Text className={`font-bold text-center text-lg ml-2 ${
                    isFormValid() 
                      ? "text-white" 
                      : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                  }`}>
                    {customerId ? "Update Customer" : "Create Customer"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className={`rounded-3xl p-6 w-full max-w-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="items-center mb-4">
              <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-3 ${
                isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <Icon name="delete" size={32} color="#EF4444" />
              </View>
              <Text className={`font-bold text-xl text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Delete Customer
              </Text>
              <Text className={`text-center mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Are you sure you want to delete this customer? This action cannot be undone.
              </Text>
            </View>

            <View className="flex-row mt-6">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className={`flex-1 py-3 rounded-xl mr-2 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <Text className={`font-semibold text-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-red-500 py-3 rounded-xl ml-2"
              >
                <Text className="text-white font-semibold text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerForm;