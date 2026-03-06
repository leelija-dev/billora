// screens/orders/OrderForm.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Static mock data (keep as is from your original code)
// Static mock data
const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8901",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA"
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234-567-8902",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA"
    }
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 234-567-8903",
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA"
    }
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    phone: "+1 234-567-8904",
    address: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA"
    }
  },
  {
    id: 5,
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "+1 234-567-8905",
    address: {
      street: "654 Maple Dr",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA"
    }
  }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    image: "headphones",
    category: "Electronics",
    stock: 50
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 299.99,
    image: "watch",
    category: "Electronics",
    stock: 30
  },
  {
    id: 3,
    name: "Laptop Backpack",
    description: "Water-resistant backpack with USB charging port",
    price: 79.99,
    image: "backpack",
    category: "Accessories",
    stock: 100
  },
  {
    id: 4,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 49.99,
    image: "mouse",
    category: "Electronics",
    stock: 75
  },
  {
    id: 5,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 149.99,
    image: "coffee",
    category: "Home",
    stock: 25
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Eco-friendly non-slip yoga mat with carrying strap",
    price: 39.99,
    image: "yoga",
    category: "Fitness",
    stock: 60
  }
];

const MOCK_ORDERS = [
  {
    id: 1,
    customer: MOCK_CUSTOMERS[0],
    items: [
      { productId: 1, name: "Wireless Headphones", price: 199.99, quantity: 1, image: "headphones" },
      { productId: 3, name: "Laptop Backpack", price: 79.99, quantity: 2, image: "backpack" }
    ],
    notes: "Please deliver before 5 PM",
    paymentMethod: "credit_card",
    shippingAddress: MOCK_CUSTOMERS[0].address,
    orderDate: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    customer: MOCK_CUSTOMERS[1],
    items: [
      { productId: 2, name: "Smart Watch", price: 299.99, quantity: 1, image: "watch" },
      { productId: 4, name: "Wireless Mouse", price: 49.99, quantity: 1, image: "mouse" }
    ],
    notes: "Leave at front desk",
    paymentMethod: "cash",
    shippingAddress: MOCK_CUSTOMERS[1].address,
    orderDate: "2024-01-16",
    status: "processing"
  }
];

const OrderForm = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const isEditing = route.params?.orderId;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  });

  // Animation effect when step changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    // Clear validation errors when step changes
    setValidationErrors({});
  }, [currentStep]);

  // Load order data if editing
  useEffect(() => {
    if (isEditing) {
      const order = MOCK_ORDERS.find(
        (o) => o.id === parseInt(route.params.orderId),
      );
      if (order) {
        setSelectedCustomer(order.customer);
        setOrderItems(order.items);
        setNotes(order.notes || "");
        setPaymentMethod(order.paymentMethod);
        setShippingAddress(
          order.shippingAddress ||
            order.customer?.address || {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "USA",
            },
        );
      }
    }
  }, [isEditing, route.params?.orderId]);

  const steps = [
    {
      id: 1,
      title: "Customer",
      icon: "person-outline",
      gradient: ["#4158D0", "#C850C0"],
    },
    {
      id: 2,
      title: "Items",
      icon: "cart-outline",
      gradient: ["#FF512F", "#F09819"],
    },
    {
      id: 3,
      title: "Details",
      icon: "document-text-outline",
      gradient: ["#11998e", "#38ef7d"],
    },
    {
      id: 4,
      title: "Review",
      icon: "checkmark-circle-outline",
      gradient: ["#8E2DE2", "#4A00E0"],
    },
  ];

  const paymentMethods = [
    {
      id: "credit_card",
      label: "Credit Card",
      icon: "card-outline",
      gradient: ["#4158D0", "#C850C0"],
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: "cash",
      label: "Cash",
      icon: "cash-outline",
      gradient: ["#FF512F", "#F09819"],
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      icon: "business-outline",
      gradient: ["#11998e", "#38ef7d"],
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (currentStep < 4) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
      });
    } else {
      navigation.goBack();
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShippingAddress(customer.address || shippingAddress);
    setShowCustomerModal(false);
    setValidationErrors({});
  };

  const handleAddItem = (product) => {
    const existingItem = orderItems.find(
      (item) => item.productId === product.id,
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
    setShowProductModal(false);
    setValidationErrors({});
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    } else {
      setOrderItems(
        orderItems.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateStep = () => {
    const errors = {};

    if (currentStep === 1 && !selectedCustomer) {
      errors.customer = "Please select a customer";
    }
    if (currentStep === 2 && orderItems.length === 0) {
      errors.items = "Please add at least one item to the order";
    }
    if (currentStep === 3) {
      if (!shippingAddress.street) {
        errors.street = "Street address is required";
      }
      if (!shippingAddress.city) {
        errors.city = "City is required";
      }
      if (!shippingAddress.zip) {
        errors.zip = "ZIP code is required";
      }
    }

    return errors;
  };

  const handleStepPress = (stepId) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    } else if (stepId > currentStep) {
      const errors = validateStep();
      if (Object.keys(errors).length === 0) {
        setCurrentStep(stepId);
      } else {
        setValidationErrors(errors);
      }
    }
  };

  const handleSubmit = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate order creation
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.goBack();
    }, 1500);
  };

  const renderStepIndicator = () => (
    <View className="px-4 py-6 bg-white">
      <View className="flex-row items-center justify-between">
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            className="items-center"
            onPress={() => handleStepPress(step.id)}
            disabled={step.id > currentStep && Object.keys(validateStep()).length > 0}
          >
            <LinearGradient
              colors={
                currentStep >= step.id ? step.gradient : ["#E5E7EB", "#E5E7EB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={`w-12 h-12 rounded-2xl items-center justify-center shadow-lg ${
                currentStep >= step.id ? "shadow-purple-200" : ""
              }`}
              style={{
                transform: [{ scale: currentStep === step.id ? 1.1 : 1 }],
                borderRadius:100,
              }}
            >
              <Ionicons
                name={step.icon}
                size={22}
                color={currentStep >= step.id ? "white" : "#9CA3AF"}
              />
            </LinearGradient>
            <Text
              className={`text-xs font-semibold mt-2 ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Line */}
      <View className="absolute top-[38px] left-0 right-0 flex-row justify-center px-8">
        <View className="h-[2px] bg-gray-200 w-[70%]" />
      </View>
    </View>
  );

  const renderCustomerStep = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="p-5"
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
         style={{borderRadius:10}}
      >
        <Text className="text-white text-2xl font-bold mb-2">
          Select Customer
        </Text>
        <Text className="text-white/80">Choose a customer for this order</Text>
      </LinearGradient>

      {validationErrors.customer && (
        <View className="bg-red-50 p-3 rounded-xl mb-4 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="text-red-600 ml-2 flex-1">{validationErrors.customer}</Text>
        </View>
      )}

      {selectedCustomer ? (
        <LinearGradient
          colors={["#f5f0ff", "#ffffff"]}
          className="p-5 rounded-2xl border border-purple-100 mb-4"
          style={{
            shadowColor: "#667eea",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            borderRadius:10
          }}
        >
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              className="w-16 h-16 rounded-2xl items-center justify-center"
               style={{borderRadius:100}}
            >
              <Text className="text-white text-2xl font-bold">
                {selectedCustomer.name.charAt(0)}
              </Text>
            </LinearGradient>
            <View className="flex-1 ml-4">
              <Text className="text-gray-900 font-bold text-lg">
                {selectedCustomer.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {selectedCustomer.email}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={14} color="#667eea" />
                <Text className="text-purple-600 text-xs ml-1">
                  {selectedCustomer.address?.city},{" "}
                  {selectedCustomer.address?.country}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowCustomerModal(true)}
              className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          onPress={() => setShowCustomerModal(true)}
          className="bg-white p-8 rounded-2xl border-2 border-dashed border-purple-200 items-center"
          style={{
            shadowColor: "#667eea",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
             style={{borderRadius:100}}
            
          >
            <Ionicons name="person-add-outline" size={36} color="white" />
          </LinearGradient>
          <Text className="text-gray-900 font-bold text-lg mb-2">
            No Customer Selected
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Tap to select a customer for this order
          </Text>
          <View className="bg-purple-50 px-6 py-3 rounded-xl">
            <Text className="text-purple-600 font-semibold">
              Select Customer
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Customer Modal */}
      <Modal
        visible={showCustomerModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50">
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            className="flex-1 mt-20 rounded-t-3xl"
          >
            <View className="p-5 border-b border-gray-100">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-gray-900">
                  Select Customer
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCustomerModal(false)}
                  className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
                >
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-12">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Search customers..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView className="flex-1 p-5">
              {filteredCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  onPress={() => handleSelectCustomer(customer)}
                  activeOpacity={0.7}
                   
                >
                  <LinearGradient
                    colors={["#ffffff", "#f8f9fa"]}
                    className="p-4 rounded-2xl mb-3 border border-gray-100"
                    style={{
                      shadowColor: "#667eea",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                     
                    }}
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        className="w-14 h-14 rounded-xl items-center justify-center"
                        style={{borderRadius:100}}
                      >
                        <Text className="text-white text-xl font-bold">
                          {customer.name.charAt(0)}
                        </Text>
                      </LinearGradient>
                      <View className="flex-1 ml-4">
                        <Text className="text-gray-900 font-bold">
                          {customer.name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {customer.email}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color="#667eea"
                          />
                          <Text className="text-purple-600 text-xs ml-1">
                            {customer.address?.city},{" "}
                            {customer.address?.country}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#667eea"
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        className="mt-4"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={selectedCustomer ? ["#4158D0", "#C850C0"] : ["#E5E7EB", "#E5E7EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center py-4 rounded-xl"
          style={{borderRadius:10}}
        >
          <Text className={`font-bold text-base mr-2 ${selectedCustomer ? "text-white" : "text-gray-400"}`}>
            Next: Items
          </Text>
          <Ionicons name="arrow-forward" size={18} color={selectedCustomer ? "white" : "#9CA3AF"} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderItemsStep = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="p-5"
    >
      <LinearGradient
        colors={["#FF512F", "#F09819"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
        style={{borderRadius:10}}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold mb-2">
              Order Items
            </Text>
            <Text className="text-white/80">Add products to your order</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowProductModal(true)}
            className="bg-white/20 p-3 rounded-xl"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {validationErrors.items && (
        <View className="bg-red-50 p-3 rounded-xl mb-4 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="text-red-600 ml-2 flex-1">{validationErrors.items}</Text>
        </View>
      )}

      {orderItems.length === 0 ? (
        <View className="bg-white p-8 rounded-2xl border-2 border-dashed border-orange-200 items-center">
          <LinearGradient
            colors={["#FF512F", "#F09819"]}
            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
            style={{borderRadius:100}}
          >
            <Ionicons name="cart-outline" size={36} color="white" />
          </LinearGradient>
          <Text className="text-gray-900 font-bold text-lg mb-2">
            No Items Added
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Tap the + button to add products
          </Text>
        </View>
      ) : (
        <>
          {orderItems.map((item, index) => (
            <LinearGradient
              key={index}
              colors={["#ffffff", "#fff5f0"]}
              className="p-4 rounded-2xl mb-3 border border-orange-100"
              style={{
                shadowColor: "#FF512F",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#FF512F", "#F09819"]}
                  className="w-16 h-16 rounded-xl items-center justify-center"
                  style={{borderRadius:5}}
                >
                  <Ionicons name="cube" size={28} color="white" />
                </LinearGradient>
                <View className="flex-1 ml-4">
                  <Text
                    className="text-gray-900 font-bold text-base"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-orange-500 font-bold text-lg mt-1">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>

              <View className="flex-row items-center justify-end mt-4 pt-3 border-t border-orange-100">
                <TouchableOpacity
                  className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center"
                  onPress={() => updateItemQuantity(index, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color="#FF512F" />
                </TouchableOpacity>
                <Text className="mx-4 font-bold text-gray-900 text-lg">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  className="w-10 h-10 bg-orange-500 rounded-xl items-center justify-center"
                  onPress={() => updateItemQuantity(index, item.quantity + 1)}
                >
                  <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}

          <LinearGradient
            colors={["#FF512F", "#F09819"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-5 rounded-2xl mt-4"
            style={{borderRadius:10}}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Subtotal</Text>
              <Text className="text-white font-bold">
                ${calculateSubtotal().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Tax (10%)</Text>
              <Text className="text-white font-bold">
                ${calculateTax().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between pt-3 mt-2 border-t border-white/30">
              <Text className="text-white font-bold text-lg">Total</Text>
              <Text className="text-white font-bold text-2xl">
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          </LinearGradient>
        </>
      )}

      {/* Product Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50">
          <LinearGradient
            colors={["#ffffff", "#fff5f0"]}
            className="flex-1 mt-20 rounded-t-3xl"
          >
            <View className="p-5 border-b border-gray-100">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-gray-900">
                  Select Product
                </Text>
                <TouchableOpacity
                  onPress={() => setShowProductModal(false)}
                  className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
                >
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-5">
              {MOCK_PRODUCTS.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleAddItem(product)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["#ffffff", "#fff5f0"]}
                    className="p-4 rounded-2xl mb-3 border border-orange-100"
                    style={{
                      shadowColor: "#FF512F",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                    }}
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={["#FF512F", "#F09819"]}
                        className="w-16 h-16 rounded-xl items-center justify-center"
                        style={{borderRadius:5}}
                      >
                        <Ionicons name="cube" size={28} color="white" />
                      </LinearGradient>
                      <View className="flex-1 ml-4">
                        <Text className="text-gray-900 font-bold text-base">
                          {product.name}
                        </Text>
                        <Text
                          className="text-gray-500 text-xs mt-1"
                          numberOfLines={2}
                        >
                          {product.description}
                        </Text>
                        <Text className="text-orange-500 font-bold text-lg mt-2">
                          ${product.price.toFixed(2)}
                        </Text>
                      </View>
                      <View className="w-10 h-10 bg-orange-500 rounded-xl items-center justify-center">
                        <Ionicons name="add" size={20} color="white" />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        className="mt-4"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={orderItems.length > 0 ? ["#FF512F", "#F09819"] : ["#E5E7EB", "#E5E7EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center py-4 rounded-xl"
           style={{borderRadius:10}}
        >
          <Text className={`font-bold text-base mr-2 ${orderItems.length > 0 ? "text-white" : "text-gray-400"}`}>
            Next: Details
          </Text>
          <Ionicons name="arrow-forward" size={18} color={orderItems.length > 0 ? "white" : "#9CA3AF"} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDetailsStep = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="p-5"
    >
      <LinearGradient
        colors={["#11998e", "#38ef7d"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
        style={{borderRadius:10}}
      >
        <Text className="text-white text-2xl font-bold mb-2">
          Order Details
        </Text>
        <Text className="text-white/80">Payment & shipping information</Text>
      </LinearGradient>

      {/* Validation Errors */}
      {(validationErrors.street || validationErrors.city || validationErrors.zip) && (
        <View className="bg-red-50 p-3 rounded-xl mb-4">
          {validationErrors.street && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-600 ml-2 text-sm">{validationErrors.street}</Text>
            </View>
          )}
          {validationErrors.city && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-600 ml-2 text-sm">{validationErrors.city}</Text>
            </View>
          )}
          {validationErrors.zip && (
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-600 ml-2 text-sm">{validationErrors.zip}</Text>
            </View>
          )}
        </View>
      )}

      <Text className="text-gray-900 font-bold text-lg mb-4">
        Payment Method
      </Text>
      <View className="flex-row mb-6">
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className={`flex-1 mx-1 ${method.lightBg} rounded-2xl overflow-hidden`}
            onPress={() => setPaymentMethod(method.id)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                paymentMethod === method.id
                  ? method.gradient
                  : ["transparent", "transparent"]
              }
              className="p-4 items-center"
            >
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center mb-2 ${
                  paymentMethod === method.id ? "bg-white/20" : method.lightBg
                }`}
              >
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={
                    paymentMethod === method.id ? "white" : method.gradient[0]
                  }
                />
              </View>
              <Text
                className={`text-xs font-semibold ${
                  paymentMethod === method.id ? "text-white" : method.textColor
                }`}
              >
                {method.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-gray-900 font-bold text-lg mb-4">
        Shipping Address
      </Text>
      <View className=" gap-2">
        <View>
          <TextInput
            className={`bg-white p-4 rounded-xl border text-base ${
              validationErrors.street ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Street Address *"
            placeholderTextColor="#9CA3AF"
            value={shippingAddress.street}
            onChangeText={(text) => {
              setShippingAddress({ ...shippingAddress, street: text });
              if (validationErrors.street) {
                setValidationErrors({ ...validationErrors, street: null });
              }
            }}
          />
        </View>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <TextInput
              className={`bg-white p-4 rounded-xl border text-base ${
                validationErrors.city ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="City *"
              placeholderTextColor="#9CA3AF"
              value={shippingAddress.city}
              onChangeText={(text) => {
                setShippingAddress({ ...shippingAddress, city: text });
                if (validationErrors.city) {
                  setValidationErrors({ ...validationErrors, city: null });
                }
              }}
            />
          </View>
          <TextInput
            className="flex-1 bg-white p-4 rounded-xl border border-gray-200 text-base"
            placeholder="State"
            placeholderTextColor="#9CA3AF"
            value={shippingAddress.state}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, state: text })
            }
          />
        </View>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <TextInput
              className={`bg-white p-4 rounded-xl border text-base ${
                validationErrors.zip ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="ZIP Code *"
              placeholderTextColor="#9CA3AF"
              value={shippingAddress.zip}
              onChangeText={(text) => {
                setShippingAddress({ ...shippingAddress, zip: text });
                if (validationErrors.zip) {
                  setValidationErrors({ ...validationErrors, zip: null });
                }
              }}
              keyboardType="numeric"
            />
          </View>
          <TextInput
            className="flex-1 bg-white p-4 rounded-xl border border-gray-200 text-base"
            placeholder="Country"
            placeholderTextColor="#9CA3AF"
            value={shippingAddress.country}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, country: text })
            }
          />
        </View>
      </View>

      <Text className="text-gray-900 font-bold text-lg mt-6 mb-4">
        Order Notes
      </Text>
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] text-base"
        placeholder="Add any special instructions or notes..."
        placeholderTextColor="#9CA3AF"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        className="mt-6"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={shippingAddress.street && shippingAddress.city && shippingAddress.zip 
            ? ["#11998e", "#38ef7d"] 
            : ["#E5E7EB", "#E5E7EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center py-4 rounded-xl"
           style={{borderRadius:10}}
        >
          <Text className={`font-bold text-base mr-2 ${
            shippingAddress.street && shippingAddress.city && shippingAddress.zip 
            ? "text-white" 
            : "text-gray-400"
          }`}>
            Next: Review
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={18} 
            color={shippingAddress.street && shippingAddress.city && shippingAddress.zip ? "white" : "#9CA3AF"} 
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderReviewStep = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="p-5"
    >
      <LinearGradient
        colors={["#8E2DE2", "#4A00E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
        style={{borderRadius:10}}
      >
        <Text className="text-white text-2xl font-bold mb-2">Review Order</Text>
        <Text className="text-white/80">
          Verify all details before submitting
        </Text>
      </LinearGradient>

      <LinearGradient
        colors={["#ffffff", "#f5f0ff"]}
        className="rounded-2xl p-5 border border-purple-100"
        style={{
          shadowColor: "#8E2DE2",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderRadius: 10,
        }}
      >
        {/* Customer Info */}
        <View className="mb-5">
          <Text className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-3">
            Customer
          </Text>
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#8E2DE2", "#4A00E0"]}
              className="w-12 h-12 rounded-xl items-center justify-center mr-3"
              style={{borderRadius:100}}
            >
              <Text className="text-white font-bold text-lg">
                {selectedCustomer?.name?.charAt(0)}
              </Text>
            </LinearGradient>
            <View>
              <Text className="text-gray-900 font-bold">
                {selectedCustomer?.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {selectedCustomer?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View className="mb-5">
          <Text className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-3">
            Items ({orderItems.length})
          </Text>
          {orderItems.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-gray-700 flex-1" numberOfLines={1}>
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-gray-900 font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <View className="mb-5">
          <Text className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-3">
            Payment
          </Text>
          <View className="flex-row items-center">
            <LinearGradient
              colors={
                paymentMethods.find((m) => m.id === paymentMethod)
                  ?.gradient || ["#11998e", "#38ef7d"]
              }
              className="w-8 h-8 rounded-lg items-center justify-center mr-3"
              style={{borderRadius:100}}
            >
              <Ionicons
                name={paymentMethods.find((m) => m.id === paymentMethod)?.icon}
                size={16}
                color="white"
              />
            </LinearGradient>
            <Text className="text-gray-700 font-semibold">
              {paymentMethods.find((m) => m.id === paymentMethod)?.label}
            </Text>
          </View>
        </View>

        {/* Shipping */}
        <View className="mb-5">
          <Text className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-3">
            Shipping
          </Text>
          <View className="bg-green-50 p-3 rounded-xl">
            <Text className="text-gray-900 font-semibold">
              {shippingAddress.street}
            </Text>
            <Text className="text-gray-600 text-sm">
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.zip}
            </Text>
            <Text className="text-gray-600 text-sm">
              {shippingAddress.country}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {notes ? (
          <View className="mb-5">
            <Text className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">
              Notes
            </Text>
            <Text className="text-gray-700 bg-gray-50 p-3 rounded-xl">
              {notes}
            </Text>
          </View>
        ) : null}

        {/* Total */}
        <LinearGradient
          colors={["#8E2DE2", "#4A00E0"]}
          className="p-4 rounded-xl mt-3"
          style={{borderRadius:5}}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-lg">Total</Text>
            <Text className="text-white font-bold text-2xl">
              ${calculateTotal().toFixed(2)}
            </Text>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className="mt-6"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isSubmitting ? ["#34D399", "#059669"] : ["#8E2DE2", "#4A00E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center py-4 rounded-xl"
           style={{borderRadius:10}}
          
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Processing...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white font-bold text-base ml-2">
                {isEditing ? "Update Order" : "Create Order"}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const getCurrentGradient = () => {
    switch (currentStep) {
      case 1:
        return ["#4158D0", "#C850C0"];
      case 2:
        return ["#FF512F", "#F09819"];
      case 3:
        return ["#11998e", "#38ef7d"];
      case 4:
        return ["#8E2DE2", "#4A00E0"];
      default:
        return ["#4158D0", "#C850C0"];
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 py-4 bg-white">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <LinearGradient
          colors={getCurrentGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-2 rounded-xl"
           style={{borderRadius:5}}
        >
          <Text className="text-white font-bold">
            {isEditing ? "Edit Order" : "Create Order"}
          </Text>
        </LinearGradient>
        <View className="w-10" />
      </View>

      {renderStepIndicator()}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Increased padding to account for tab bar
      >
        {currentStep === 1 && renderCustomerStep()}
        {currentStep === 2 && renderItemsStep()}
        {currentStep === 3 && renderDetailsStep()}
        {currentStep === 4 && renderReviewStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderForm;