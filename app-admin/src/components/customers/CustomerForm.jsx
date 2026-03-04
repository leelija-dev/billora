import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { customersAPI } from '../../api';
import { useMutation } from '../../hooks/useApi';
import { useCustomerStore } from '../../store/customerStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import Button from '../common/Button';
import Header from '../common/Header';
import Input from '../common/Input';

const CustomerForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedCustomer, updateCustomer, addCustomer } = useCustomerStore();
  const { showSuccess, showError } = useUIStore();
  
  const isEditing = route.params?.customerId || selectedCustomer?.id;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      notes: '',
    },
  });

  const { mutate: createCustomer } = useMutation(customersAPI.createCustomer);
  const { mutate: updateCustomerApi } = useMutation(
    (data) => customersAPI.updateCustomer(route.params?.customerId || selectedCustomer?.id, data)
  );

  useEffect(() => {
    if (isEditing && selectedCustomer) {
      reset({
        name: selectedCustomer.name || '',
        email: selectedCustomer.email || '',
        phone: selectedCustomer.phone || '',
        company: selectedCustomer.company || '',
        address: selectedCustomer.address || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
        notes: selectedCustomer.notes || '',
      });
    }
  }, [isEditing, selectedCustomer, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (isEditing) {
        const response = await updateCustomerApi(data);
        updateCustomer(selectedCustomer.id, response.customer);
        showSuccess('Customer updated successfully');
      } else {
        const response = await createCustomer(data);
        addCustomer(response.customer);
        showSuccess('Customer created successfully');
      }

      navigation.goBack();
    } catch (error) {
      showError(error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await customersAPI.deleteCustomer(selectedCustomer.id);
              navigation.goBack();
              showSuccess('Customer deleted successfully');
            } catch (error) {
              showError(error.message || 'Failed to delete customer');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Customer' : 'Add Customer'}
        rightComponent={
          isEditing ? (
            <Button
              title="Delete"
              onPress={handleDelete}
              variant="ghost"
              size="small"
            />
          ) : null
        }
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Customer name is required',
              maxLength: {
                value: 100,
                message: 'Name must be less than 100 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter customer name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              pattern: {
                value: /^\+?[\d\s\-\(\)]+$/,
                message: 'Invalid phone number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter company name (optional)"
                error={errors.company?.message}
              />
            )}
          />

          <Text style={styles.sectionTitle}>Address</Text>
          
          <Controller
            control={control}
            name="address.street"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Street Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter street address"
                error={errors.address?.street?.message}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="address.city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="City"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter city"
                    error={errors.address?.city?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="address.state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="State"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter state"
                    error={errors.address?.state?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="address.zip"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="ZIP Code"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter ZIP code"
                    error={errors.address?.zip?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="address.country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Country"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter country"
                    error={errors.address?.country?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Notes"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Add any notes about this customer"
                multiline
                numberOfLines={4}
                error={errors.notes?.message}
              />
            )}
          />

          <Button
            title={isEditing ? 'Update Customer' : 'Create Customer'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!isValid || loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
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
  },
  form: {
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});

export default CustomerForm;
