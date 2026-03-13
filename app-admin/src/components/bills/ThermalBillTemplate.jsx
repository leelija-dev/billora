import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { format } from 'date-fns';

const ThermalBillTemplate = ({ bill }) => {
  const { isDarkMode } = useThemeStore();

  if (!bill) return null;

  return (
    <View className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} style={{ width: '100%' }}>
      {/* Store Header */}
      <View className="items-center mb-4">
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {bill.store?.name || 'Your Store'}
        </Text>
        <Text className={`text-xs text-center mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {bill.store?.address || '123 Business St'}
        </Text>
        {bill.store?.phone && (
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Tel: {bill.store.phone}
          </Text>
        )}
      </View>

      {/* Separator */}
      <View className={`border-t border-dashed my-2 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`} />

      {/* Invoice Info */}
      <View className="mb-3">
        <View className="flex-row justify-between">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Invoice:
          </Text>
          <Text className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {bill.invoice_no}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Date:
          </Text>
          <Text className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {format(new Date(bill.created_at), 'dd/MM/yyyy HH:mm')}
          </Text>
        </View>
      </View>

      {/* Customer */}
      <View className="mb-3">
        <Text className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Customer: {bill.customer?.name || 'Walk-in Customer'}
        </Text>
        {bill.customer?.phone && (
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {bill.customer.phone}
          </Text>
        )}
      </View>

      {/* Separator */}
      <View className={`border-t border-dashed my-2 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`} />

      {/* Items */}
      <View className="mb-3">
        {/* Header */}
        <View className="flex-row mb-1">
          <Text className={`flex-[3] text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Item
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Qty
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Price
          </Text>
          <Text className={`flex-1 text-xs font-bold text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Total
          </Text>
        </View>

        {/* Items List */}
        {bill.items?.map((item, index) => (
          <View key={item.id || index} className="flex-row py-1">
            <Text className={`flex-[3] text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>
              {item.product?.name || `Product ${item.product_id}`}
            </Text>
            <Text className={`flex-1 text-xs text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {item.quantity}
            </Text>
            <Text className={`flex-1 text-xs text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              ${item.price?.toFixed(2)}
            </Text>
            <Text className={`flex-1 text-xs font-semibold text-right text-green-500`}>
              ${item.total_price?.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Separator */}
      <View className={`border-t border-dashed my-2 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`} />

      {/* Summary */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Subtotal:
          </Text>
          <Text className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ${bill.total_amount?.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            GST:
          </Text>
          <Text className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ${bill.items?.reduce((sum, item) => {
              const subtotal = item.price * item.quantity;
              return sum + (subtotal * (item.gst || 0) / 100);
            }, 0).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Discount:
          </Text>
          <Text className="text-xs text-green-500">
            -${bill.items?.reduce((sum, item) => {
              const subtotal = item.price * item.quantity;
              return sum + (subtotal * (item.discount || 0) / 100);
            }, 0).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            TOTAL:
          </Text>
          <Text className="text-base font-bold text-blue-500">
            ${bill.total_amount?.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Payment */}
      <View className="mb-3">
        <View className="flex-row justify-between">
          <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Paid:
          </Text>
          <Text className="text-xs font-semibold text-green-500">
            ${bill.paid_amount?.toFixed(2)}
          </Text>
        </View>
        {bill.change_amount > 0 && (
          <View className="flex-row justify-between mt-1">
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Change:
            </Text>
            <Text className="text-xs font-semibold text-blue-500">
              ${bill.change_amount?.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Separator */}
      <View className={`border-t border-dashed my-2 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`} />

      {/* Footer */}
      <View className="items-center">
        <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Thank you for your purchase!
        </Text>
        <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}
        </Text>
      </View>
    </View>
  );
};

export default ThermalBillTemplate;