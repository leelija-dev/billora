import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { inventoryAPI } from '../../api';
import { usePaginatedApi } from '../../hooks/useApi';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Loading from '../common/Loading';
import SearchBar from '../common/SearchBar';
import StatusBadge from '../common/StatusBadge';

const StockList = ({ onStockPress }) => {
  const navigation = useNavigation();
  const { setLoading, setError } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    lowStock: false,
  });

  const {
    data: stockItems,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedApi(
    (params) => inventoryAPI.getInventory({ ...params, ...filters }),
    [filters],
    true
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      setError('inventory', 'Failed to refresh inventory');
    }
  }, [refresh, setError]);

  const handleStockPress = useCallback((item) => {
    if (onStockPress) {
      onStockPress(item);
    } else {
      navigation.navigate('StockMovement', { productId: item.productId });
    }
  }, [navigation, onStockPress]);

  const toggleLowStockFilter = useCallback(() => {
    setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }));
  }, []);

  const renderStockItem = useCallback(({ item }) => {
    const isLowStock = item.currentStock <= item.minStock;
    const stockStatus = isLowStock ? 'Low Stock' : 'In Stock';
    const stockVariant = isLowStock ? 'warning' : 'success';

    return (
      <Card 
        style={styles.stockCard} 
        padding="sm"
        onPress={() => handleStockPress(item)}
      >
        <View style={styles.stockHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.sku}>SKU: {item.sku}</Text>
          </View>
          <StatusBadge
            status={stockStatus}
            variant={stockVariant}
            size="small"
          />
        </View>

        <View style={styles.stockDetails}>
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Current Stock:</Text>
            <Text style={[
              styles.stockValue,
              { color: isLowStock ? theme.colors.warning : theme.colors.text }
            ]}>
              {item.currentStock} units
            </Text>
          </View>
          
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Min Stock:</Text>
            <Text style={styles.stockValue}>{item.minStock} units</Text>
          </View>

          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Value:</Text>
            <Text style={styles.stockValue}>
              {formatCurrency(item.currentStock * item.unitPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>Location:</Text>
          <Text style={styles.locationValue}>{item.location || 'Main Warehouse'}</Text>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            Last updated: {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'Never'}
          </Text>
        </View>
      </Card>
    );
  }, [handleStockPress]);

  const renderFooter = useCallback(() => {
    if (loading) {
      return <Loading text="Loading more items..." />;
    }
    return null;
  }, [loading]);

  // Error state
  if (error && !stockItems) {
    return (
      <ErrorState
        title="Failed to Load Inventory"
        description="Unable to load inventory data. Please check your connection and try again."
        onRetry={refresh}
      />
    );
  }

  // Empty state
  if (!loading && (!stockItems || stockItems.length === 0)) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search inventory..."
        />
        <EmptyState
          title="No Inventory Items"
          description="There are no inventory items to display"
          image={<Text style={styles.emptyIcon}>📦</Text>}
        />
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search inventory..."
        />
        <View style={styles.filterButtons}>
          <Button
            title={filters.lowStock ? "All Items" : "Low Stock Only"}
            onPress={toggleLowStockFilter}
            variant={filters.lowStock ? 'primary' : 'outline'}
            size="small"
          />
        </View>
      </View>
      
      <FlatList
        data={stockItems}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onRefresh={handleRefresh}
        refreshing={loading && stockItems.length > 0}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  filterButtons: {
    marginTop: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  stockCard: {
    marginBottom: theme.spacing.sm,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  sku: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  stockRow: {
    alignItems: 'center',
  },
  stockLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  stockValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  locationValue: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  lastUpdated: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  lastUpdatedText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  emptyIcon: {
    fontSize: 48,
  },
});

export default StockList;