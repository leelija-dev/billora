import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductForm from '../../components/products/ProductForm';
import { theme } from '../../theme';

const AddProductScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ProductForm />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
};

export default AddProductScreen;
