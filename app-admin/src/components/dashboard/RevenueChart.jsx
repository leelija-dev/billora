import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../../theme';
import { formatCurrency } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

const RevenueChart = ({
  data = [],
  title = 'Revenue Trend',
  period = 'month',
  style,
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    const labels = data.map(item => {
      switch (period) {
        case 'day':
          return item.date.split('-')[2];
        case 'week':
          return `W${item.week}`;
        case 'month':
          return item.date.split('-')[1] + '/' + item.date.split('-')[0];
        case 'year':
          return item.date;
        default:
          return item.date;
      }
    });

    const values = data.map(item => item.revenue || 0);

    return {
      labels,
      datasets: [{ data: values }],
    };
  }, [data, period]);

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.borderLight,
      strokeWidth: 1,
    },
  };

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{formatCurrency(averageRevenue)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - theme.spacing.lg * 2}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
          segments={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: theme.borderRadius.md,
  },
});

export default RevenueChart;
