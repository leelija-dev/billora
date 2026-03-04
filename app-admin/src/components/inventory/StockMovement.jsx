import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react'; // Added React import
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { inventoryAPI } from '../../api';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useMutation, usePaginatedApi } from '../../hooks/useApi';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import { STOCK_MOVEMENT_TYPE_LABELS } from '../../utils/constants';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Input from '../common/Input';
import Loading from '../common/Loading';
import StatusBadge from '../common/StatusBadge';

const StockMovement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Safely get productId from route params
  const productId = route.params?.productId;
  
  const { setLoading, setError, showToast } = useUIStore(); // Added showToast if available
  const [showAddForm, setShowAddForm] = useState(false);
  const [movementForm, setMovementForm] = useState({
    type: 'in',
    quantity: '',
    reason: '',
    reference: '',
  });
  const [formErrors, setFormErrors] = useState({}); // Added form validation

  // Only fetch if productId exists
  const {
    data: movements,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedApi(
    (params) => inventoryAPI.getStockMovements({ ...params, productId }),
    [productId],
    !!productId // Only enable if productId exists
  );

  const { mutate: createMovement, loading: creatingMovement, error: mutationError } = 
    useMutation(inventoryAPI.createStockMovement);

  // Validate form
  const validateForm = useCallback(() => {
    const errors = {};
    if (!movementForm.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (parseInt(movementForm.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    if (!movementForm.reason) {
      errors.reason = 'Reason is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [movementForm]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      setError('inventory', 'Failed to refresh movements');
    }
  }, [refresh, setError]);

  const handleAddMovement = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      const movementData = {
        ...movementForm,
        productId,
        quantity: parseInt(movementForm.quantity, 10),
      };

      await createMovement(movementData);
      
      // Reset form and close
      setShowAddForm(false);
      setMovementForm({
        type: 'in',
        quantity: '',
        reason: '',
        reference: '',
      });
      setFormErrors({});
      
      // Show success message
      if (showToast) {
        showToast('Movement added successfully', 'success');
      }
      
      // Refresh the list
      refresh();
      
    } catch (error) {
      setError('inventory', error.message || 'Failed to add movement');
      
      // Show error toast
      if (showToast) {
        showToast(error.message || 'Failed to add movement', 'error');
      }
    }
  };

  const handleCancelForm = useCallback(() => {
    setShowAddForm(false);
    setMovementForm({
      type: 'in',
      quantity: '',
      reason: '',
      reference: '',
    });
    setFormErrors({});
  }, []);

  const getMovementVariant = (type) => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'error';
      case 'transfer':
        return 'info';
      case 'adjustment':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderMovement = useCallback(({ item }) => (
    <Card style={styles.movementCard} padding="sm">
      <View style={styles.movementHeader}>
        <View style={styles.movementInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.movementDate}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        <StatusBadge
          status={STOCK_MOVEMENT_TYPE_LABELS[item.type] || item.type}
          variant={getMovementVariant(item.type)}
          size="small"
        />
      </View>

      <View style={styles.movementDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={[
            styles.detailValue,
            { color: item.type === 'in' ? theme.colors.success : theme.colors.error }
          ]}>
            {item.type === 'in' ? '+' : '-'}{item.quantity} units
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Balance:</Text>
          <Text style={styles.detailValue}>{item.balance} units</Text>
        </View>

        {item.unitPrice && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Value:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(item.quantity * item.unitPrice)}
            </Text>
          </View>
        )}
      </View>

      {item.reason && (
        <View style={styles.reasonSection}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>
      )}

      {item.reference && (
        <View style={styles.referenceSection}>
          <Text style={styles.referenceLabel}>Reference:</Text>
          <Text style={styles.referenceText}>{item.reference}</Text>
        </View>
      )}

      <View style={styles.userSection}>
        <Text style={styles.userText}>
          By {item.createdBy?.name || 'System'} • {item.location || 'Main Warehouse'}
        </Text>
      </View>
    </Card>
  ), []);

  const renderFooter = useCallback(() => {
    if (loading) {
      return <Loading text="Loading more movements..." />;
    }
    return null;
  }, [loading]);

  // Show message if no productId
  if (!productId) {
    return (
      <View style={styles.container}>
        <Header
          title="Stock Movements"
          showBackButton
        />
        <ErrorState
          title="No Product Selected"
          description="Please select a product to view its stock movements"
          onRetry={() => navigation.goBack()}
        />
      </View>
    );
  }

  if (error && !movements) {
    return (
      <View style={styles.container}>
        <Header
          title="Stock Movements"
          showBackButton
        />
        <ErrorState
          title="Failed to Load Movements"
          description="Unable to load stock movements. Please try again."
          onRetry={refresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Stock Movements"
        showBackButton
        rightComponent={
          <Button
            title="Add Movement"
            onPress={() => setShowAddForm(true)}
            variant="primary"
            size="small"
          />
        }
      />

      {showAddForm && (
        <Card style={styles.addFormCard} padding="md">
          <Text style={styles.formTitle}>Add Stock Movement</Text>
          
          <View style={styles.typeButtons}>
            <Button
              title="Stock In"
              onPress={() => setMovementForm(prev => ({ ...prev, type: 'in' }))}
              variant={movementForm.type === 'in' ? 'primary' : 'outline'}
              size="small"
              style={styles.typeButton}
            />
            <Button
              title="Stock Out"
              onPress={() => setMovementForm(prev => ({ ...prev, type: 'out' }))}
              variant={movementForm.type === 'out' ? 'primary' : 'outline'}
              size="small"
              style={styles.typeButton}
            />
          </View>

          <Input
            label="Quantity"
            value={movementForm.quantity}
            onChangeText={(value) => {
              setMovementForm(prev => ({ ...prev, quantity: value }));
              if (formErrors.quantity) {
                setFormErrors(prev => ({ ...prev, quantity: '' }));
              }
            }}
            placeholder="Enter quantity"
            keyboardType="number-pad"
            error={formErrors.quantity}
          />

          <Input
            label="Reason"
            value={movementForm.reason}
            onChangeText={(value) => {
              setMovementForm(prev => ({ ...prev, reason: value }));
              if (formErrors.reason) {
                setFormErrors(prev => ({ ...prev, reason: '' }));
              }
            }}
            placeholder="Enter reason for movement"
            multiline
            numberOfLines={3}
            error={formErrors.reason}
          />

          <Input
            label="Reference (Optional)"
            value={movementForm.reference}
            onChangeText={(value) => setMovementForm(prev => ({ ...prev, reference: value }))}
            placeholder="Purchase order, invoice number, etc."
          />

          <View style={styles.formButtons}>
            <Button
              title="Cancel"
              onPress={handleCancelForm}
              variant="outline"
              style={styles.formButton}
            />
            <Button
              title="Add Movement"
              onPress={handleAddMovement}
              loading={creatingMovement}
              disabled={creatingMovement}
              style={styles.formButton}
            />
          </View>
        </Card>
      )}

      {!loading && (!movements || movements.length === 0) ? (
        <EmptyState
          title="No Stock Movements"
          description="There are no stock movements to display for this product"
          image={<Text style={styles.emptyIcon}>📊</Text>}
        />
      ) : (
        <FlatList
          data={movements}
          renderItem={renderMovement}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          onRefresh={handleRefresh}
          refreshing={loading && movements.length > 0}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  addFormCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  formTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  formButton: {
    flex: 1,
  },
  movementCard: {
    marginBottom: theme.spacing.sm,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  movementInfo: {
    flex: 1,
  },
  productName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  movementDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  movementDetails: {
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
  reasonSection: {
    marginBottom: theme.spacing.sm,
  },
  reasonLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  reasonText: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  referenceSection: {
    marginBottom: theme.spacing.sm,
  },
  referenceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  referenceText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  userSection: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  userText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  emptyIcon: {
    fontSize: 48,
  },
});

export default StockMovement;