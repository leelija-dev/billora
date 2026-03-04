import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { dashboardAPI } from '../../services/api';
import Card from '../../components/common/Card/Card';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = ({ navigation }) => {
  const { company } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, revenueRes, ordersRes] = await Promise.all([
        dashboardAPI.stats(),
        dashboardAPI.revenue({ period: 'week' }),
        dashboardAPI.recentOrders(),
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
      setRecentOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        {change !== undefined && (
          <View style={styles.statChange}>
            <Icon
              name={change >= 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={change >= 0 ? colors.success[500] : colors.danger[500]}
            />
            <Text
              style={[
                styles.statChangeText,
                { color: change >= 0 ? colors.success[500] : colors.danger[500] },
              ]}
            >
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.companyName}>{company?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="account-circle" size={32} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Revenue"
          value={`$${stats.revenue?.toLocaleString() || 0}`}
          icon="cash"
          color={colors.green[500]}
          change={12.5}
        />
        <StatCard
          title="Orders"
          value={stats.orders?.toLocaleString() || 0}
          icon="shopping"
          color={colors.blue[500]}
          change={8.2}
        />
        <StatCard
          title="Products"
          value={stats.products?.toLocaleString() || 0}
          icon="package"
          color={colors.purple[500]}
          change={-3.1}
        />
        <StatCard
          title="Customers"
          value={stats.customers?.toLocaleString() || 0}
          icon="account-group"
          color={colors.orange[500]}
          change={15.3}
        />
      </View>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <Card style={styles.alertCard}>
          <View style={styles.alertContent}>
            <Icon name="alert" size={24} color={colors.warning[500]} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>Low Stock Alert!</Text>
              <Text style={styles.alertDescription}>
                {stats.lowStock} products are running low on stock.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate('Inventory')}
            >
              <Text style={styles.alertButtonText}>View</Text>
              <Icon name="arrow-right" size={16} color={colors.warning[500]} />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Revenue Chart */}
      <Card style={styles.chartCard}>
        <Card.Header>
          <Text style={styles.chartTitle}>Revenue Overview</Text>
        </Card.Header>
        <Card.Body>
          <View style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={colors.primary[500]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </View>
        </Card.Body>
      </Card>

      {/* Recent Orders */}
      <Card style={styles.ordersCard}>
        <Card.Header>
          <Text style={styles.ordersTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </Card.Header>
        <Card.Body>
          {recentOrders.map((order, index) => (
            <TouchableOpacity
              key={index}
              style={styles.orderItem}
              onPress={() => navigation.navigate('Orders', { orderId: order.id })}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.orderNumber}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.orderMeta}>
                <Text style={styles.orderAmount}>${order.amount}</Text>
                <StatusBadge status={order.status} size="sm" />
              </View>
            </TouchableOpacity>
          ))}
        </Card.Body>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  greeting: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
  },
  companyName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  profileButton: {
    padding: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  statCard: {
    width: '50%',
    padding: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: typography.sizes.xs,
    marginLeft: 2,
    fontWeight: typography.weights.medium,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  statTitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  alertCard: {
    margin: spacing.md,
    backgroundColor: colors.warning[50],
    borderColor: colors.warning[200],
    borderWidth: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  alertText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  alertTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.warning[700],
  },
  alertDescription: {
    fontSize: typography.sizes.sm,
    color: colors.warning[600],
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.warning[600],
    marginRight: 4,
  },
  chartCard: {
    margin: spacing.md,
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  chartContainer: {
    height: 200,
  },
  ordersCard: {
    margin: spacing.md,
  },
  ordersTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  orderCustomer: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginBottom: 4,
  },
});

export default Dashboard;