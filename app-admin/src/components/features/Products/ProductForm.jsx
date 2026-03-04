import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import Select from '../../common/Select/Select';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const ProductForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    maxStock: '',
    lowStockThreshold: '5',
    isActive: true,
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || '',
        price: initialData.price?.toString() || '',
        cost: initialData.cost?.toString() || '',
        stock: initialData.stock?.toString() || '',
        maxStock: initialData.maxStock?.toString() || '',
        lowStockThreshold: initialData.lowStockThreshold?.toString() || '5',
        isActive: initialData.isActive ?? true,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys' },
    { value: 'food', label: 'Food' },
    { value: 'beauty', label: 'Beauty' },
  ];

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      maxStock: parseInt(formData.maxStock) || 100,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Product Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter product name"
          required
        />

        <Input
          label="SKU"
          value={formData.sku}
          onChangeText={(text) => setFormData({ ...formData, sku: text })}
          placeholder="Enter SKU"
          required
        />

        <Select
          label="Category"
          options={categories}
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        />

        <View style={styles.row}>
          <Input
            label="Price"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            keyboardType="numeric"
            style={styles.rowInput}
          />
          <Input
            label="Cost"
            value={formData.cost}
            onChangeText={(text) => setFormData({ ...formData, cost: text })}
            placeholder="0.00"
            keyboardType="numeric"
            style={styles.rowInput}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Stock"
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            placeholder="0"
            keyboardType="numeric"
            style={styles.rowInput}
          />
          <Input
            label="Max Stock"
            value={formData.maxStock}
            onChangeText={(text) => setFormData({ ...formData, maxStock: text })}
            placeholder="100"
            keyboardType="numeric"
            style={styles.rowInput}
          />
        </View>

        <Input
          label="Low Stock Threshold"
          value={formData.lowStockThreshold}
          onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: text })}
          placeholder="5"
          keyboardType="numeric"
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Enter product description"
          multiline
          numberOfLines={4}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Active</Text>
          <Switch
            value={formData.isActive}
            onValueChange={(value) => setFormData({ ...formData, isActive: value })}
            trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.actionButton}
          />
          <Button
            title={initialData ? 'Update' : 'Create'}
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowInput: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.gray[700],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});

export default ProductForm;