import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

const Table = ({ columns, data, loading = false, onRowPress }) => {
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((column, index) => (
        <View
          key={index}
          style={[
            styles.headerCell,
            { flex: column.flex || 1 },
          ]}
        >
          <Text style={styles.headerText}>{column.header}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.row,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
      ]}
      onPress={() => onRowPress?.(item)}
      disabled={!onRowPress}
    >
      {columns.map((column, colIndex) => (
        <View
          key={colIndex}
          style={[
            styles.cell,
            { flex: column.flex || 1 },
          ]}
        >
          {column.cell
            ? column.cell(item[column.accessor], item)
            : (
              <Text style={styles.cellText}>
                {item[column.accessor]?.toString() || '-'}
              </Text>
            )}
        </View>
      ))}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingVertical: spacing.sm,
  },
  headerCell: {
    paddingHorizontal: spacing.sm,
  },
  headerText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.gray[600],
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  rowEven: {
    backgroundColor: colors.white,
  },
  rowOdd: {
    backgroundColor: colors.gray[50],
  },
  cell: {
    paddingHorizontal: spacing.sm,
  },
  cellText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
  },
});

export default Table;