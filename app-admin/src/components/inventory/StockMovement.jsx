// screens/inventory/StockMovement.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Static stock movements data
const STATIC_MOVEMENTS = {
  'PROD-001': [
    {
      id: 'MOV-001',
      type: 'in',
      quantity: 50,
      balance: 245,
      reason: 'Purchase order #PO-1234',
      reference: 'PO-1234',
      createdAt: '2024-03-15T10:30:00Z',
      createdBy: { name: 'John Doe' },
      location: 'Main Warehouse',
      unitPrice: 29.99,
    },
    {
      id: 'MOV-002',
      type: 'out',
      quantity: 25,
      balance: 195,
      reason: 'Sales order #ORD-001',
      reference: 'ORD-001',
      createdAt: '2024-03-14T14:20:00Z',
      createdBy: { name: 'John Doe' },
      location: 'Main Warehouse',
      unitPrice: 29.99,
    },
    {
      id: 'MOV-003',
      type: 'adjustment',
      quantity: 20,
      balance: 220,
      reason: 'Inventory count adjustment',
      reference: 'ADJ-001',
      createdAt: '2024-03-13T09:15:00Z',
      createdBy: { name: 'System' },
      location: 'Main Warehouse',
      unitPrice: 29.99,
    },
  ],
  'PROD-003': [
    {
      id: 'MOV-004',
      type: 'in',
      quantity: 100,
      balance: 134,
      reason: 'Initial stock',
      reference: 'INIT-001',
      createdAt: '2024-03-10T10:30:00Z',
      createdBy: { name: 'Admin' },
      location: 'Aisle C, Shelf 5',
      unitPrice: 89.99,
    },
    {
      id: 'MOV-005',
      type: 'out',
      quantity: 66,
      balance: 34,
      reason: 'Sales orders',
      reference: 'Multiple',
      createdAt: '2024-03-13T09:15:00Z',
      createdBy: { name: 'System' },
      location: 'Aisle C, Shelf 5',
      unitPrice: 89.99,
    },
  ],
};

// Product details for reference
const PRODUCT_DETAILS = {
  'PROD-001': {
    name: 'Classic White T-Shirt',
    sku: 'TS-WHT-001',
    currentStock: 245,
    minStock: 50,
    maxStock: 500,
    unitPrice: 29.99,
  },
  'PROD-003': {
    name: 'Leather Sneakers',
    sku: 'SN-BLK-009',
    currentStock: 34,
    minStock: 30,
    maxStock: 200,
    unitPrice: 89.99,
  },
};

const StockMovement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const productId = route.params?.productId;

  const [showAddForm, setShowAddForm] = useState(false);
  const [movementForm, setMovementForm] = useState({
    type: 'in',
    quantity: '',
    reason: '',
    reference: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Get product details
  const product = PRODUCT_DETAILS[productId] || {
    name: 'Unknown Product',
    sku: 'N/A',
    currentStock: 0,
  };

  // Get movements for this product
  const movements = useMemo(() => {
    return STATIC_MOVEMENTS[productId] || [];
  }, [productId]);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!movementForm.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (parseInt(movementForm.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    if (!movementForm.reason) {
      errors.reason = 'Reason is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMovement = () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'Success',
      'Stock movement added successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowAddForm(false);
            setMovementForm({
              type: 'in',
              quantity: '',
              reason: '',
              reference: '',
            });
            setFormErrors({});
          },
        },
      ]
    );
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setMovementForm({
      type: 'in',
      quantity: '',
      reason: '',
      reference: '',
    });
    setFormErrors({});
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'in':
        return { icon: 'arrow-down', color: '#10B981', bg: '#D1FAE5' };
      case 'out':
        return { icon: 'arrow-up', color: '#EF4444', bg: '#FEE2E2' };
      case 'adjustment':
        return { icon: 'swap-vertical', color: '#F59E0B', bg: '#FEF3C7' };
      default:
        return { icon: 'swap-horizontal', color: '#6366F1', bg: '#EEF2FF' };
    }
  };

  if (!productId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center"
          >
            <Icon name="arrow-left" size={22} color="#374151" />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-gray-900 text-center">
            Stock Movements
          </Text>
          <View className="w-10" />
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <Icon name="package-variant" size={80} color="#d1d5db" />
          <Text className="text-lg font-semibold text-gray-700 mt-4">
            No Product Selected
          </Text>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Please select a product to view its stock movements
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center"
        >
          <Icon name="arrow-left" size={22} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Stock Movements</Text>
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          className="w-10 h-10 bg-indigo-100 rounded-2xl items-center justify-center"
        >
          <Icon name="plus" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Product Info Card */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 mt-4 p-5 rounded-3xl"
          style={{
            shadowColor: "#6366F1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center">
              <Icon name="package-variant" size={30} color="white" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white text-xl font-bold">{product.name}</Text>
              <Text className="text-white/80 text-sm mt-1">SKU: {product.sku}</Text>
            </View>
          </View>

          <View className="flex-row mt-4 pt-4 border-t border-white/20">
            <View className="flex-1 items-center">
              <Text className="text-white/60 text-xs">Current Stock</Text>
              <Text className="text-white text-2xl font-bold">{product.currentStock}</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-white/60 text-xs">Min Stock</Text>
              <Text className="text-white text-2xl font-bold">{product.minStock}</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-white/60 text-xs">Max Stock</Text>
              <Text className="text-white text-2xl font-bold">{product.maxStock}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Add Movement Form */}
        {showAddForm && (
          <BlurView
            intensity={90}
            tint="light"
            className="mx-4 mt-4 overflow-hidden rounded-3xl"
            style={{
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <View className="p-5 bg-white/70">
              <Text className="text-gray-900 font-bold text-lg mb-4">
                Add Stock Movement
              </Text>

              {/* Movement Type Selector */}
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setMovementForm(prev => ({ ...prev, type: 'in' }))}
                  className={`flex-1 py-3 rounded-l-xl items-center ${
                    movementForm.type === 'in' ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={movementForm.type === 'in' ? 'text-white' : 'text-gray-600'}>
                    Stock In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMovementForm(prev => ({ ...prev, type: 'out' }))}
                  className={`flex-1 py-3 items-center ${
                    movementForm.type === 'out' ? 'bg-red-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={movementForm.type === 'out' ? 'text-white' : 'text-gray-600'}>
                    Stock Out
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMovementForm(prev => ({ ...prev, type: 'adjustment' }))}
                  className={`flex-1 py-3 rounded-r-xl items-center ${
                    movementForm.type === 'adjustment' ? 'bg-orange-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={movementForm.type === 'adjustment' ? 'text-white' : 'text-gray-600'}>
                    Adjustment
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quantity Input */}
              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Quantity</Text>
                <View className={`flex-row items-center bg-gray-50 rounded-xl px-4 border ${
                  formErrors.quantity ? 'border-red-300' : 'border-gray-200'
                }`}>
                  <Icon name="counter" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 py-3 text-gray-900"
                    placeholder="Enter quantity"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    value={movementForm.quantity}
                    onChangeText={(text) => {
                      setMovementForm(prev => ({ ...prev, quantity: text }));
                      if (formErrors.quantity) {
                        setFormErrors(prev => ({ ...prev, quantity: '' }));
                      }
                    }}
                  />
                </View>
                {formErrors.quantity && (
                  <Text className="text-red-500 text-xs mt-1">{formErrors.quantity}</Text>
                )}
              </View>

              {/* Reason Input */}
              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Reason</Text>
                <View className={`bg-gray-50 rounded-xl px-4 border ${
                  formErrors.reason ? 'border-red-300' : 'border-gray-200'
                }`}>
                  <TextInput
                    className="py-3 text-gray-900 min-h-[80px]"
                    placeholder="Enter reason for movement"
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={movementForm.reason}
                    onChangeText={(text) => {
                      setMovementForm(prev => ({ ...prev, reason: text }));
                      if (formErrors.reason) {
                        setFormErrors(prev => ({ ...prev, reason: '' }));
                      }
                    }}
                  />
                </View>
                {formErrors.reason && (
                  <Text className="text-red-500 text-xs mt-1">{formErrors.reason}</Text>
                )}
              </View>

              {/* Reference Input */}
              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Reference (Optional)</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <Icon name="tag" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 py-3 text-gray-900"
                    placeholder="PO number, invoice, etc."
                    placeholderTextColor="#9ca3af"
                    value={movementForm.reference}
                    onChangeText={(text) => setMovementForm(prev => ({ ...prev, reference: text }))}
                  />
                </View>
              </View>

              {/* Form Buttons */}
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPress={handleCancelForm}
                  className="flex-1 bg-gray-100 py-3 rounded-xl mr-2"
                >
                  <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddMovement}
                  className="flex-1 ml-2"
                >
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3 rounded-xl"
                  >
                    <Text className="text-white font-semibold text-center">Add Movement</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        )}

        {/* Movements List */}
        <View className="px-4 mt-4 mb-8">
          <Text className="text-gray-900 font-bold text-lg mb-4">Movement History</Text>

          {movements.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-3xl border border-gray-100">
              <Icon name="swap-horizontal" size={60} color="#d1d5db" />
              <Text className="text-gray-700 font-semibold mt-4">No Movements Yet</Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                Add your first stock movement using the + button above
              </Text>
            </View>
          ) : (
            movements.map((movement, index) => {
              const movementIcon = getMovementIcon(movement.type);
              return (
                <BlurView
                  key={movement.id}
                  intensity={80}
                  tint="light"
                  className="overflow-hidden rounded-2xl mb-3"
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <View className="p-4 bg-white/70">
                    <View className="flex-row items-center">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: movementIcon.bg }}
                      >
                        <Icon
                          name={movementIcon.icon}
                          size={24}
                          color={movementIcon.color}
                        />
                      </View>

                      <View className="flex-1">
                        <View className="flex-row justify-between items-start">
                          <Text className="text-gray-900 font-bold">
                            {movement.type === 'in' ? 'Stock In' :
                             movement.type === 'out' ? 'Stock Out' : 'Adjustment'}
                          </Text>
                          <Text className="text-xs text-gray-400">
                            {formatDate(movement.createdAt)}
                          </Text>
                        </View>

                        <View className="flex-row mt-2">
                          <View className="flex-1">
                            <Text className="text-gray-400 text-xs">Quantity</Text>
                            <Text
                              className={`font-bold ${
                                movement.type === 'in' ? 'text-green-600' :
                                movement.type === 'out' ? 'text-red-600' : 'text-orange-600'
                              }`}
                            >
                              {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                              {movement.quantity} units
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-gray-400 text-xs">Balance</Text>
                            <Text className="text-gray-900 font-bold">
                              {movement.balance} units
                            </Text>
                          </View>
                          {movement.unitPrice && (
                            <View className="flex-1">
                              <Text className="text-gray-400 text-xs">Value</Text>
                              <Text className="text-gray-900 font-bold">
                                {formatCurrency(movement.quantity * movement.unitPrice)}
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text className="text-gray-600 text-sm mt-2">
                          {movement.reason}
                        </Text>

                        <View className="flex-row items-center mt-2">
                          <Icon name="account" size={12} color="#9ca3af" />
                          <Text className="text-gray-400 text-xs ml-1">
                            {movement.createdBy.name}
                          </Text>
                          <Icon name="map-marker" size={12} color="#9ca3af" style={{ marginLeft: 12 }} />
                          <Text className="text-gray-400 text-xs ml-1">
                            {movement.location}
                          </Text>
                        </View>

                        {movement.reference && (
                          <View className="flex-row items-center mt-1">
                            <Icon name="tag" size={12} color="#9ca3af" />
                            <Text className="text-gray-400 text-xs ml-1">
                              Ref: {movement.reference}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </BlurView>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockMovement;