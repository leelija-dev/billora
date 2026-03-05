// screens/orders/CreateOrderScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderForm from '../../components/orders/OrderForm'
import { theme } from '../../theme';

const CreateOrderScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <OrderForm />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
};

export default CreateOrderScreen;