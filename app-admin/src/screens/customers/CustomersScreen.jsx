import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCustomerStore } from '../../store/customerStore';
import Header from '../../components/common/Header';
import CustomerList from '../../components/customers/CustomerList';
import Button from '../../components/common/Button';
import { theme } from '../../theme';

const CustomersScreen = () => {
  const navigation = useNavigation();
  const { filters, clearFilters } = useCustomerStore();

  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  const hasActiveFilters = filters.search || filters.status || filters.dateRange;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header
        title="Customers"
        rightComponent={
          <Button
            title="Add"
            onPress={handleAddCustomer}
            variant="primary"
            size="small"
          />
        }
      />
      
      <View style={styles.content}>
        <CustomerList />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});

export default CustomersScreen;
