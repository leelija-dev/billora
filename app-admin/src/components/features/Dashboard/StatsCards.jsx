import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue?.toLocaleString() || 0}`,
      icon: 'cash',
      color: colors.green[500],
      bgColor: colors.green[50],
    },
    {
      title: 'Total Orders',
      value: stats.orders?.toLocaleString() || 0,
      icon: 'shopping',
      color: colors.blue[500],
      bgColor: colors.blue[50],
    },
    {
      title: 'Products',
      value: stats.products?.toLocaleString() || 0,
      icon: 'package',
      color: colors.purple[500],
      bgColor: colors.purple[50],
    },
    {
      title: 'Customers',
      value: stats.customers?.toLocaleString() || 0,
      icon: 'account-group',
      color: colors.orange[500],
      bgColor: colors.orange[50],
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={[styles.card, { backgroundColor: card.bgColor }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
              <Icon name={card.icon} size={20} color={colors.white} />
            </View>
          </View>
          <Text style={styles.cardValue}>{card.value}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
});

export default StatsCards;