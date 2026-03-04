import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productsAPI } from '../../api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ErrorState from '../../components/common/ErrorState';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import { useApi } from '../../hooks/useApi';
import { useProductStore } from '../../store/productStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const { selectedProduct, setSelectedProduct } = useProductStore();
  const { showSuccess, showError } = useUIStore();
  const [loading, setLoading] = useState(false);

  const {
    data: product,
    loading: productLoading,
    error: productError,
    execute: fetchProduct,
  } = useApi(() => productsAPI.getProduct(productId));

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product, setSelectedProduct]);

  const handleEdit = () => {
    navigation.navigate('AddProduct', { productId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await productsAPI.deleteProduct(productId);
              showSuccess('Product deleted successfully');
              navigation.goBack();
            } catch (error) {
              showError(error.message || 'Failed to delete product');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name}: ${formatCurrency(product?.price)}`,
        title: product?.name,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleUpdateStock = () => {
    // Navigate to stock update screen or show modal
    Alert.alert(
      'Update Stock',
      'Stock update feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  if (productLoading && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton />
        <Loading text="Loading product..." />
      </SafeAreaView>
    );
  }

  if (productError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton />
        <ErrorState
          title="Failed to Load Product"
          description="Unable to load product details. Please try again."
          onRetry={fetchProduct}
        />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton />
        <ErrorState
          title="Product Not Found"
          description="The product you're looking for doesn't exist."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header
        title="Product Details"
        showBackButton
        rightComponent={
          <View style={styles.headerButtons}>
            <Button
              title="Share"
              onPress={handleShare}
              variant="ghost"
              size="small"
            />
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
        <Card style={styles.productCard}>
          <View style={styles.productHeader}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.category}>{product.category}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text style={styles.originalPrice}>
                  {formatCurrency(product.originalPrice)}
                </Text>
              )}
            </View>
          </View>

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SKU</Text>
              <Text style={styles.detailValue}>{product.sku || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Stock</Text>
              <Text style={styles.detailValue}>{product.stock} units</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Min Stock</Text>
              <Text style={styles.detailValue}>{product.minStock || 0} units</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[
                styles.detailValue,
                { color: product.stock > 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {product.createdAt && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information</Text>
              <Text style={styles.infoText}>
                Created: {formatRelativeTime(product.createdAt)}
              </Text>
              {product.updatedAt && (
                <Text style={styles.infoText}>
                  Updated: {formatRelativeTime(product.updatedAt)}
                </Text>
              )}
            </View>
          )}
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Update Stock"
            onPress={handleUpdateStock}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Delete Product"
            onPress={handleDelete}
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
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
  productCard: {
    marginBottom: theme.spacing.lg,
  },
  productHeader: {
    marginBottom: theme.spacing.lg,
  },
  productInfo: {
    marginBottom: theme.spacing.md,
  },
  productName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  category: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  originalPrice: {
    ...theme.typography.body2,
    color: theme.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
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
  infoText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  actionButtons: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});

export default ProductDetailScreen;
