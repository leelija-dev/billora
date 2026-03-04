import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useOrderStore } from '../../store/orderStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import OrderForm from '../../components/features/Orders/OrderForm';
import OrderDetails from '../../components/features/Orders/OrderDetails';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Orders = ({ navigation, route }) => {
  const {
    orders,
    totalOrders,
    currentPage,
    loading,
    filters,
    fetchOrders,
    updateOrderStatus,
    setFilters,
  } = useOrderStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('from');
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    // Check if order ID is passed from navigation
    if (route.params?.orderId) {
      const order = orders.find(o => o.id === route.params.orderId);
      if (order) {
        setSelectedOrder(order);
        setShowDetailsModal(true);
      }
    }
  }, [route.params, orders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
          },
        },
      ]
    );
  };

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

  const columns = [
    {
      header: 'Order ID',
      accessor: 'orderNumber',
      cell: (value) => (
        <Text style={styles.orderId}>#{value}</Text>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      flex: 2,
      cell: (value) => (
        <View>
          <Text style={styles.customerName}>{value.name}</Text>
          <Text style={styles.customerEmail}>{value.email}</Text>
        </View>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => (
        <Text style={styles.date}>
          {new Date(value).toLocaleDateString()}
        </Text>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      cell: (value) => (
        <Text style={styles.itemsCount}>{value.length}</Text>
      ),
    },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => (
        <Text style={styles.total}>${value.toFixed(2)}</Text>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={getStatusColor(value)}
        />
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={value === 'paid' ? 'success' : 'warning'}
          size="sm"
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewOrder(row)}
          >
            <Icon name="eye" size={18} color={colors.blue[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditOrder(row)}
          >
            <Icon name="pencil" size={18} color={colors.green[500]} />
          </TouchableOpacity>
          <Select
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={row.status}
            onValueChange={(newStatus) => handleStatusChange(value, newStatus)}
            placeholder="Status"
            style={styles.statusSelect}
          />
        </View>
      ),
    },
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color + '10' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>Manage customer orders</Text>
        </View>
        <Button
          title="Create Order"
          onPress={() => setShowCreateModal(true)}
          icon="plus"
        />
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Orders"
            value={stats.total}
            icon="shopping"
            color={colors.blue[500]}
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            icon="cash"
            color={colors.green[500]}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon="clock"
            color={colors.orange[500]}
          />
          <StatCard
            title="Processing"
            value={stats.processing}
            icon="refresh"
            color={colors.purple[500]}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon="check-circle"
            color={colors.teal[500]}
          />
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="magnify"
            size={20}
            color={colors.gray[400]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon
            name="filter"
            size={20}
            color={showFilters ? colors.white : colors.gray[600]}
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <Card style={styles.filtersCard}>
          <View style={styles.filtersGrid}>
            <Select
              label="Order Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={filters.status}
              onValueChange={(value) => setFilters({ status: value })}
            />
            <Select
              label="Payment Status"
              options={[
                { value: '', label: 'All' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'refunded', label: 'Refunded' },
              ]}
              value={filters.paymentStatus}
              onValueChange={(value) => setFilters({ paymentStatus: value })}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setDateType('from');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateButtonLabel}>From Date</Text>
              <Text style={styles.dateButtonValue}>
                {filters.dateFrom ? new Date(filters.dateFrom).toLocaleDateString() : 'Select'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setDateType('to');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateButtonLabel}>To Date</Text>
              <Text style={styles.dateButtonValue}>
                {filters.dateTo ? new Date(filters.dateTo).toLocaleDateString() : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Orders Table */}
      <View style={styles.tableContainer}>
        <Table columns={columns} data={orders} loading={loading} />
      </View>

      {/* Create Order Modal */}
      <Modal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Order"
        size="lg"
      >
        <OrderForm
          onSubmit={async (data) => {
            await useOrderStore.getState().createOrder(data);
            setShowCreateModal(false);
            fetchOrders();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Order Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        <OrderForm
          initialData={selectedOrder}
          onSubmit={async (data) => {
            await useOrderStore.getState().updateOrder(selectedOrder.id, data);
            setShowEditModal(false);
            fetchOrders();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isVisible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
        title={`Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && <OrderDetails order={selectedOrder} />}
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFilters({
                [dateType === 'from' ? 'dateFrom' : 'dateTo']:
                  selectedDate.toISOString().split('T')[0],
              });
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  statsScroll: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    minWidth: 120,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  statTitle: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
  },
  filtersCard: {
    margin: spacing.md,
  },
  filtersGrid: {
    gap: spacing.md,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.sm,
  },
  dateButtonLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginBottom: 2,
  },
  dateButtonValue: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  tableContainer: {
    flex: 1,
    margin: spacing.md,
  },
  orderId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  customerName: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  customerEmail: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  date: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  itemsCount: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    textAlign: 'center',
  },
  total: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
  statusSelect: {
    minWidth: 100,
  },
});

export default Orders;