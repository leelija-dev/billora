import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../store/themeStore";
import { billsAPI } from "../../api/bills";
import ErrorState from "../../components/common/ErrorState";
import Loading from "../../components/common/Loading";
import A4BillTemplate from "../../components/bills/A4BillTemplate";
import ThermalBillTemplate from "../../components/bills/ThermalBillTemplate";
import { format } from 'date-fns';

const BillDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billId } = route.params || {};
  const { isDarkMode } = useThemeStore();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printFormat, setPrintFormat] = useState('a4');

  useEffect(() => {
    fetchBill();
  }, [billId]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getById(billId);
      
      let billData = null;
      if (response?.data?.data) {
        billData = response.data.data;
      } else if (response?.data) {
        billData = response.data;
      } else {
        billData = response;
      }
      
      setBill(billData);
    } catch (err) {
      setError(err.message || 'Failed to fetch bill');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("CreateBill", { billId });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bill",
      "Are you sure you want to delete this bill?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await billsAPI.delete(billId);
              Alert.alert("Success", "Bill deleted successfully");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete bill");
            }
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      const billText = `
Invoice: ${bill?.invoice_no}
Date: ${format(new Date(bill?.created_at), 'PPP')}
Customer: ${bill?.customer?.name}
Total: $${bill?.total_amount?.toFixed(2)}
Paid: $${bill?.paid_amount?.toFixed(2)}
Change: $${bill?.change_amount?.toFixed(2)}
      `;
      
      await Share.share({
        message: billText,
        title: `Invoice ${bill?.invoice_no}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handlePrint = (format) => {
    setPrintFormat(format);
    setShowPrintPreview(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP p');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <SafeAreaView className="flex-1">
          <Loading text="Loading bill details..." />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !bill) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <SafeAreaView className="flex-1">
          <ErrorState
            title="Bill Not Found"
            description="The bill you're looking for doesn't exist or couldn't be loaded."
            onRetry={() => navigation.goBack()}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className={`px-4 py-3 flex-row items-center border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
          </TouchableOpacity>
          <Text className={`flex-1 text-center text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Bill Details
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleShare}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Icon name="share-variant" size={22} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEdit}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}
            >
              <Icon name="pencil" size={22} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Invoice Header */}
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            className="rounded-2xl p-6 mt-4 mb-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="items-center">
              <Text className="text-white/80 text-sm">INVOICE</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {bill.invoice_no}
              </Text>
              <View className="flex-row mt-2">
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm">
                    {formatDate(bill.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Customer & Store Info */}
          <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <View className="flex-row mb-4">
              <View className="flex-1">
                <Text className={`text-xs mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Customer
                </Text>
                <Text className={`text-base font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {bill.customer?.name || 'Walk-in Customer'}
                </Text>
                {bill.customer?.phone && (
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {bill.customer.phone}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className={`text-xs mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Store
                </Text>
                <Text className={`text-base font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {bill.store?.name || 'Main Store'}
                </Text>
                {bill.store?.gst && (
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    GST: {bill.store.gst}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Items List */}
          <View className={`rounded-2xl p-4 mb-4 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Text className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Items
            </Text>

            {bill.items?.map((item, index) => (
              <View key={item.id || index} className={`mb-3 pb-3 ${
                index < bill.items.length - 1 ? 'border-b' : ''
              } ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {item.product?.name || `Product #${item.product_id}`}
                    </Text>
                    <Text className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                      {item.gst > 0 && ` | GST: ${item.gst}%`}
                      {item.discount > 0 && ` | Disc: ${item.discount}%`}
                    </Text>
                  </View>
                  <Text className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    ${item.total_price?.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Totals */}
            <View className="mt-4 pt-4 border-t border-dashed ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }">
              <View className="flex-row justify-between mb-2">
                <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Subtotal
                </Text>
                <Text className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                  ${bill.total_amount?.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Paid Amount
                </Text>
                <Text className="text-green-500 font-semibold">
                  ${bill.paid_amount?.toFixed(2)}
                </Text>
              </View>
              {bill.change_amount > 0 && (
                <View className="flex-row justify-between mb-2">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Change
                  </Text>
                  <Text className="text-blue-500">
                    ${bill.change_amount?.toFixed(2)}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between mt-2 pt-2 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }">
                <Text className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Grand Total
                </Text>
                <Text className="text-lg font-bold text-blue-500">
                  ${bill.total_amount?.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Print Options */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => handlePrint('a4')}
              className="flex-1 bg-purple-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="file-pdf-box" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">A4 Bill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePrint('thermal')}
              className="flex-1 bg-orange-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="printer" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Thermal</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 bg-red-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="delete" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Icon name="pencil" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Edit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Print Preview Modal */}
      <Modal
        visible={showPrintPreview}
        animationType="slide"
        onRequestClose={() => setShowPrintPreview(false)}
      >
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <SafeAreaView className="flex-1">
            <View className={`px-4 py-3 flex-row items-center border-b ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <TouchableOpacity
                onPress={() => setShowPrintPreview(false)}
                className="mr-4"
              >
                <Icon name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
              </TouchableOpacity>
              <Text className={`text-xl font-semibold flex-1 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Print Preview
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPrintPreview(false);
                  Alert.alert('Print', 'Print functionality would be implemented here');
                }}
                className="bg-blue-500 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold">Print</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {printFormat === 'a4' ? (
                <A4BillTemplate bill={bill} />
              ) : (
                <ThermalBillTemplate bill={bill} />
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

export default BillDetailScreen;