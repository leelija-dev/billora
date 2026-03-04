import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ordersAPI } from '../../api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ErrorState from '../../components/common/ErrorState';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import { useApi } from '../../hooks/useApi';
import { useOrderStore } from '../../store/orderStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  const { selectedOrder, setSelectedOrder } = useOrderStore();
  const { showSuccess, showError } = useUIStore();
  const [loading, setLoading] = useState(false);

  const {
    data: order,
    loading: orderLoading,
    error: orderError,
    execute: fetchOrder,
  } = useApi(() => ordersAPI.getOrder(orderId));

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  useEffect(() => {
    if (order) {
      setSelectedOrder(order);
    }
  }, [order, setSelectedOrder]);

  const handleEdit = () => {
    navigation.navigate('CreateOrder', { orderId });
  };

  const handleUpdateStatus = () => {
    Alert.alert(
      'Update Order Status',
      'Select new status',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirmed', onPress: () => updateStatus('confirmed') },
        { text: 'Processing', onPress: () => updateStatus('processing') },
        { text: 'Shipped', onPress: () => updateStatus('shipped') },
        { text: 'Delivered', onPress: () => updateStatus('delivered') },
        { text: 'Cancelled', onPress: () => updateStatus('cancelled'), style: 'destructive' },
      ]
    );
  };

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      showSuccess('Order status updated successfully');
      fetchOrder();
    } catch (error) {
      showError(error.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await ordersAPI.deleteOrder(orderId);
              showSuccess('Order deleted successfully');
              navigation.goBack();
            } catch (error) {
              showError(error.message || 'Failed to delete order');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (orderLoading && !order) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Order Details" showBackButton />
        <Loading text="Loading order..." />
      </SafeAreaView>
    );
  }

  if (orderError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Order Details" showBackButton />
        <ErrorState
          title="Failed to Load Order"
          description="Unable to load order details. Please try again."
          onRetry={fetchOrder}
        />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Order Details" showBackButton />
        <ErrorState
          title="Order Not Found"
          description="The order you're looking for doesn't exist."
        />
      </SafeAreaView>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      case 'processing':
      case 'confirmed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header
        title="Order Details"
        showBackButton
        rightComponent={
          <View style={styles.headerButtons}>
            <Button
              title="Edit"
              onPress={handleEdit}
              variant="outline"
              size="small"
            />
          </View>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
              <Text style={styles.customerName}>{order.customer?.name}</Text>
            </View>
            <StatusBadge
              status={ORDER_STATUS_LABELS[order.status] || order.status}
              variant={getStatusVariant(order.status)}
            />
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Payment Status</Text>
              <StatusBadge
                status={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                size="small"
              />
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Order Date</Text>
              <Text style={styles.dateText}>{formatRelativeTime(order.createdAt)}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {theme.currencySymbol}{item.price} × {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.subtotal || order.total)}</Text>
            </View>
            {order.tax && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax:</Text>
                <Text style={styles.totalValue}>{formatCurrency(order.tax)}</Text>
              </View>
            )}
            {order.shipping && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping:</Text>
                <Text style={styles.totalValue}>{formatCurrency(order.shipping)}</Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(order.total)}</Text>
            </View>
          </View>
        </Card>

        {order.shippingAddress && (
          <Card style={styles.addressCard}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.street}
            </Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.country}
            </Text>
          </Card>
        )}

        {order.notes && (
          <Card style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Order Notes</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </Card>
        )}

        <View style={styles.actionButtons}>
          <Button
            title="Update Status"
            onPress={handleUpdateStatus}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Delete Order"
            onPress={handleDelete}
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  orderCard: {
    marginBottom: theme.spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  customerName: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  dateText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
  },
  itemsCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemDetails: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  itemTotal: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalSection: {
    paddingTop: theme.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  grandTotalRow: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
  },
  grandTotalLabel: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
  },
  grandTotalValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  addressCard: {
    marginBottom: theme.spacing.md,
  },
  addressText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notesCard: {
    marginBottom: theme.spacing.md,
  },
  notesText: {
    ...theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 24,
  },
  actionButtons: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});

export default OrderDetailScreen;
