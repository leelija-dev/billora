// OrderForm.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_CUSTOMERS } from "../../data/mockCustomers";
import { MOCK_ORDERS } from "../../data/mockOrders";
import { MOCK_PRODUCTS } from "../../data/mockProducts";

const OrderForm = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isEditing = route.params?.orderId;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [showProductModal, setShowProductModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  });

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
        setShippingAddress(order.shippingAddress);
      }
    }
  }, [isEditing]);

  const steps = [
    { id: 1, title: "Customer", icon: "person-outline" },
    { id: 2, title: "Items", icon: "cart-outline" },
    { id: 3, title: "Details", icon: "document-text-outline" },
    { id: 4, title: "Review", icon: "checkmark-circle-outline" },
  ];

  const paymentMethods = [
    {
      id: "credit_card",
      label: "Credit Card",
      icon: "card-outline",
      color: "blue",
    },
    { id: "cash", label: "Cash", icon: "cash-outline", color: "green" },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      icon: "business-outline",
      color: "purple",
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigation.goBack();
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShippingAddress(customer.address);
    handleNext();
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
        },
      ]);
    }
    setShowProductModal(false);
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

  const handleSubmit = () => {
    // Simulate order creation
    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {steps.map((step, index) => (
        <View key={step.id} className="flex-1 flex-row items-center">
          <View className="items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                currentStep >= step.id ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Ionicons
                name={step.icon}
                size={18}
                color={currentStep >= step.id ? "white" : "#9CA3AF"}
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                currentStep >= step.id
                  ? "text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              className={`flex-1 h-0.5 mx-2 ${
                currentStep > step.id ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderCustomerStep = () => (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-900 mb-4">
        Select Customer
      </Text>
      {MOCK_CUSTOMERS.map((customer) => (
        <TouchableOpacity
          key={customer.id}
          className={`flex-row items-center bg-white p-4 rounded-xl mb-3 border-2 ${
            selectedCustomer?.id === customer.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-100"
          }`}
          onPress={() => handleSelectCustomer(customer)}
        >
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
            <Text className="text-white text-lg font-bold">
              {customer.name.charAt(0)}
            </Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-semibold">{customer.name}</Text>
            <Text className="text-gray-500 text-sm">{customer.email}</Text>
            <Text className="text-gray-400 text-xs mt-1">
              {customer.address.city}, {customer.address.country}
            </Text>
          </View>
          {selectedCustomer?.id === customer.id && (
            <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItemsStep = () => (
    <View className="p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-900">Order Items</Text>
        <TouchableOpacity
          className="flex-row items-center bg-blue-50 px-4 py-2 rounded-full"
          onPress={() => setShowProductModal(true)}
        >
          <Ionicons name="add" size={20} color="#3B82F6" />
          <Text className="text-blue-500 font-semibold ml-1">Add Item</Text>
        </TouchableOpacity>
      </View>

      {orderItems.length === 0 ? (
        <View className="items-center justify-center py-16">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="cart-outline" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-gray-900 font-semibold mb-2">
            No Items Added
          </Text>
          <Text className="text-gray-500 text-center px-8">
            Add products to this order by clicking the button above
          </Text>
        </View>
      ) : (
        <>
          {orderItems.map((item, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-xl mb-3 border border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
                  <Ionicons name="cube-outline" size={24} color="#6B7280" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-900 font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-blue-500 font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>

              <View className="flex-row items-center justify-end mt-3 pt-3 border-t border-gray-100">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                  onPress={() => updateItemQuantity(index, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color="#4B5563" />
                </TouchableOpacity>
                <Text className="mx-4 font-semibold text-gray-900">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  onPress={() => updateItemQuantity(index, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View className="bg-gray-50 p-4 rounded-xl mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900 font-semibold">
                ${calculateSubtotal().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tax (10%)</Text>
              <Text className="text-gray-900 font-semibold">
                ${calculateTax().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-xl font-bold text-blue-500">
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Product Selection Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Select Product
              </Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-6">
              {MOCK_PRODUCTS.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-3"
                  onPress={() => handleAddItem(product)}
                >
                  <View className="w-16 h-16 bg-blue-100 rounded-xl items-center justify-center">
                    <Ionicons name="cube" size={32} color="#3B82F6" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-gray-900 font-semibold">
                      {product.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {product.description}
                    </Text>
                    <Text className="text-blue-500 font-bold mt-2">
                      ${product.price.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderDetailsStep = () => (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-900 mb-4">
        Payment Method
      </Text>
      <View className="flex-row space-x-3 mb-8">
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className={`flex-1 items-center p-4 rounded-xl border-2 ${
              paymentMethod === method.id
                ? `border-${method.color}-500 bg-${method.color}-50`
                : "border-gray-200"
            }`}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Ionicons
              name={method.icon}
              size={28}
              color={
                paymentMethod === method.id
                  ? method.color === "blue"
                    ? "#3B82F6"
                    : method.color === "green"
                      ? "#10B981"
                      : "#8B5CF6"
                  : "#9CA3AF"
              }
            />
            <Text
              className={`text-sm font-medium mt-2 ${
                paymentMethod === method.id
                  ? `text-${method.color}-500`
                  : "text-gray-500"
              }`}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-4">
        Shipping Address
      </Text>
      <View className="space-y-3">
        <TextInput
          className="bg-gray-50 p-4 rounded-xl border border-gray-200"
          placeholder="Street Address"
          value={shippingAddress.street}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, street: text })
          }
        />
        <View className="flex-row space-x-3">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="City"
            value={shippingAddress.city}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, city: text })
            }
          />
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="State"
            value={shippingAddress.state}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, state: text })
            }
          />
        </View>
        <View className="flex-row space-x-3">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="ZIP Code"
            value={shippingAddress.zip}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, zip: text })
            }
          />
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="Country"
            value={shippingAddress.country}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, country: text })
            }
          />
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-6 mb-4">
        Order Notes
      </Text>
      <TextInput
        className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[100px]"
        placeholder="Add any special instructions or notes..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </View>
  );

  const renderReviewStep = () => (
    <View className="p-6">
      <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={24} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-gray-900 ml-3">
            Review Order
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Customer
          </Text>
          <Text className="text-gray-900 font-semibold">
            {selectedCustomer?.name}
          </Text>
          <Text className="text-gray-500 text-sm">
            {selectedCustomer?.email}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Items
          </Text>
          {orderItems.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-gray-700">
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-gray-900 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Payment
          </Text>
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full ${
                paymentMethod === "credit_card"
                  ? "bg-blue-500"
                  : paymentMethod === "cash"
                    ? "bg-green-500"
                    : "bg-purple-500"
              } mr-2`}
            />
            <Text className="text-gray-700">
              {paymentMethods.find((m) => m.id === paymentMethod)?.label}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Shipping
          </Text>
          <Text className="text-gray-700">{shippingAddress.street}</Text>
          <Text className="text-gray-500 text-sm">
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.zip}
          </Text>
          <Text className="text-gray-500 text-sm">
            {shippingAddress.country}
          </Text>
        </View>

        <View className="pt-4 mt-4 border-t-2 border-blue-500">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">Total</Text>
            <Text className="text-2xl font-bold text-blue-500">
              ${calculateTotal().toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {isEditing ? "Edit Order" : "Create Order"}
        </Text>
        <View className="w-10" />
      </View>

      {renderStepIndicator()}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderCustomerStep()}
        {currentStep === 2 && renderItemsStep()}
        {currentStep === 3 && renderDetailsStep()}
        {currentStep === 4 && renderReviewStep()}
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        {currentStep < 4 ? (
          <TouchableOpacity
            className={`flex-row items-center justify-center py-4 rounded-xl ${
              (currentStep === 1 && !selectedCustomer) ||
              (currentStep === 2 && orderItems.length === 0)
                ? "bg-gray-300"
                : "bg-blue-500"
            }`}
            onPress={handleNext}
            disabled={
              (currentStep === 1 && !selectedCustomer) ||
              (currentStep === 2 && orderItems.length === 0)
            }
          >
            <Text className="text-white font-semibold text-lg mr-2">
              Continue
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-row items-center justify-center bg-green-500 py-4 rounded-xl"
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              {isEditing ? "Update Order" : "Create Order"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderForm;
