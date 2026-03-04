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
import { useCustomerStore } from '../../store/customerStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import CustomerForm from '../../components/features/Customers/CustomerForm';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Customers = () => {
  const {
    customers,
    totalCustomers,
    currentPage,
    loading,
    filters,
    fetchCustomers,
    deleteCustomer,
    setFilters,
  } = useCustomerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = (id) => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCustomer(id);
            fetchCustomers();
          },
        },
      ]
    );
  };

  const toggleCustomerSelection = (id) => {
    setSelectedCustomers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      header: (
        <TouchableOpacity
          onPress={() => {
            if (selectedCustomers.length === customers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(customers.map(c => c.id));
            }
          }}
        >
          <Icon
            name={selectedCustomers.length === customers.length ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={20}
            color={colors.primary[500]}
          />
        </TouchableOpacity>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <TouchableOpacity onPress={() => toggleCustomerSelection(row.id)}>
          <Icon
            name={selectedCustomers.includes(row.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={20}
            color={selectedCustomers.includes(row.id) ? colors.primary[500] : colors.gray[400]}
          />
        </TouchableOpacity>
      ),
    },
    {
      header: 'Customer',
      accessor: 'name',
      flex: 2,
      cell: (value, row) => (
        <View style={styles.customerCell}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{value.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.customerName}>{value}</Text>
            <Text style={styles.customerEmail}>{row.email}</Text>
          </View>
        </View>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      cell: (value) => (
        <Text style={styles.phone}>{value || '-'}</Text>
      ),
    },
    {
      header: 'Company',
      accessor: 'company',
      cell: (value) => (
        <Text style={styles.company}>{value || '-'}</Text>
      ),
    },
    {
      header: 'Orders',
      accessor: 'totalOrders',
      cell: (value) => (
        <Text style={styles.orders}>{value || 0}</Text>
      ),
    },
    {
      header: 'Spent',
      accessor: 'totalSpent',
      cell: (value) => (
        <Text style={styles.spent}>${(value || 0).toFixed(2)}</Text>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={value === 'active' ? 'success' : 'default'}
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
            onPress={() => handleEditCustomer(row)}
          >
            <Icon name="pencil" size={18} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteCustomer(value)}
          >
            <Icon name="delete" size={18} color={colors.danger[500]} />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
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
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>Manage your customer relationships</Text>
        </View>
        <Button
          title="Add Customer"
          onPress={handleAddCustomer}
          icon="plus"
        />
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Customers"
            value={stats.total}
            icon="account-group"
            color={colors.blue[500]}
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon="check-circle"
            color={colors.green[500]}
          />
          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon="clock"
            color={colors.orange[500]}
          />
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
            icon="cash"
            color={colors.purple[500]}
          />
        </View>
      </ScrollView>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <Card style={styles.bulkActions}>
          <Text style={styles.bulkText}>{selectedCustomers.length} selected</Text>
          <View style={styles.bulkButtons}>
            <Button
              title="Delete"
              variant="danger"
              size="sm"
              onPress={() => {
                Alert.alert(
                  'Delete Customers',
                  `Delete ${selectedCustomers.length} customers?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        for (const id of selectedCustomers) {
                          await deleteCustomer(id);
                        }
                        setSelectedCustomers([]);
                        fetchCustomers();
                      },
                    },
                  ]
                );
              }}
            />
            <Button
              title="Clear"
              variant="outline"
              size="sm"
              onPress={() => setSelectedCustomers([])}
            />
          </View>
        </Card>
      )}

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
            placeholder="Search customers..."
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
          <Select
            label="Status"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'blocked', label: 'Blocked' },
            ]}
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value })}
          />
        </Card>
      )}

      {/* Customers Table */}
      <View style={styles.tableContainer}>
        <Table columns={columns} data={customers} loading={loading} />
      </View>

      {/* Add Customer Modal */}
      <Modal
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
        size="lg"
      >
        <CustomerForm
          onSubmit={async (data) => {
            await useCustomerStore.getState().createCustomer(data);
            setShowAddModal(false);
            fetchCustomers();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        size="lg"
      >
        <CustomerForm
          initialData={selectedCustomer}
          onSubmit={async (data) => {
            await useCustomerStore.getState().updateCustomer(selectedCustomer.id, data);
            setShowEditModal(false);
            fetchCustomers();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
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
    minWidth: 140,
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
  bulkActions: {
    margin: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bulkText: {
    fontSize: typography.sizes.md,
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  tableContainer: {
    flex: 1,
    margin: spacing.md,
  },
  customerCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  customerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  customerEmail: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  phone: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  company: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  orders: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    textAlign: 'center',
  },
  spent: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
});

export default Customers;