import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

const { width } = Dimensions.get("window");

const BillDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billId } = route.params || {};
  const { isDarkMode } = useThemeStore();
  
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrinter, setSelectedPrinter] = useState("a4"); // 'a4' or 'thermal'
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Mock bill data
  const mockBill = {
    id: billId || 1,
    invoiceNumber: "INV-001",
    customerName: "John Smith",
    customerPhone: "+91 98765 43210",
    customerEmail: "john.smith@email.com",
    totalAmount: 1299.99,
    paidAmount: 1300.00,
    balanceAmount: -0.01,
    status: "paid",
    paymentMethod: "cash",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:35:00Z",
    store: {
      id: 1,
      name: "Main Store",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      phone: "+91 22 1234 5678",
      email: "main@store.com"
    },
    items: [
      {
        id: 1,
        name: "Classic White T-Shirt",
        code: "PRD001",
        quantity: 2,
        unit: "Pieces",
        price: 299.99,
        gst: 30.00,
        discount: 10.00,
        totalPrice: 589.98
      },
      {
        id: 2,
        name: "Slim Fit Jeans",
        code: "PRD002",
        quantity: 1,
        unit: "Pieces",
        price: 599.99,
        gst: 60.00,
        discount: 20.00,
        totalPrice: 639.99
      },
      {
        id: 3,
        name: "Leather Belt",
        code: "PRD004",
        quantity: 1,
        unit: "Pieces",
        price: 149.99,
        gst: 15.00,
        discount: 5.00,
        totalPrice: 159.99
      }
    ],
    paymentHistory: [
      {
        id: 1,
        amount: 1000.00,
        method: "cash",
        date: "2024-03-15T10:30:00Z",
        notes: "Initial payment"
      },
      {
        id: 2,
        amount: 300.00,
        method: "upi",
        date: "2024-03-15T10:35:00Z",
        notes: "Remaining balance"
      }
    ]
  };

  useEffect(() => {
    fetchBillDetail();
  }, [billId]);

  const fetchBillDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/invoice/${billId}`);
      const data = await response.json();
      setBill(data.data || mockBill);
    } catch (error) {
      console.error('Error fetching bill detail:', error);
      setBill(mockBill);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = async () => {
    try {
      const printData = {
        billId: bill.id,
        printerType: selectedPrinter,
        format: selectedPrinter === 'a4' ? 'pdf' : 'thermal'
      };

      const response = await fetch(`http://localhost:8000/api/invoice/print/${bill.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${bill.invoiceNumber}.${selectedPrinter === 'a4' ? 'pdf' : 'txt'}`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        Alert.alert("Success", "Bill downloaded successfully!");
      } else {
        throw new Error('Failed to print bill');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to print bill. Please try again.");
      console.error('Print error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const billText = `
INVOICE: ${bill.invoiceNumber}
Customer: ${bill.customerName}
Date: ${formatDate(bill.createdAt)}
Total: ${formatCurrency(bill.totalAmount)}
Status: ${bill.status.toUpperCase()}

Items:
${bill.items.map(item => 
  `${item.name} - ${item.quantity} ${item.unit} - ${formatCurrency(item.totalPrice)}`
).join('\n')}
      `.trim();

      await Share.share({
        message: billText,
        title: `Invoice ${bill.invoiceNumber}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleEmail = () => {
    const subject = `Invoice ${bill.invoiceNumber}`;
    const body = `
Dear ${bill.customerName},

Please find attached your invoice ${bill.invoiceNumber} dated ${formatDate(bill.createdAt)}.

Invoice Details:
- Total Amount: ${formatCurrency(bill.totalAmount)}
- Status: ${bill.status.toUpperCase()}

Thank you for your business!

Best regards,
${bill.store.name}
    `.trim();

    const mailtoUrl = `mailto:${bill.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert("Error", "Could not open email app");
    });
  };

  const handleWhatsApp = () => {
    const message = `
Hello ${bill.customerName},
Your invoice ${bill.invoiceNumber} for ${formatCurrency(bill.totalAmount)} is ready.
Status: ${bill.status.toUpperCase()}
    `.trim();

    const whatsappUrl = `https://wa.me/${bill.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert("Error", "Could not open WhatsApp");
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: { bg: "#D1FAE5", text: "#059669", darkBg: "#065F46", darkText: "#6EE7B7" },
      partial: { bg: "#FEF3C7", text: "#D97706", darkBg: "#92400E", darkText: "#FCD34D" },
      pending: { bg: "#FEE2E2", text: "#DC2626", darkBg: "#7F1D1D", darkText: "#FCA5A5" },
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />
        <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
          Loading bill details...
        </Text>
      </View>
    );
  }

  if (!bill) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />
        <Icon name="file-question" size={64} color="#9ca3af" />
        <Text className={`mt-4 text-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-500'
        }`}>
          Bill not found
        </Text>
      </View>
    );
  }

  const statusColors = getStatusColor(bill.status);
  const subtotal = bill.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalGST = bill.items.reduce((sum, item) => sum + item.gst, 0);
  const totalDiscount = bill.items.reduce((sum, item) => sum + item.discount, 0);

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#111827" : "#ffffff"} />

      {/* Header */}
      <Header
        title={`Invoice ${bill.invoiceNumber}`}
        userName="John Doe"
        userEmail="john@example.com"
        activeScreen="Billing"
        rightComponent={
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleShare}
              className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="share-variant" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrint}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="printer" size={22} color={isDarkMode ? "#9CA3AF" : "#4b5563"} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Invoice Header */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className={`text-lg font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {bill.store.name}
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {bill.store.address}
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {bill.store.phone}
              </Text>
            </View>
            
            <View className="items-end">
              <Text className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                INVOICE
              </Text>
              <Text className={`text-lg font-semibold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {bill.invoiceNumber}
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formatDate(bill.createdAt)}
              </Text>
            </View>
          </View>

          <View className={`flex-row justify-between pt-3 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <View className="flex-1">
              <Text className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Bill To:
              </Text>
              <Text className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {bill.customerName}
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {bill.customerPhone}
              </Text>
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {bill.customerEmail}
              </Text>
            </View>

            <View className="items-end">
              <View className={`px-3 py-1 rounded-full ${
                isDarkMode ? statusColors.darkBg : statusColors.bg
              }`}>
                <Text className={`text-sm font-bold ${
                  isDarkMode ? statusColors.darkText : statusColors.text
                }`}>
                  {bill.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Items */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-base font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Invoice Items
          </Text>

          <View className={`mb-3 pb-2 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <View className="flex-row">
              <Text className={`flex-2 text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Item
              </Text>
              <Text className={`flex-1 text-center text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Qty
              </Text>
              <Text className={`flex-1 text-right text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Price
              </Text>
              <Text className={`flex-1 text-right text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                GST
              </Text>
              <Text className={`flex-1 text-right text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Disc.
              </Text>
              <Text className={`flex-1 text-right text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total
              </Text>
            </View>
          </View>

          {bill.items.map((item, index) => (
            <View key={item.id} className={`py-3 ${index < bill.items.length - 1 ? 'border-b' : ''} ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <View className="flex-row">
                <View className="flex-2">
                  <Text className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.name}
                  </Text>
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {item.code}
                  </Text>
                </View>
                <Text className={`flex-1 text-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {item.quantity} {item.unit}
                </Text>
                <Text className={`flex-1 text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {formatCurrency(item.price)}
                </Text>
                <Text className={`flex-1 text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {formatCurrency(item.gst)}
                </Text>
                <Text className={`flex-1 text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {formatCurrency(item.discount)}
                </Text>
                <Text className={`flex-1 text-right font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Invoice Summary */}
        <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Subtotal
              </Text>
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {formatCurrency(subtotal)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Total GST
              </Text>
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {formatCurrency(totalGST)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Total Discount
              </Text>
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                -{formatCurrency(totalDiscount)}
              </Text>
            </View>

            <View className={`flex-row justify-between pt-2 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Text className={`font-bold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Total Amount
              </Text>
              <Text className={`font-bold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {formatCurrency(bill.totalAmount)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Paid Amount
              </Text>
              <Text className={`font-semibold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatCurrency(bill.paidAmount)}
              </Text>
            </View>

            <View className={`flex-row justify-between pt-2 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Text className={`font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Balance
              </Text>
              <Text className={`font-bold ${
                bill.balanceAmount >= 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {formatCurrency(Math.abs(bill.balanceAmount))}
                {bill.balanceAmount > 0 ? ' Due' : ' Refund'}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        {bill.paymentHistory && bill.paymentHistory.length > 0 && (
          <View className={`rounded-2xl p-4 shadow-sm mb-6 mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-base font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Payment History
            </Text>

            {bill.paymentHistory.map((payment) => (
              <View key={payment.id} className={`mb-3 p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Icon name="credit-card" size={16} color="#9ca3af" />
                      <Text className={`ml-2 font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {payment.method.toUpperCase()}
                      </Text>
                    </View>
                    {payment.notes && (
                      <Text className={`text-sm mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {payment.notes}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className={`font-semibold ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDateTime(payment.date)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              onPress={() => setSelectedPrinter("a4")}
              className={`flex-1 p-3 rounded-xl border-2 ${
                selectedPrinter === "a4"
                  ? 'border-blue-500 bg-blue-50'
                  : isDarkMode 
                    ? 'border-gray-700 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Icon 
                name="file-document-outline" 
                size={20} 
                color={selectedPrinter === "a4" ? "#3b82f6" : isDarkMode ? "#9CA3AF" : "#6b7280"} 
              />
              <Text className={`text-center mt-1 text-xs ${
                selectedPrinter === "a4" ? 'text-blue-600' : 
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                A4 PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPrinter("thermal")}
              className={`flex-1 p-3 rounded-xl border-2 ${
                selectedPrinter === "thermal"
                  ? 'border-blue-500 bg-blue-50'
                  : isDarkMode 
                    ? 'border-gray-700 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Icon 
                name="printer" 
                size={20} 
                color={selectedPrinter === "thermal" ? "#3b82f6" : isDarkMode ? "#9CA3AF" : "#6b7280"} 
              />
              <Text className={`text-center mt-1 text-xs ${
                selectedPrinter === "thermal" ? 'text-blue-600' : 
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                3" Thermal
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Print Invoice"
            onPress={handlePrint}
            className="bg-blue-500 py-3 rounded-xl mb-2"
            textClassName="text-white font-semibold"
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleEmail}
              className={`flex-1 p-3 rounded-xl border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <Icon name="email" size={20} color={isDarkMode ? "#9CA3AF" : "#6b7280"} />
              <Text className={`text-center mt-1 text-xs ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWhatsApp}
              className={`flex-1 p-3 rounded-xl border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <Icon name="whatsapp" size={20} color="#25D366" />
              <Text className={`text-center mt-1 text-xs ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPaymentOptions(!showPaymentOptions)}
              className={`flex-1 p-3 rounded-xl border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <Icon name="cash-plus" size={20} color={isDarkMode ? "#9CA3AF" : "#6b7280"} />
              <Text className={`text-center mt-1 text-xs ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Payment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BillDetailScreen;
