import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useProductStore } from '../../store/productStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Modal from '../../components/common/Modal/Modal';
import ProductForm from '../../components/features/Products/ProductForm';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Products = ({ navigation }) => {
  const {
    products,
    totalProducts,
    currentPage,
    loading,
    filters,
    fetchProducts,
    deleteProduct,
    setFilters,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(id),
        },
      ]
    );
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      flex: 2,
      cell: (value, row) => (
        <View style={styles.productCell}>
          <View style={styles.productImage}>
            <Icon name="package" size={20} color={colors.gray[400]} />
          </View>
          <View>
            <Text style={styles.productName}>{value}</Text>
            <Text style={styles.productSku}>SKU: {row.sku}</Text>
          </View>
        </View>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      cell: (value) => (
        <Text style={styles.price}>${value.toFixed(2)}</Text>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      cell: (value, row) => (
        <View>
          <View style={styles.stockBar}>
            <View
              style={[
                styles.stockFill,
                {
                  width: `${(value / row.maxStock) * 100}%`,
                  backgroundColor:
                    value <= row.lowStockThreshold
                      ? colors.danger[500]
                      : value <= row.lowStockThreshold * 2
                      ? colors.warning[500]
                      : colors.success[500],
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.stockText,
              value <= row.lowStockThreshold && styles.lowStockText,
            ]}
          >
            {value}
          </Text>
        </View>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          variant={value ? 'success' : 'default'}
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
            onPress={() => handleEditProduct(row)}
          >
            <Icon name="pencil" size={18} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProduct(value)}
          >
            <Icon name="delete" size={18} color={colors.danger[500]} />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.subtitle}>Manage your product catalog</Text>
        </View>
        <Button
          title="Add Product"
          onPress={handleAddProduct}
          icon="plus"
          size="sm"
        />
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
            placeholder="Search products..."
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
            <Input
              placeholder="Category"
              value={filters.category}
              onChangeText={(text) => setFilters({ category: text })}
              style={styles.filterInput}
            />
            <Input
              placeholder="Status"
              value={filters.status}
              onChangeText={(text) => setFilters({ status: text })}
              style={styles.filterInput}
            />
          </View>
        </Card>
      )}

      {/* Products Table */}
      {products.length === 0 && !loading ? (
        <EmptyState
          icon="package-variant"
          title="No products yet"
          description="Add your first product to get started"
          action={
            <Button title="Add Product" onPress={handleAddProduct} size="lg" />
          }
        />
      ) : (
        <View style={styles.tableContainer}>
          <Table
            columns={columns}
            data={products}
            loading={loading}
            onRowPress={handleEditProduct}
          />
        </View>
      )}

      {/* Add Product Modal */}
      <Modal
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm
          onSubmit={async (data) => {
            await useProductStore.getState().createProduct(data);
            setShowAddModal(false);
            fetchProducts();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="lg"
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={async (data) => {
            await useProductStore.getState().updateProduct(selectedProduct.id, data);
            setShowEditModal(false);
            fetchProducts();
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
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterInput: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    margin: spacing.md,
  },
  productCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
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
  price: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  stockBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    marginBottom: 4,
    width: 80,
  },
  stockFill: {
    height: '100%',
    borderRadius: 2,
  },
  stockText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  lowStockText: {
    color: colors.danger[600],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
});

export default Products;