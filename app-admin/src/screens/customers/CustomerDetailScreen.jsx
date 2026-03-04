import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { customersAPI } from '../../api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ErrorState from '../../components/common/ErrorState';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import { useApi } from '../../hooks/useApi';
import { useCustomerStore } from '../../store/customerStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import { formatRelativeTime } from '../../utils/helpers';

const CustomerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId } = route.params;
  const { selectedCustomer, setSelectedCustomer } = useCustomerStore();
  const { showSuccess, showError } = useUIStore();
  const [loading, setLoading] = useState(false);

  const {
    data: customer,
    loading: customerLoading,
    error: customerError,
    execute: fetchCustomer,
  } = useApi(() => customersAPI.getCustomer(customerId));

  const {
    data: customerOrders,
    loading: ordersLoading,
    execute: fetchCustomerOrders,
  } = useApi(() => customersAPI.getCustomerOrders(customerId, { limit: 5 }));

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
      fetchCustomerOrders();
    }
  }, [customerId, fetchCustomer, fetchCustomerOrders]);

  useEffect(() => {
    if (customer) {
      setSelectedCustomer(customer);
    }
  }, [customer, setSelectedCustomer]);

  const handleEdit = () => {
    navigation.navigate('AddCustomer', { customerId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await customersAPI.deleteCustomer(customerId);
              showSuccess('Customer deleted successfully');
              navigation.goBack();
            } catch (error) {
              showError(error.message || 'Failed to delete customer');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
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

  const handleViewAllOrders = () => {
    navigation.navigate('Orders', { customerId });
  };

  if (customerLoading && !customer) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Customer Details" showBackButton />
        <Loading text="Loading customer..." />
      </SafeAreaView>
    );
  }

  if (customerError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Customer Details" showBackButton />
        <ErrorState
          title="Failed to Load Customer"
          description="Unable to load customer details. Please try again."
          onRetry={fetchCustomer}
        />
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Customer Details" showBackButton />
        <ErrorState
          title="Customer Not Found"
          description="The customer you're looking for doesn't exist."
        />
      </SafeAreaView>
    );
  }

  const isActive = customer.status === 'active';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header
        title="Customer Details"
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
        <Card style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              {customer.company && (
                <Text style={styles.companyName}>{customer.company}</Text>
              )}
            </View>
            <StatusBadge
              status={isActive ? 'Active' : 'Inactive'}
              variant={isActive ? 'success' : 'error'}
              size="small"
            />
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{customer.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{customer.phone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Call"
              onPress={handleCall}
              variant="outline"
              size="small"
              disabled={!customer.phone}
              style={styles.actionButton}
            />
            <Button
              title="Email"
              onPress={handleEmail}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </View>
        </Card>

        {customer.address && (
          <Card style={styles.addressCard}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.addressText}>
              {customer.address.street}
            </Text>
            <Text style={styles.addressText}>
              {customer.address.city}, {customer.address.state} {customer.address.zip}
            </Text>
            <Text style={styles.addressText}>
              {customer.address.country}
            </Text>
          </Card>
        )}

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{customer.orderCount || 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${customer.totalSpent || 0}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${customer.averageOrderValue || 0}</Text>
              <Text style={styles.statLabel}>Avg Order</Text>
            </View>
          </View>
        </Card>

        {customer.notes && (
          <Card style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </Card>
        )}

        {customerOrders && customerOrders.length > 0 && (
          <Card style={styles.recentOrdersCard}>
            <View style={styles.recentOrdersHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <Button
                title="View All"
                onPress={handleViewAllOrders}
                variant="ghost"
                size="small"
              />
            </View>
            {customerOrders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>
                    {formatRelativeTime(order.createdAt)}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>${order.total}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.deleteSection}>
          <Button
            title="Delete Customer"
            onPress={handleDelete}
            variant="outline"
            style={styles.deleteButton}
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
  customerCard: {
    marginBottom: theme.spacing.md,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  companyName: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  contactInfo: {
    marginBottom: theme.spacing.md,
  },
  contactItem: {
    marginBottom: theme.spacing.sm,
  },
  contactLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  contactValue: {
    ...theme.typography.body1,
    color: theme.colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  addressCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  addressText: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statsCard: {
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  notesCard: {
    marginBottom: theme.spacing.md,
  },
  notesText: {
    ...theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 24,
  },
  recentOrdersCard: {
    marginBottom: theme.spacing.md,
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  orderDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  orderTotal: {
    ...theme.typography.body1,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  deleteSection: {
    marginTop: theme.spacing.lg,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});

export default CustomerDetailScreen;
