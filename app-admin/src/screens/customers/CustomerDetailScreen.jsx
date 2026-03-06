import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Static customers data (same as in CustomerList)
const STATIC_CUSTOMERS = {
  "CUST-001": {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Smith Enterprises",
    status: "active",
    orderCount: 24,
    totalSpent: 5840.5,
    averageOrderValue: 243.35,
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    notes:
      "Premium customer, prefers email communication. Has been with us for over 2 years. Frequently orders bulk items for his business.",
    createdAt: "2024-01-15T10:30:00Z",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    lastOrder: "2024-03-15T10:30:00Z",
    preferredPayment: "Credit Card",
    taxId: "12-3456789",
    tags: ["premium", "business", "bulk-orders"],
  },
  "CUST-002": {
    id: "CUST-002",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 234-5678",
    company: "Wilson Designs",
    status: "active",
    orderCount: 18,
    totalSpent: 4250.75,
    averageOrderValue: 236.15,
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    notes: "Interested in new collections. Loves seasonal items.",
    createdAt: "2024-01-20T14:20:00Z",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    lastOrder: "2024-03-14T14:20:00Z",
    preferredPayment: "PayPal",
    tags: ["designer", "seasonal"],
  },
  "CUST-003": {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 345-6789",
    company: "Brown Consulting",
    status: "active",
    orderCount: 12,
    totalSpent: 2890.25,
    averageOrderValue: 240.85,
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    notes: "Corporate account, needs invoices. Monthly orders.",
    createdAt: "2024-02-01T09:15:00Z",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    lastOrder: "2024-03-13T09:15:00Z",
    preferredPayment: "Bank Transfer",
    taxId: "98-7654321",
    tags: ["corporate", "monthly"],
  },
  "CUST-004": {
    id: "CUST-004",
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "+1 (555) 456-7890",
    company: "Davis Law Firm",
    status: "active",
    orderCount: 8,
    totalSpent: 1950.0,
    averageOrderValue: 243.75,
    address: {
      street: "321 Elm Boulevard",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "USA",
    },
    notes: "Prefers phone calls. Legal professional, needs detailed invoices.",
    createdAt: "2024-02-10T16:45:00Z",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    lastOrder: "2024-03-12T16:45:00Z",
    preferredPayment: "Credit Card",
    tags: ["legal", "phone-pref"],
  },
  "CUST-005": {
    id: "CUST-005",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 (555) 567-8901",
    company: "Lee Innovations",
    status: "inactive",
    orderCount: 5,
    totalSpent: 1250.5,
    averageOrderValue: 250.1,
    address: {
      street: "654 Cedar Lane",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "USA",
    },
    notes: "Temporary inactive - on sabbatical. Will return in June.",
    createdAt: "2024-02-15T11:30:00Z",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    lastOrder: "2024-02-28T11:30:00Z",
    preferredPayment: "PayPal",
    tags: ["tech", "inactive"],
  },
  "CUST-006": {
    id: "CUST-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 678-9012",
    company: "Anderson Art",
    status: "active",
    orderCount: 15,
    totalSpent: 3675.8,
    averageOrderValue: 245.05,
    address: {
      street: "987 Maple Drive",
      city: "Philadelphia",
      state: "PA",
      zip: "19101",
      country: "USA",
    },
    notes: "VIP customer - sends referrals. Art gallery owner.",
    createdAt: "2024-01-05T13:20:00Z",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    lastOrder: "2024-03-10T13:20:00Z",
    preferredPayment: "Credit Card",
    tags: ["vip", "art", "referrals"],
  },
  "CUST-007": {
    id: "CUST-007",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: null,
    company: "Wilson Tech",
    status: "active",
    orderCount: 10,
    totalSpent: 2450.0,
    averageOrderValue: 245.0,
    address: {
      street: "147 Birch Street",
      city: "San Antonio",
      state: "TX",
      zip: "78201",
      country: "USA",
    },
    notes: "New customer - tech startup founder. Interested in bulk discounts.",
    createdAt: "2024-03-01T10:00:00Z",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    lastOrder: "2024-03-11T10:00:00Z",
    preferredPayment: "Bank Transfer",
    tags: ["tech", "startup", "new"],
  },
  "CUST-008": {
    id: "CUST-008",
    name: "Maria Garcia",
    email: null,
    phone: "+1 (555) 890-1234",
    company: "Garcia Designs",
    status: "inactive",
    orderCount: 3,
    totalSpent: 750.25,
    averageOrderValue: 250.08,
    address: {
      street: "258 Walnut Avenue",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      country: "USA",
    },
    notes: "On vacation until May. Interior designer.",
    createdAt: "2024-02-20T15:30:00Z",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    lastOrder: "2024-02-25T15:30:00Z",
    preferredPayment: "Credit Card",
    tags: ["design", "vacation"],
  },
  "CUST-009": {
    id: "CUST-009",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 901-2345",
    company: "Taylor Construction",
    status: "active",
    orderCount: 32,
    totalSpent: 8920.0,
    averageOrderValue: 278.75,
    address: {
      street: "369 Spruce Street",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA",
    },
    notes: "Construction company - bulk orders every month.",
    createdAt: "2023-12-10T09:00:00Z",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    lastOrder: "2024-03-09T09:00:00Z",
    preferredPayment: "Bank Transfer",
    taxId: "45-6789012",
    tags: ["construction", "bulk", "monthly"],
  },
  "CUST-010": {
    id: "CUST-010",
    name: "Jennifer Park",
    email: "jennifer.park@email.com",
    phone: "+1 (555) 012-3456",
    company: "Park Consulting",
    status: "active",
    orderCount: 7,
    totalSpent: 1850.5,
    averageOrderValue: 264.36,
    address: {
      street: "753 Aspen Road",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    notes: "Business consultant - orders for corporate events.",
    createdAt: "2024-02-25T11:45:00Z",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    lastOrder: "2024-03-08T11:45:00Z",
    preferredPayment: "Credit Card",
    tags: ["consulting", "corporate"],
  },
};

// Recent orders for customers
const CUSTOMER_ORDERS = {
  "CUST-001": [
    {
      id: "ORD-001",
      orderNumber: "ORD-001",
      total: 299.99,
      status: "delivered",
      createdAt: "2024-03-15T10:30:00Z",
      items: 3,
    },
    {
      id: "ORD-012",
      orderNumber: "ORD-012",
      total: 459.99,
      status: "delivered",
      createdAt: "2024-03-01T14:20:00Z",
      items: 4,
    },
    {
      id: "ORD-023",
      orderNumber: "ORD-023",
      total: 189.5,
      status: "processing",
      createdAt: "2024-02-15T09:15:00Z",
      items: 2,
    },
  ],
  "CUST-002": [
    {
      id: "ORD-002",
      orderNumber: "ORD-002",
      total: 189.5,
      status: "processing",
      createdAt: "2024-03-14T14:20:00Z",
      items: 2,
    },
    {
      id: "ORD-015",
      orderNumber: "ORD-015",
      total: 329.99,
      status: "delivered",
      createdAt: "2024-02-28T11:30:00Z",
      items: 3,
    },
  ],
  "CUST-003": [
    {
      id: "ORD-003",
      orderNumber: "ORD-003",
      total: 79.99,
      status: "pending",
      createdAt: "2024-03-13T09:15:00Z",
      items: 1,
    },
    {
      id: "ORD-018",
      orderNumber: "ORD-018",
      total: 245.5,
      status: "delivered",
      createdAt: "2024-02-20T16:45:00Z",
      items: 2,
    },
  ],
  "CUST-004": [
    {
      id: "ORD-004",
      orderNumber: "ORD-004",
      total: 159.99,
      status: "delivered",
      createdAt: "2024-03-12T16:45:00Z",
      items: 2,
    },
  ],
  "CUST-005": [
    {
      id: "ORD-005",
      orderNumber: "ORD-005",
      total: 89.99,
      status: "delivered",
      createdAt: "2024-02-28T11:30:00Z",
      items: 1,
    },
  ],
  "CUST-006": [
    {
      id: "ORD-006",
      orderNumber: "ORD-006",
      total: 234.5,
      status: "delivered",
      createdAt: "2024-03-10T13:20:00Z",
      items: 2,
    },
    {
      id: "ORD-019",
      orderNumber: "ORD-019",
      total: 345.0,
      status: "delivered",
      createdAt: "2024-02-15T10:30:00Z",
      items: 3,
    },
  ],
  "CUST-007": [
    {
      id: "ORD-007",
      orderNumber: "ORD-007",
      total: 445.0,
      status: "delivered",
      createdAt: "2024-03-11T10:00:00Z",
      items: 4,
    },
  ],
  "CUST-008": [
    {
      id: "ORD-008",
      orderNumber: "ORD-008",
      total: 250.08,
      status: "delivered",
      createdAt: "2024-02-25T15:30:00Z",
      items: 3,
    },
  ],
  "CUST-009": [
    {
      id: "ORD-009",
      orderNumber: "ORD-009",
      total: 567.5,
      status: "delivered",
      createdAt: "2024-03-09T09:00:00Z",
      items: 5,
    },
    {
      id: "ORD-020",
      orderNumber: "ORD-020",
      total: 890.0,
      status: "delivered",
      createdAt: "2024-02-10T14:30:00Z",
      items: 8,
    },
    {
      id: "ORD-031",
      orderNumber: "ORD-031",
      total: 445.0,
      status: "processing",
      createdAt: "2024-01-15T11:00:00Z",
      items: 4,
    },
  ],
  "CUST-010": [
    {
      id: "ORD-010",
      orderNumber: "ORD-010",
      total: 264.36,
      status: "delivered",
      createdAt: "2024-03-08T11:45:00Z",
      items: 2,
    },
  ],
};

const CustomerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Load customer data from static object
    const customerData = STATIC_CUSTOMERS[customerId];
    if (customerData) {
      setCustomer(customerData);
      setRecentOrders(CUSTOMER_ORDERS[customerId] || []);
    }
  }, [customerId]);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    navigation.navigate("AddCustomer", { customerId });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer? This action cannot be undone.",
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

  const handleCall = () => {
    if (customer?.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const handleEmail = () => {
    if (customer?.email) {
      Linking.openURL(`mailto:${customer.email}`);
    }
  };

  const handleMessage = () => {
    if (customer?.phone) {
      Linking.openURL(`sms:${customer.phone}`);
    }
  };

  const handleViewAllOrders = () => {
    navigation.navigate("Orders", { customerId });
  };

  if (!customer) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-1 items-center justify-center">
          <Icon name="account-off" size={80} color="#d1d5db" />
          <Text className="text-lg font-semibold text-gray-700 mt-4">
            Customer not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isActive = customer.status === "active";

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}
    style={{ paddingBottom: 60 }}
    >
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
          Customer Profile
        </Text>
        <TouchableOpacity
          onPress={handleEdit}
          className="w-10 h-10 bg-indigo-100 rounded-2xl items-center justify-center"
        >
          <Icon name="pencil" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={isActive ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 mt-4 p-6 rounded-3xl"
          style={{
            shadowColor: isActive ? "#10B981" : "#EF4444",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
            borderRadius:10
          }}
        >
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center">
              <Text className="text-white text-4xl font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white text-2xl font-bold">
                {customer.name}
              </Text>
              {customer.company && (
                <Text className="text-white/80 text-sm mt-1">
                  {customer.company}
                </Text>
              )}
              <View className="flex-row mt-2">
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    {customer.status.toUpperCase()}
                  </Text>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full ml-2">
                  <Text className="text-white text-xs font-semibold">
                    Member since {formatDate(customer.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View className="flex-row mx-4 mt-4">
          <TouchableOpacity
            onPress={handleCall}
            disabled={!customer.phone}
            className={`flex-1 bg-white p-4 rounded-2xl mr-2 border border-gray-100 items-center ${
              !customer.phone ? 'opacity-50' : ''
            }`}
          >
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mb-2">
              <Icon name="phone" size={22} color="#10B981" />
            </View>
            <Text className="text-gray-700 text-sm font-medium">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmail}
            disabled={!customer.email}
            className={`flex-1 bg-white p-4 rounded-2xl mx-2 border border-gray-100 items-center ${
              !customer.email ? 'opacity-50' : ''
            }`}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mb-2">
              <Icon name="email" size={22} color="#6366F1" />
            </View>
            <Text className="text-gray-700 text-sm font-medium">Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMessage}
            disabled={!customer.phone}
            className={`flex-1 bg-white p-4 rounded-2xl ml-2 border border-gray-100 items-center ${
              !customer.phone ? 'opacity-50' : ''
            }`}
          >
            <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center mb-2">
              <Icon name="message" size={22} color="#8B5CF6" />
            </View>
            <Text className="text-gray-700 text-sm font-medium">Message</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View className="mx-4 mt-4 bg-white p-5 rounded-3xl border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-indigo-100 rounded-xl items-center justify-center mr-3">
              <Icon name="card-account-details" size={20} color="#6366F1" />
            </View>
            <Text className="text-lg font-bold text-gray-900">
              Contact Information
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Icon name="email-outline" size={18} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">
                {customer.email || "No email provided"}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Icon name="phone-outline" size={18} color="#9ca3af" />
              <Text className="text-gray-600 ml-3 flex-1">
                {customer.phone || "No phone number"}
              </Text>
            </View>

            {customer.preferredPayment && (
              <View className="flex-row items-center">
                <Icon name="credit-card-outline" size={18} color="#9ca3af" />
                <Text className="text-gray-600 ml-3 flex-1">
                  {customer.preferredPayment}
                </Text>
              </View>
            )}

            {customer.taxId && (
              <View className="flex-row items-center">
                <Icon name="file-document-outline" size={18} color="#9ca3af" />
                <Text className="text-gray-600 ml-3 flex-1">
                  Tax ID: {customer.taxId}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Address */}
        {customer.address && (
          <View className="mx-4 mt-4 bg-white p-5 rounded-3xl border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-3">
                <Icon name="map-marker" size={20} color="#10B981" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Address</Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-2xl">
              <Text className="text-gray-900 font-medium">
                {customer.address.street}
              </Text>
              <Text className="text-gray-600 mt-1">
                {customer.address.city}, {customer.address.state}{" "}
                {customer.address.zip}
              </Text>
              <Text className="text-gray-600">{customer.address.country}</Text>
            </View>
          </View>
        )}

        {/* Statistics */}
        <View className="mx-4 mt-4 bg-white p-5 rounded-3xl border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center mr-3">
              <Icon name="chart-line" size={20} color="#F59E0B" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Statistics</Text>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">
                {customer.orderCount}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">Total Orders</Text>
            </View>

            <View className="w-px h-10 bg-gray-200" />

            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">
                {formatCurrency(customer.totalSpent)}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">Total Spent</Text>
            </View>

            <View className="w-px h-10 bg-gray-200" />

            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">
                {formatCurrency(customer.averageOrderValue)}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">Avg Order</Text>
            </View>
          </View>
        </View>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <View className="mx-4 mt-4 bg-white p-5 rounded-3xl border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center mr-3">
                <Icon name="tag-multiple" size={20} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Tags</Text>
            </View>

            <View className="flex-row flex-wrap">
              {customer.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-indigo-50 px-3 py-1.5 rounded-full mr-2 mb-2"
                >
                  <Text className="text-indigo-600 text-xs font-medium">
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {customer.notes && (
          <View className="mx-4 mt-4 bg-white p-5 rounded-3xl border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-3">
                <Icon name="note-text" size={20} color="#6366F1" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Notes</Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-2xl">
              <Text className="text-gray-600 leading-6">{customer.notes}</Text>
            </View>
          </View>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <View className="mx-4 mt-4 mb-8 bg-white p-5 rounded-3xl border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-pink-100 rounded-xl items-center justify-center mr-3">
                  <Icon name="clipboard-list" size={20} color="#EC4899" />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  Recent Orders
                </Text>
              </View>
              <TouchableOpacity onPress={handleViewAllOrders}>
                <Text className="text-indigo-600 text-sm font-semibold">
                  View All →
                </Text>
              </TouchableOpacity>
            </View>

            {recentOrders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                onPress={() =>
                  navigation.navigate("OrderDetail", { orderId: order.id })
                }
                className={`flex-row items-center py-3 ${
                  index !== recentOrders.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <LinearGradient
                  colors={["#6366F1", "#8B5CF6"]}
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ borderRadius: 3 }}
                >
                  <Text className="text-white font-bold text-xs">
                    #{order.orderNumber.slice(-3)}
                  </Text>
                </LinearGradient>

                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {order.orderNumber}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {order.items} items • {formatDate(order.createdAt)}
                  </Text>
                </View>

                <Text className="text-gray-900 font-bold mr-3">
                  {formatCurrency(order.total)}
                </Text>

                <Icon name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Delete Button */}
        <View className="mx-4 mb-8">
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-50 py-4 rounded-2xl border border-red-200"
          >
            <Text className="text-red-600 font-semibold text-center">
              Delete Customer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDetailScreen;