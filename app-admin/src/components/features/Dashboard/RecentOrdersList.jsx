import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecentOrdersList = ({ orders }) => {
  const navigation = useNavigation();

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

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping" size={48} color={colors.gray[300]} />
        <Text style={styles.emptyText}>No recent orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.map((order, index) => (
        <TouchableOpacity
          key={index}
          style={styles.orderItem}
          onPress={() => navigation.navigate('Orders', { orderId: order.id })}
        >
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>#{order.orderNumber}</Text>
            <Text style={styles.orderCustomer}>{order.customer}</Text>
          </View>
          <View style={styles.orderMeta}>
            <Text style={styles.orderAmount}>${order.amount}</Text>
            <StatusBadge
              status={order.status}
              variant={getStatusColor(order.status)}
              size="sm"
            />
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.viewAllText}>View All Orders</Text>
        <Icon name="arrow-right" size={16} color={colors.primary[600]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  orderCustomer: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginBottom: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  viewAllText: {
    fontSize: typography.sizes.md,
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
    marginRight: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    marginTop: spacing.sm,
  },
});

export default RecentOrdersList;