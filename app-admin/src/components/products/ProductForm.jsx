import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { productsAPI } from '../../api';
import { useMutation } from '../../hooks/useApi';
import { useProductStore } from '../../store/productStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../theme';
import Button from '../common/Button';
import Header from '../common/Header';
import Input from '../common/Input';

const ProductForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProduct, updateProduct, addProduct } = useProductStore();
  const { showSuccess, showError } = useUIStore();
  
  const isEditing = route.params?.productId || selectedProduct?.id;
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
      description: '',
      price: '',
      originalPrice: '',
      sku: '',
      category: '',
      stock: '',
      minStock: '',
      images: [],
    },
  });

  const { mutate: createProduct } = useMutation(productsAPI.createProduct);
  const { mutate: updateProductApi } = useMutation(
    (data) => productsAPI.updateProduct(route.params?.productId || selectedProduct?.id, data)
  );

  useEffect(() => {
    if (isEditing && selectedProduct) {
      reset({
        name: selectedProduct.name || '',
        description: selectedProduct.description || '',
        price: selectedProduct.price?.toString() || '',
        originalPrice: selectedProduct.originalPrice?.toString() || '',
        sku: selectedProduct.sku || '',
        category: selectedProduct.category || '',
        stock: selectedProduct.stock?.toString() || '',
        minStock: selectedProduct.minStock?.toString() || '',
      });
    }
  }, [isEditing, selectedProduct, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const productData = {
        ...data,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        stock: parseInt(data.stock),
        minStock: data.minStock ? parseInt(data.minStock) : 0,
      };

      if (isEditing) {
        const response = await updateProductApi(productData);
        updateProduct(selectedProduct.id, response.product);
        showSuccess('Product updated successfully');
      } else {
        const response = await createProduct(productData);
        addProduct(response.product);
        showSuccess('Product created successfully');
      }

      navigation.goBack();
    } catch (error) {
      showError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
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
              await productsAPI.deleteProduct(selectedProduct.id);
              navigation.goBack();
              showSuccess('Product deleted successfully');
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

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Product' : 'Add Product'}
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
              required: 'Product name is required',
              maxLength: {
                value: 100,
                message: 'Name must be less than 100 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Product Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: 1000,
                message: 'Description must be less than 1000 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product description"
                multiline
                numberOfLines={4}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="sku"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="SKU"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter SKU (optional)"
                error={errors.sku?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            rules={{
              required: 'Category is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Category"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product category"
                error={errors.category?.message}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: 'Price is required',
                  validate: {
                    positive: (value) => value > 0 || 'Price must be greater than 0',
                    numeric: (value) => !isNaN(value) || 'Price must be a number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Price"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.price?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="originalPrice"
                rules={{
                  validate: {
                    numeric: (value) => !value || !isNaN(value) || 'Original price must be a number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Original Price"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={errors.originalPrice?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="stock"
                rules={{
                  required: 'Stock is required',
                  validate: {
                    positive: (value) => value >= 0 || 'Stock must be 0 or greater',
                    integer: (value) => Number.isInteger(Number(value)) || 'Stock must be a whole number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Stock"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0"
                    keyboardType="number-pad"
                    error={errors.stock?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="minStock"
                rules={{
                  validate: {
                    positive: (value) => !value || value >= 0 || 'Min stock must be 0 or greater',
                    integer: (value) => !value || Number.isInteger(Number(value)) || 'Min stock must be a whole number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Min Stock Alert"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="0"
                    keyboardType="number-pad"
                    error={errors.minStock?.message}
                  />
                )}
              />
            </View>
          </View>

          <Button
            title={isEditing ? 'Update Product' : 'Create Product'}
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

export default ProductForm;
