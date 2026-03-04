import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StockMovement from '../../components/inventory/StockMovement';
import { theme } from '../../theme';

const StockMovementScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StockMovement />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
};

export default StockMovementScreen;
