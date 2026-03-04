import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerForm from '../../components/customers/CustomerForm';
import { theme } from '../../theme';

const AddCustomerScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <CustomerForm />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
};

export default AddCustomerScreen;
