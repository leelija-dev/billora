import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import StockList from '../../components/inventory/StockList';
import Button from '../../components/common/Button';
import { theme } from '../../theme';

const InventoryScreen = () => {
  const navigation = useNavigation();

  const handleStockMovement = () => {
    navigation.navigate('StockMovement');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header
        title="Inventory"
        rightComponent={
          <Button
            title="Movement"
            onPress={handleStockMovement}
            variant="outline"
            size="small"
          />
        }
      />
      
      <View style={styles.content}>
        <StockList />
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

export default InventoryScreen;
