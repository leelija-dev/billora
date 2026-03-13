import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const { width } = Dimensions.get("window");

const BillGenerationScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  
  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("a4"); // 'a4' or 'thermal'
  const [loading, setLoading] = useState(false);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // Mock data for stores
  const stores = [
    { id: 1, name: "Main Store", address: "123 Main St" },
    { id: 2, name: "Branch Store", address: "456 Oak Ave" },
  ];
  
  // Mock products for search
  const mockProducts = [
    { id: 1, name: "Classic White T-Shirt", code: "PRD001", price: 29.99, stock: 50, unit: "Pieces", gst: 5 },
    { id: 2, name: "Slim Fit Jeans", code: "PRD002", price: 89.99, stock: 25, unit: "Pieces", gst: 5 },
    { id: 3, name: "Leather Sneakers", code: "PRD003", price: 129.99, stock: 15, unit: "Pairs", gst: 18 },
  ];

  const calculateTotals = () => {
    const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalGST = products.reduce((sum, item) => sum + (item.gst * item.quantity), 0);
    const totalDiscount = products.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
    const total = subtotal + totalGST - totalDiscount;
    
    return { subtotal, totalGST, totalDiscount, total };
  };

  const addProduct = (product) => {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
      updateProductQuantity(product.id, existingProduct.quantity + 1);
    } else {
      setProducts([...products, {
        ...product,
        quantity: 1,
        discount: 0,
        totalPrice: product.price
      }]);
    }
    setShowProductSearch(false);
    setSearchQuery("");
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    
    setProducts(products.map(item => {
      if (item.id === productId) {
        const totalPrice = (item.price + item.gst - item.discount) * quantity;
        return { ...item, quantity, totalPrice };
      }
      return item;
    }));
  };

  const updateProductDiscount = (productId, discount) => {
    setProducts(products.map(item => {
      if (item.id === productId) {
        const totalPrice = (item.price + item.gst - discount) * item.quantity;
        return { ...item, discount, totalPrice };
      }
      return item;
    }));
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(item => item.id !== productId));
  };

  const searchProducts = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.code.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleGenerateBill = async () => {
    if (products.length === 0) {
      Alert.alert("Error", "Please add at least one product to generate bill");
      return;
    }
    
    if (!customerName.trim()) {
      Alert.alert("Error", "Customer name is required");
      return;
    }
    
    if (!selectedStore) {
      Alert.alert("Error", "Please select a store");
      return;
    }

    try {
      setLoading(true);
      
      const billData = {
        user_id: 1, // Should come from auth store
        customer_id: 1, // Should be selected from customer list
        store_id: selectedStore,
        paid_amount: parseFloat(paidAmount) || calculateTotals().total,
        created_by: 1, // Should come from auth store
        items: products.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          item_count: item.quantity,
          unit_id: 1, // Should come from product data
          price: item.price,
          gst: item.gst,
          discount: item.discount,
          total_price: item.totalPrice,
          status: 'completed'
        }))
      };

      // API call to save bill
      const response = await fetch('http://localhost:8000/api/invoice/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData)
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          "Success",
          "Bill generated successfully!",
          [
            { text: "View Bill", onPress: () => navigation.navigate("BillDetail", { billId: result.id }) },
            { text: "Generate New", onPress: () => resetForm() },
            { text: "OK", style: "cancel" }
          ]
        );
      } else {
        throw new Error('Failed to generate bill');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate bill. Please try again.");
      console.error('Bill generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setPaidAmount("");
    setSelectedStore("");
    setProducts([]);
  };

  const { subtotal, totalGST, totalDiscount, total } = calculateTotals();

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-16`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      {/* Header */}
      <Header
        title="Generate Bill"
        userName="John Doe"
        userEmail="john@example.com"
        activeScreen="Billing"
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("BillHistory")}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="history" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("BillHistory")}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="file-document-outline" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Customer Information */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Customer Information
          </Text>

          <View className="space-y-4">
            <Input
              label="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              leftIcon="account"
              isDarkMode={isDarkMode}
            />

            <Input
              label="Phone Number"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Enter phone number"
              leftIcon="phone"
              keyboardType="phone-pad"
              isDarkMode={isDarkMode}
            />

            <Input
              label="Email"
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="Enter email address"
              leftIcon="email"
              keyboardType="email-address"
              isDarkMode={isDarkMode}
            />

            {/* Store Selection */}
            <View className="mb-4">
              <Text className={`text-sm mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Store <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row gap-2">
                {stores.map((store) => (
                  <TouchableOpacity
                    key={store.id}
                    onPress={() => setSelectedStore(store.id)}
                    className={`flex-1 p-3 rounded-xl border ${
                      selectedStore === store.id
                        ? 'bg-blue-500 border-blue-500'
                        : isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text className={`text-center text-sm ${
                      selectedStore === store.id ? 'text-white' : 
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {store.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Product Search */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Add Products
          </Text>

          <View className={`flex-row items-center rounded-xl border ${
            isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <Icon name="magnify" size={20} color="#9ca3af" />
            <TextInput
              className={`flex-1 ml-3 text-base h-12 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Search products by name or code..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={searchProducts}
              onFocus={() => setShowProductSearch(true)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}>
                <Icon name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results */}
          {showProductSearch && searchResults.length > 0 && (
            <View className={`mt-2 rounded-xl border ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              {searchResults.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => addProduct(product)}
                  className={`p-3 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {product.name}
                      </Text>
                      <Text className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {product.code} • Stock: {product.stock}
                      </Text>
                    </View>
                    <Text className={`font-semibold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      ₹{product.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Products List */}
        {products.length > 0 && (
          <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-base font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Bill Items
            </Text>

            {products.map((item, index) => (
              <View key={item.id} className={`mb-3 p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {item.name}
                    </Text>
                    <Text className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {item.code} • {item.unit}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeProduct(item.id)}
                    className="ml-2"
                  >
                    <Icon name="close-circle" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => updateProductQuantity(item.id, item.quantity - 1)}
                      className={`w-8 h-8 rounded-lg items-center justify-center ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                    >
                      <Icon name="minus" size={16} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
                    </TouchableOpacity>
                    
                    <TextInput
                      className={`w-12 text-center font-medium ${
                        isDarkMode ? 'text-white bg-gray-600' : 'text-gray-800 bg-gray-100'
                      }`}
                      value={item.quantity.toString()}
                      onChangeText={(text) => updateProductQuantity(item.id, parseInt(text) || 0)}
                      keyboardType="numeric"
                    />
                    
                    <TouchableOpacity
                      onPress={() => updateProductQuantity(item.id, item.quantity + 1)}
                      className={`w-8 h-8 rounded-lg items-center justify-center ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                    >
                      <Icon name="plus" size={16} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TextInput
                      className={`w-16 text-right text-sm ${
                        isDarkMode ? 'text-white bg-gray-600' : 'text-gray-800 bg-gray-100'
                      }`}
                      value={item.discount.toString()}
                      onChangeText={(text) => updateProductDiscount(item.id, parseFloat(text) || 0)}
                      placeholder="Discount"
                      keyboardType="decimal-pad"
                    />
                    <Text className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Disc.
                    </Text>
                  </View>

                  <Text className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    ₹{item.totalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bill Summary */}
        {products.length > 0 && (
          <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-base font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Bill Summary
            </Text>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Subtotal
                </Text>
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  GST
                </Text>
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  ₹{totalGST.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Discount
                </Text>
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  -₹{totalDiscount.toFixed(2)}
                </Text>
              </View>

              <View className={`flex-row justify-between pt-2 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <Text className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Total
                </Text>
                <Text className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  ₹{total.toFixed(2)}
                </Text>
              </View>
            </View>

            <Input
              label="Paid Amount"
              value={paidAmount}
              onChangeText={setPaidAmount}
              placeholder="Enter paid amount"
              leftIcon="currency-usd"
              keyboardType="decimal-pad"
              isDarkMode={isDarkMode}
              containerClassName="mt-4"
            />
          </View>
        )}

        {/* Printer Selection */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Print Options
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedPrinter("a4")}
              className={`flex-1 p-4 rounded-xl border-2 ${
                selectedPrinter === "a4"
                  ? 'border-blue-500 bg-blue-50'
                  : isDarkMode 
                    ? 'border-gray-700 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Icon 
                name="file-document-outline" 
                size={24} 
                color={selectedPrinter === "a4" ? "#3b82f6" : isDarkMode ? "#9CA3AF" : "#6b7280"} 
              />
              <Text className={`text-center mt-2 text-sm ${
                selectedPrinter === "a4" ? 'text-blue-600' : 
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                A4 Size
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPrinter("thermal")}
              className={`flex-1 p-4 rounded-xl border-2 ${
                selectedPrinter === "thermal"
                  ? 'border-blue-500 bg-blue-50'
                  : isDarkMode 
                    ? 'border-gray-700 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Icon 
                name="printer" 
                size={24} 
                color={selectedPrinter === "thermal" ? "#3b82f6" : isDarkMode ? "#9CA3AF" : "#6b7280"} 
              />
              <Text className={`text-center mt-2 text-sm ${
                selectedPrinter === "thermal" ? 'text-blue-600' : 
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                3" Thermal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Generate Button */}
        <View className="px-4 mb-6">
          <Button
            title="Generate Bill"
            onPress={handleGenerateBill}
            loading={loading}
            disabled={products.length === 0 || !customerName.trim() || !selectedStore}
            className="bg-blue-500 py-4 rounded-xl"
            textClassName="text-white font-semibold text-lg"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BillGenerationScreen;
