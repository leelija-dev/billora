import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { formatRelativeTime } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';
import Card from '../common/Card';

const CustomerCard = ({ customer, onPress }) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress(customer);
    } else {
      navigation.navigate('CustomerDetail', { customerId: customer.id });
    }
  };

  const isActive = customer.status === 'active';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.card} padding="sm">
        <View style={styles.header}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerEmail}>{customer.email}</Text>
          </View>
          <StatusBadge
            status={isActive ? 'Active' : 'Inactive'}
            variant={isActive ? 'success' : 'error'}
            size="small"
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{customer.phone || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Orders:</Text>
            <Text style={styles.detailValue}>{customer.orderCount || 0}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Spent:</Text>
            <Text style={styles.detailValue}>{customer.totalSpent ? `$${customer.totalSpent}` : '$0'}</Text>
          </View>
        </View>

        {customer.address && (
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {customer.address.street}, {customer.address.city}, {customer.address.state}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.memberSince}>
            Member since {formatRelativeTime(customer.createdAt)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  customerEmail: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    alignItems: 'center',
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
  },
  addressSection: {
    marginBottom: theme.spacing.sm,
  },
  addressLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  addressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  footer: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  memberSince: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default CustomerCard;
