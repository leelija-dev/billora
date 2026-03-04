import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { customersAPI } from '../../api';
import { usePaginatedApi } from '../../hooks/useApi';
import { useCustomerStore } from '../../store/customerStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Loading from '../common/Loading';
import SearchBar from '../common/SearchBar';
import CustomerCard from './CustomerCard';

const CustomerList = ({ onCustomerPress, mode = 'normal' }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customers, filters, setFilters, appendCustomers, resetPagination } = useCustomerStore();
  const { setLoading, setError } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: apiCustomers,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedApi(
    (params) => customersAPI.getCustomers({ ...params, ...filters }),
    [filters],
    true
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setFilters({ search: query });
    resetPagination();
  }, [setFilters, resetPagination]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      setError('customers', 'Failed to refresh customers');
    }
  }, [refresh, setError]);

  const handleCustomerPress = useCallback((customer) => {
    if (mode === 'select') {
      navigation.goBack();
      // The onSelect callback will be handled by the parent screen
      if (route.params?.onSelect) {
        route.params.onSelect(customer);
      }
    } else if (onCustomerPress) {
      onCustomerPress(customer);
    } else {
      navigation.navigate('CustomerDetail', { customerId: customer.id });
    }
  }, [navigation, onCustomerPress, mode, route.params]);

  const renderCustomer = useCallback(({ item }) => (
    <CustomerCard customer={item} onPress={handleCustomerPress} />
  ), [handleCustomerPress]);

  const renderFooter = useCallback(() => {
    if (loading) {
      return <Loading text="Loading more customers..." />;
    }
    return null;
  }, [loading]);

  if (error && !apiCustomers) {
    return (
      <ErrorState
        title="Failed to Load Customers"
        description="Unable to load customers. Please check your connection and try again."
        onRetry={refresh}
      />
    );
  }

  if (!loading && (!apiCustomers || apiCustomers.length === 0)) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search customers..."
        />
        <EmptyState
          title="No Customers Found"
          description="Start by adding your first customer or adjust your search filters"
          image={<Text style={styles.emptyIcon}>👥</Text>}
          actionLabel="Add Customer"
          onAction={() => navigation.navigate('AddCustomer')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search customers..."
      />
      
      <FlatList
        data={apiCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onRefresh={handleRefresh}
        refreshing={loading && apiCustomers.length > 0}
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
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
  },
});

export default CustomerList;
