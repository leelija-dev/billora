import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { format } from 'date-fns';

const A4BillTemplate = ({ bill }) => {
  const { isDarkMode } = useThemeStore();

  if (!bill) return null;

  return (
    <View className={`p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} style={{ minHeight: '100%' }}>
      {/* Header */}
      <View className="items-center mb-8">
        <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {bill.store?.name || 'Your Store Name'}
        </Text>
        <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {bill.store?.address || '123 Business Street, City'}
        </Text>
        {bill.store?.gst && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            GST: {bill.store.gst}
          </Text>
        )}
        {bill.store?.email && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {bill.store.email} | {bill.store?.phone || '123-456-7890'}
          </Text>
        )}
      </View>

      {/* Invoice Title */}
      <View className="mb-6">
        <Text className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          TAX INVOICE
        </Text>
        <View className="flex-row justify-between mt-4">
          <View>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Invoice No:
            </Text>
            <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {bill.invoice_no}
            </Text>
          </View>
          <View>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Date:
            </Text>
            <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {format(new Date(bill.created_at), 'dd/MM/yyyy HH:mm')}
            </Text>
          </View>
        </View>
      </View>

      {/* Customer Details */}
      <View className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          Bill To:
        </Text>
        <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {bill.customer?.name || 'Walk-in Customer'}
        </Text>
        {bill.customer?.phone && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Phone: {bill.customer.phone}
          </Text>
        )}
        {bill.customer?.email && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Email: {bill.customer.email}
          </Text>
        )}
        {bill.customer?.address && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {bill.customer.address}
          </Text>
        )}
        {bill.customer?.gst && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            GST: {bill.customer.gst}
          </Text>
        )}
      </View>

      {/* Items Table */}
      <View className="mb-6">
        {/* Table Header */}
        <View className={`flex-row py-2 border-b-2 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-300'
        }`}>
          <Text className={`flex-1 text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            #
          </Text>
          <Text className={`flex-[3] text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Description
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Qty
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Price
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            GST
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Disc
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Total
          </Text>
        </View>

        {/* Table Items */}
        {bill.items?.map((item, index) => (
          <View key={item.id || index} className={`flex-row py-2 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <Text className={`flex-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {index + 1}
            </Text>
            <Text className={`flex-[3] text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {item.product?.name || `Product #${item.product_id}`}
            </Text>
            <Text className={`flex-1 text-sm text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {item.quantity}
            </Text>
            <Text className={`flex-1 text-sm text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              ${item.price?.toFixed(2)}
            </Text>
            <Text className={`flex-1 text-sm text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {item.gst || 0}%
            </Text>
            <Text className={`flex-1 text-sm text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {item.discount || 0}%
            </Text>
            <Text className={`flex-1 text-sm font-semibold text-right text-green-500`}>
              ${item.total_price?.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <View className="flex-row justify-between mb-2">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Subtotal:
          </Text>
          <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ${bill.total_amount?.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Total GST:
          </Text>
          <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ${bill.items?.reduce((sum, item) => {
              const subtotal = item.price * item.quantity;
              return sum + (subtotal * (item.gst || 0) / 100);
            }, 0).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Total Discount:
          </Text>
          <Text className="text-green-500">
            -${bill.items?.reduce((sum, item) => {
              const subtotal = item.price * item.quantity;
              return sum + (subtotal * (item.discount || 0) / 100);
            }, 0).toFixed(2)}
          </Text>
        </View>
        <View className={`flex-row justify-between mt-2 pt-2 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Grand Total:
          </Text>
          <Text className="text-xl font-bold text-blue-500">
            ${bill.total_amount?.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Payment Details */}
      <View className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          Payment Details:
        </Text>
        <View className="flex-row justify-between mb-1">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Amount Paid:
          </Text>
          <Text className="font-semibold text-green-500">
            ${bill.paid_amount?.toFixed(2)}
          </Text>
        </View>
        {bill.change_amount > 0 && (
          <View className="flex-row justify-between mb-1">
            <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Change Returned:
            </Text>
            <Text className="font-semibold text-blue-500">
              ${bill.change_amount?.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="mt-8 items-center">
        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          This is a computer generated invoice
        </Text>
        <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Thank you for your business!
        </Text>
      </View>
    </View>
  );
};

export default A4BillTemplate;