import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

const Dashboard = () => {
  const { company } = useAuthStore()
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
    revenueChange: null,
    ordersChange: null,
    productsChange: null,
    customersChange: null,
  })
  const [revenueData, setRevenueData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, revenueRes, ordersRes] = await Promise.all([
        api.get('/dashboard/stats/'),
        api.get('/dashboard/revenue/', { params: { range: timeRange } }),
        api.get('/dashboard/recent-orders/'),
      ])

      const rawStats = statsRes.data
      const normalizedStats = {
        revenue: rawStats?.revenue?.total ?? rawStats?.revenue ?? 0,
        orders: rawStats?.orders?.total ?? rawStats?.orders ?? 0,
        products: rawStats?.products?.total ?? rawStats?.products ?? 0,
        customers: rawStats?.customers?.total ?? rawStats?.customers ?? 0,
        lowStock: rawStats?.products?.lowStock ?? rawStats?.lowStock ?? 0,
        revenueChange: rawStats?.revenue?.change ?? null,
        ordersChange: rawStats?.orders?.change ?? null,
        productsChange: rawStats?.products?.change ?? null,
        customersChange: rawStats?.customers?.change ?? null,
      }

      setStats(normalizedStats)
      setRevenueData(revenueRes.data)
      setRecentOrders(ordersRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  const StatCard = ({ title, value, icon: Icon, change, color, delay }) => {
    const isPositive = change > 0
    const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        {/* Gradient top bar */}
        <div className={`h-1.5 bg-gradient-to-r ${color}`} />

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {title}
              </p>
              <motion.p 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mt-2"
              >
                {value}
              </motion.p>
              
              {change !== null && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center mt-3 space-x-1"
                >
                  <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Welcome Section with Enhanced Design */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome back, {company?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiClock className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <motion.select 
            whileHover={{ scale: 1.02 }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-transparent outline-none shadow-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="12m">Last 12 months</option>
          </motion.select>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg shadow-primary-500/30"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${Number(stats.revenue || 0).toLocaleString()}`}
          icon={FiDollarSign}
          change={stats.revenueChange}
          color="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <StatCard
          title="Total Orders"
          value={Number(stats.orders || 0).toLocaleString()}
          icon={FiShoppingBag}
          change={stats.ordersChange}
          color="from-blue-500 to-cyan-500"
          delay={0.2}
        />
        <StatCard
          title="Products"
          value={Number(stats.products || 0).toLocaleString()}
          icon={FiPackage}
          change={stats.productsChange}
          color="from-purple-500 to-pink-500"
          delay={0.3}
        />
        <StatCard
          title="Customers"
          value={Number(stats.customers || 0).toLocaleString()}
          icon={FiUsers}
          change={stats.customersChange}
          color="from-orange-500 to-red-500"
          delay={0.4}
        />
      </div>

      {/* Low Stock Alert */}
      <AnimatePresence>
        {stats.lowStock > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                    Low Stock Alert!
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    You have <span className="font-bold">{stats.lowStock}</span> products that are running low on stock. 
                    Review them to avoid stockouts.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-600"
              >
                <span>View products</span>
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">vs previous period</span>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiMoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 8, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sales Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Sales Distribution
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Electronics', value: 400 },
                    { name: 'Clothing', value: 300 },
                    { name: 'Books', value: 200 },
                    { name: 'Home', value: 150 },
                    { name: 'Sports', value: 100 },
                    { name: 'Other', value: 50 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[0,1,2,3,4,5].map((index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'].map((item, index) => (
              <div key={item} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You have {recentOrders.length} orders this period
              </p>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <span>View all orders</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date', ''].map((header) => (
                  <th 
                    key={header}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.02)' }}
                  className="group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                        {order.customer?.charAt(0) || 'U'}
                      </div>
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        {order.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${order.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                        : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="w-3 h-3 mr-2" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <FiMoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {recentOrders.length} of {recentOrders.length} results
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard