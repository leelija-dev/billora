import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../../hooks/useApi';
import { dashboardAPI } from '../../api';
import { useUIStore } from '../../store/uiStore';
import Header from '../../components/common/Header';
import StatsCard from '../../components/dashboard/StatsCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentOrders from '../../components/dashboard/RecentOrders';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { theme } from '../../theme';
import { formatCurrency } from '../../utils/helpers';

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useUIStore();

  // Fetch dashboard overview
  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    execute: fetchOverview,
  } = useApi(dashboardAPI.getOverview);

  // Fetch revenue stats
  const {
    data: revenueData,
    loading: revenueLoading,
    execute: fetchRevenueStats,
  } = useApi(() => dashboardAPI.getRevenueStats({ period: 'month' }));

  // Fetch recent orders
  const {
    data: recentOrders,
    loading: ordersLoading,
    execute: fetchRecentOrders,
  } = useApi(() => dashboardAPI.getRecentOrders({ limit: 5 }));

  useEffect(() => {
    fetchOverview();
    fetchRevenueStats();
    fetchRecentOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchOverview(),
        fetchRevenueStats(),
        fetchRecentOrders(),
      ]);
      showSuccess('Dashboard refreshed');
    } catch (error) {
      showError('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const isLoading = overviewLoading || revenueLoading || ordersLoading;

  if (isLoading && !overview) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <Loading text="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  if (overviewError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <ErrorState
          title="Failed to Load Dashboard"
          description="Unable to load dashboard data. Please check your connection and try again."
          onRetry={fetchOverview}
        />
      </SafeAreaView>
    );
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(overview?.totalRevenue || 0),
      subtitle: 'This month',
      icon: '💰',
      color: theme.colors.success,
      trend: overview?.revenueTrend,
    },
    {
      title: 'Total Orders',
      value: overview?.totalOrders?.toString() || '0',
      subtitle: 'This month',
      icon: '📋',
      color: theme.colors.primary,
      trend: overview?.ordersTrend,
    },
    {
      title: 'Customers',
      value: overview?.totalCustomers?.toString() || '0',
      subtitle: 'Total',
      icon: '👥',
      color: theme.colors.info,
      trend: overview?.customersTrend,
    },
    {
      title: 'Products',
      value: overview?.totalProducts?.toString() || '0',
      subtitle: 'In catalog',
      icon: '📦',
      color: theme.colors.warning,
      trend: overview?.productsTrend,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statsCards.map((stat, index) => (
            <View key={index} style={styles.statsCard}>
              <StatsCard {...stat} />
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <RevenueChart
            data={revenueData?.data || []}
            title="Revenue Trend"
            period="month"
          />
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersContainer}>
          <RecentOrders
            orders={recentOrders?.data || []}
            loading={ordersLoading}
            onRefresh={fetchRecentOrders}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
  },
  chartContainer: {
    marginBottom: theme.spacing.lg,
  },
  ordersContainer: {
    flex: 1,
  },
});

export default DashboardScreen;
