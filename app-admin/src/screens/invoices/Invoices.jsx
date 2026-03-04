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
import { useInvoiceStore } from '../../store/invoiceStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import InvoiceForm from '../../components/features/Invoices/InvoiceForm';
import InvoiceDetails from '../../components/features/Invoices/InvoiceDetails';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Invoices = () => {
  const {
    invoices,
    totalInvoices,
    currentPage,
    loading,
    filters,
    fetchInvoices,
    deleteInvoice,
    markAsPaid,
    setFilters,
  } = useInvoiceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('from');

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleDeleteInvoice = (id) => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteInvoice(id);
            fetchInvoices();
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = (id) => {
    Alert.alert(
      'Mark as Paid',
      'Mark this invoice as paid?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Paid',
          onPress: async () => {
            await markAsPaid(id);
            fetchInvoices();
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'success',
      unpaid: 'warning',
      overdue: 'danger',
      cancelled: 'default',
      refunded: 'default',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      cell: (value) => (
        <Text style={styles.invoiceNumber}>#{value}</Text>
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
      accessor: 'issueDate',
      cell: (value) => (
        <Text style={styles.date}>
          {new Date(value).toLocaleDateString()}
        </Text>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      cell: (value, row) => {
        const dueDate = new Date(value);
        const today = new Date();
        const isOverdue = row.status !== 'paid' && dueDate < today;
        
        return (
          <Text style={[styles.dueDate, isOverdue && styles.overdueDate]}>
            {dueDate.toLocaleDateString()}
          </Text>
        );
      },
    },
    {
      header: 'Amount',
      accessor: 'total',
      cell: (value) => (
        <Text style={styles.amount}>${value.toFixed(2)}</Text>
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
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewInvoice(row)}
          >
            <Icon name="eye" size={18} color={colors.blue[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditInvoice(row)}
          >
            <Icon name="pencil" size={18} color={colors.green[500]} />
          </TouchableOpacity>
          {row.status !== 'paid' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleMarkAsPaid(value)}
            >
              <Icon name="check-circle" size={18} color={colors.green[500]} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteInvoice(value)}
          >
            <Icon name="delete" size={18} color={colors.danger[500]} />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaid: invoices.filter(i => i.status === 'unpaid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
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
          <Text style={styles.title}>Invoices</Text>
          <Text style={styles.subtitle}>Manage and track invoices</Text>
        </View>
        <Button
          title="Create Invoice"
          onPress={() => setShowCreateModal(true)}
          icon="plus"
        />
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Invoices"
            value={stats.total}
            icon="file-document"
            color={colors.blue[500]}
          />
          <StatCard
            title="Paid"
            value={stats.paid}
            icon="check-circle"
            color={colors.green[500]}
          />
          <StatCard
            title="Unpaid"
            value={stats.unpaid}
            icon="clock"
            color={colors.orange[500]}
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon="alert"
            color={colors.red[500]}
          />
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
            icon="cash"
            color={colors.purple[500]}
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
            placeholder="Search invoices..."
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
              label="Status"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={filters.status}
              onValueChange={(value) => setFilters({ status: value })}
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

      {/* Invoices Table */}
      <View style={styles.tableContainer}>
        <Table columns={columns} data={invoices} loading={loading} />
      </View>

      {/* Create Invoice Modal */}
      <Modal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
        size="lg"
      >
        <InvoiceForm
          onSubmit={async (data) => {
            await useInvoiceStore.getState().createInvoice(data);
            setShowCreateModal(false);
            fetchInvoices();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Invoice #${selectedInvoice?.invoiceNumber}`}
        size="lg"
      >
        <InvoiceForm
          initialData={selectedInvoice}
          onSubmit={async (data) => {
            await useInvoiceStore.getState().updateInvoice(selectedInvoice.id, data);
            setShowEditModal(false);
            fetchInvoices();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Invoice Details Modal */}
      <Modal
        isVisible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedInvoice(null);
        }}
        title={`Invoice #${selectedInvoice?.invoiceNumber}`}
        size="lg"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
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
  invoiceNumber: {
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
  dueDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  overdueDate: {
    color: colors.danger[600],
    fontWeight: typography.weights.medium,
  },
  amount: {
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

export default Invoices;