import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Card from '../../common/Card/Card';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderDetails = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger',
      refunded: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Order Header */}
      <Card style={styles.section}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
          <StatusBadge
            status={order.status}
            variant={getStatusColor(order.status)}
            size="lg"
          />
        </View>
      </Card>

      {/* Customer Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{order.customer.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{order.customer.email}</Text>
          </View>
          {order.customer.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={colors.gray[500]} />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{order.customer.phone}</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Order Items */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.itemTotal}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${order.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%):</Text>
            <Text style={styles.summaryValue}>${order.tax?.toFixed(2)}</Text>
          </View>
          {order.shipping > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>${order.shipping.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </Card>

      {/* Payment Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Icon name="credit-card" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Method:</Text>
            <Text style={styles.infoValue}>
              {order.paymentMethod?.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="cash" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Status:</Text>
            <StatusBadge
              status={order.paymentStatus}
              variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}
              size="sm"
            />
          </View>
        </View>
      </Card>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.address}>{order.shippingAddress}</Text>
        </Card>
      )}

      {/* Order Notes */}
      {order.notes && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Notes</Text>
          <Text style={styles.notes}>{order.notes}</Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  orderDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  infoGrid: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    width: 60,
    marginLeft: spacing.sm,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemInfo: {
    flex: 2,
  },
  itemName: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  itemSku: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  itemQuantity: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  itemPrice: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    width: 60,
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
    width: 80,
    textAlign: 'right',
  },
  summary: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  address: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    lineHeight: 20,
  },
  notes: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    fontStyle: 'italic',
  },
});

export default OrderDetails;