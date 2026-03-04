import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useInventoryStore } from '../../store/inventoryStore';
import { useProductStore } from '../../store/productStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Table from '../../components/common/Table/Table';
import Modal from '../../components/common/Modal/Modal';
import Select from '../../components/common/Select/Select';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Inventory = () => {
  const {
    stockLogs,
    totalLogs,
    currentPage,
    loading,
    filters,
    fetchStockLogs,
    addStock,
    removeStock,
    setFilters,
  } = useInventoryStore();

  const { products, fetchProducts } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('from');

  useEffect(() => {
    fetchStockLogs();
    fetchProducts();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) return;

    await addStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    });

    setShowAddModal(false);
    resetForm();
    fetchStockLogs();
  };

  const handleRemoveStock = async () => {
    if (!selectedProduct || !quantity) return;

    if (parseInt(quantity) > selectedProduct.stock) {
      Alert.alert('Error', 'Insufficient stock');
      return;
    }

    await removeStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    });

    setShowRemoveModal(false);
    resetForm();
    fetchStockLogs();
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('');
    setNotes('');
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => (
        <Text style={styles.cellText}>
          {new Date(value).toLocaleDateString()}
        </Text>
      ),
    },
    {
      header: 'Product',
      accessor: 'productName',
      flex: 2,
      cell: (value, row) => (
        <View>
          <Text style={styles.productName}>{value}</Text>
          <Text style={styles.productSku}>SKU: {row.productSku}</Text>
        </View>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (value) => (
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: value === 'IN' ? colors.success[50] : colors.danger[50] },
          ]}
        >
          <Icon
            name={value === 'IN' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={value === 'IN' ? colors.success[600] : colors.danger[600]}
          />
          <Text
            style={[
              styles.typeText,
              { color: value === 'IN' ? colors.success[600] : colors.danger[600] },
            ]}
          >
            {value === 'IN' ? 'Stock In' : 'Stock Out'}
          </Text>
        </View>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value, row) => (
        <Text
          style={[
            styles.quantity,
            { color: row.type === 'IN' ? colors.success[600] : colors.danger[600] },
          ]}
        >
          {row.type === 'IN' ? '+' : '-'}{value}
        </Text>
      ),
    },
    {
      header: 'Stock Change',
      accessor: 'previousStock',
      cell: (value, row) => (
        <Text style={styles.stockChange}>
          {value} → {row.newStock}
        </Text>
      ),
    },
    {
      header: 'Notes',
      accessor: 'notes',
      cell: (value) => (
        <Text style={styles.notes} numberOfLines={1}>
          {value || '-'}
        </Text>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>Track stock movements</Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            title="Add Stock"
            onPress={() => setShowAddModal(true)}
            icon="plus"
            size="sm"
            style={styles.headerButton}
          />
          <Button
            title="Remove"
            onPress={() => setShowRemoveModal(true)}
            variant="outline"
            icon="minus"
            size="sm"
          />
        </View>
      </View>

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
            placeholder="Search by product or SKU..."
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
              label="Type"
              options={[
                { value: '', label: 'All Types' },
                { value: 'IN', label: 'Stock In' },
                { value: 'OUT', label: 'Stock Out' },
              ]}
              value={filters.type}
              onValueChange={(value) => setFilters({ type: value })}
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

      {/* Stock Logs Table */}
      <View style={styles.tableContainer}>
        <Table columns={columns} data={stockLogs} loading={loading} />
      </View>

      {/* Add Stock Modal */}
      <Modal
        isVisible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Stock"
      >
        <View style={styles.modalContent}>
          <Select
            label="Product"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.name} (Stock: ${p.stock})`,
            }))}
            value={selectedProduct?.id}
            onValueChange={(value) => {
              const product = products.find((p) => p.id === value);
              setSelectedProduct(product);
            }}
          />

          <Input
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />

          <Input
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes"
            multiline
          />

          {selectedProduct && quantity && (
            <Card style={styles.previewCard}>
              <Text style={styles.previewTitle}>Stock Update Preview</Text>
              <View style={styles.previewRow}>
                <Text>Current Stock:</Text>
                <Text style={styles.previewValue}>{selectedProduct.stock}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text>Adding:</Text>
                <Text style={[styles.previewValue, styles.addValue]}>
                  +{parseInt(quantity) || 0}
                </Text>
              </View>
              <View style={[styles.previewRow, styles.previewTotal]}>
                <Text style={styles.previewTotalLabel}>New Stock:</Text>
                <Text style={styles.previewTotalValue}>
                  {selectedProduct.stock + (parseInt(quantity) || 0)}
                </Text>
              </View>
            </Card>
          )}

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              style={styles.modalButton}
            />
            <Button
              title="Add Stock"
              onPress={handleAddStock}
              disabled={!selectedProduct || !quantity}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Remove Stock Modal */}
      <Modal
        isVisible={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          resetForm();
        }}
        title="Remove Stock"
      >
        <View style={styles.modalContent}>
          <Select
            label="Product"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.name} (Stock: ${p.stock})`,
            }))}
            value={selectedProduct?.id}
            onValueChange={(value) => {
              const product = products.find((p) => p.id === value);
              setSelectedProduct(product);
            }}
          />

          <Input
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity to remove"
          />

          <Input
            label="Reason (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Reason for removal"
          />

          {selectedProduct && quantity && (
            <Card style={styles.previewCard}>
              <Text style={styles.previewTitle}>Stock Update Preview</Text>
              <View style={styles.previewRow}>
                <Text>Current Stock:</Text>
                <Text style={styles.previewValue}>{selectedProduct.stock}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text>Removing:</Text>
                <Text style={[styles.previewValue, styles.removeValue]}>
                  -{parseInt(quantity) || 0}
                </Text>
              </View>
              <View style={[styles.previewRow, styles.previewTotal]}>
                <Text style={styles.previewTotalLabel}>New Stock:</Text>
                <Text
                  style={[
                    styles.previewTotalValue,
                    parseInt(quantity) > selectedProduct.stock && styles.errorValue,
                  ]}
                >
                  {selectedProduct.stock - (parseInt(quantity) || 0)}
                </Text>
              </View>
              {parseInt(quantity) > selectedProduct.stock && (
                <Text style={styles.errorText}>Insufficient stock</Text>
              )}
            </Card>
          )}

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowRemoveModal(false);
                resetForm();
              }}
              style={styles.modalButton}
            />
            <Button
              title="Remove Stock"
              variant="danger"
              onPress={handleRemoveStock}
              disabled={
                !selectedProduct ||
                !quantity ||
                parseInt(quantity) > selectedProduct?.stock
              }
              style={styles.modalButton}
            />
          </View>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    marginRight: spacing.sm,
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
  cellText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  productName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  productSku: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginLeft: 4,
  },
  quantity: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  stockChange: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  notes: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    maxWidth: 150,
  },
  modalContent: {
    gap: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
  },
  previewTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  previewValue: {
    fontWeight: typography.weights.medium,
  },
  addValue: {
    color: colors.success[600],
  },
  removeValue: {
    color: colors.danger[600],
  },
  previewTotal: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  previewTotalLabel: {
    fontWeight: typography.weights.semibold,
  },
  previewTotalValue: {
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  errorValue: {
    color: colors.danger[600],
  },
  errorText: {
    color: colors.danger[600],
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default Inventory;