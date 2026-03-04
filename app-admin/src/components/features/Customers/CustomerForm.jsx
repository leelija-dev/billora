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
import Card from '../../common/Card/Card';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const CustomerForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    notes: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        country: initialData.country || '',
        taxId: initialData.taxId || '',
        notes: initialData.notes || '',
        status: initialData.status || 'active',
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Personal Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter full name"
            required
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="customer@example.com"
            keyboardType="email-address"
            required
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad"
          />

          <Input
            label="Company"
            value={formData.company}
            onChangeText={(text) => setFormData({ ...formData, company: text })}
            placeholder="Company name (optional)"
          />
        </Card>

        {/* Address */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <Input
            label="Street Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Street address"
          />

          <View style={styles.row}>
            <Input
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="City"
              style={styles.rowInput}
            />
            <Input
              label="State"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="State"
              style={styles.rowInput}
            />
          </View>

          <View style={styles.row}>
            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              placeholder="ZIP code"
              keyboardType="numeric"
              style={styles.rowInput}
            />
            <Input
              label="Country"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="Country"
              style={styles.rowInput}
            />
          </View>

          <Input
            label="Tax ID / VAT Number"
            value={formData.taxId}
            onChangeText={(text) => setFormData({ ...formData, taxId: text })}
            placeholder="Tax ID"
          />
        </Card>

        {/* Additional Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'blocked', label: 'Blocked' },
            ]}
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          />

          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Additional notes about the customer..."
            multiline
            numberOfLines={4}
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
            title={initialData ? 'Update Customer' : 'Create Customer'}
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
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowInput: {
    flex: 1,
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

export default CustomerForm;