import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useProductStore } from '../../../store/productStore';
import { useCustomerStore } from '../../../store/customerStore';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import Select from '../../common/Select/Select';
import Card from '../../common/Card/Card';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { products, fetchProducts } = useProductStore();
  const { customers, fetchCustomers } = useCustomerStore();

  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    shippingAddress: '',
    paymentMethod: 'credit_card',
    notes: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [itemProducts, setItemProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customer?.id || '',
        items: initialData.items || [{ productId: '', quantity: 1, price: 0 }],
        shippingAddress: initialData.shippingAddress || '',
        paymentMethod: initialData.paymentMethod || 'credit_card',
        notes: initialData.notes || '',
      });

      if (initialData.customer) {
        setSelectedCustomer(initialData.customer);
      }

      if (initialData.items) {
        const products = initialData.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
        }));
        setItemProducts(products);
      }
    }
  }, [initialData]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  const calculateTotals = () => {
    const sub = formData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const tx = sub * 0.1; // 10% tax
    const tot = sub + tx;

    setSubtotal(sub);
    setTax(tx);
    setTotal(tot);
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
    setFormData({ ...formData, customerId });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].price = product.price;
        const newItemProducts = [...itemProducts];
        newItemProducts[index] = product;
        setItemProducts(newItemProducts);
      }
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0 }],
    });
    setItemProducts([...itemProducts, null]);
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      const newProducts = itemProducts.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
      setItemProducts(newProducts);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      customer: selectedCustomer,
      items: formData.items.map((item, index) => ({
        ...item,
        productName: itemProducts[index]?.name,
        sku: itemProducts[index]?.sku,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      total,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Customer Selection */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Select
            label="Select Customer"
            options={customers.map(c => ({
              value: c.id,
              label: `${c.name} (${c.email})`,
            }))}
            value={formData.customerId}
            onValueChange={handleCustomerChange}
            required
          />

          {selectedCustomer && (
            <View style={styles.customerInfo}>
              <Text style={styles.customerInfoText}>{selectedCustomer.name}</Text>
              <Text style={styles.customerInfoText}>{selectedCustomer.email}</Text>
              {selectedCustomer.phone && (
                <Text style={styles.customerInfoText}>{selectedCustomer.phone}</Text>
              )}
            </View>
          )}
        </Card>

        {/* Order Items */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <Button
              title="Add Item"
              onPress={addItem}
              variant="outline"
              size="sm"
              icon="plus"
            />
          </View>

          {formData.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Item {index + 1}</Text>
                {index > 0 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Icon name="delete" size={20} color={colors.danger[500]} />
                  </TouchableOpacity>
                )}
              </View>

              <Select
                label="Product"
                options={products.map(p => ({
                  value: p.id,
                  label: `${p.name} - $${p.price}`,
                }))}
                value={item.productId}
                onValueChange={(value) => handleItemChange(index, 'productId', value)}
                required
              />

              <View style={styles.itemDetails}>
                <Input
                  label="Quantity"
                  value={item.quantity.toString()}
                  onChangeText={(text) => handleItemChange(index, 'quantity', parseInt(text) || 0)}
                  keyboardType="numeric"
                  style={styles.itemQuantity}
                />
                <Input
                  label="Price"
                  value={item.price.toString()}
                  editable={false}
                  style={styles.itemPrice}
                />
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalLabel}>Total:</Text>
                  <Text style={styles.itemTotalValue}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (10%):</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        {/* Shipping & Payment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping & Payment</Text>

          <Input
            label="Shipping Address"
            value={formData.shippingAddress}
            onChangeText={(text) => setFormData({ ...formData, shippingAddress: text })}
            placeholder="Enter shipping address"
            multiline
            required
          />

          <Select
            label="Payment Method"
            options={[
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'debit_card', label: 'Debit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cash', label: 'Cash' },
            ]}
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          />

          <Input
            label="Order Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Any special instructions..."
            multiline
          />
        </Card>

        {/* Form Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.actionButton}
          />
          <Button
            title={initialData ? 'Update Order' : 'Create Order'}
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
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  customerInfo: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
  },
  customerInfoText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    marginBottom: 2,
  },
  itemRow: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[700],
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  itemQuantity: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
  },
  itemTotal: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  itemTotalLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginBottom: 2,
  },
  itemTotalValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  summary: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
});

export default OrderForm;