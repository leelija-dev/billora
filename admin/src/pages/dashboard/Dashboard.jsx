import React, { useEffect, useState, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiClock,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiArrowRight,
  FiAlertCircle,
  FiPrinter,
  FiFileText,
  FiFile
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { dashboardAPI } from '../../services'
import OrderStatusChart from '../../components/charts/OrderStatusChart'
import RevenueChart from '../../components/charts/RevenueChart'
import TopProductsChart from '../../components/charts/TopProductsChart'
import { FaFile } from 'react-icons/fa'
import { 
  handlePDFExport, 
  handleWordExport, 
  handleExcelExport, 
  handlePrint 
} from '../../utils/exportHandlers'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { company, user } = useAuthStore()
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
  const [salesDistribution, setSalesDistribution] = useState([])
  const [orderStatus, setOrderStatus] = useState({})
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  const dashboardRef = useRef(null)
  const exportDropdownRef = useRef(null)

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange, user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        console.warn('User not authenticated, skipping dashboard data fetch')
        setLoading(false)
        return
      }

      const response = await dashboardAPI.getOverview(user.id)
      const data = response.data
      const normalizedStats = {
        revenue: parseFloat(data?.stats?.totalRevenue || 0),
        orders: parseInt(data?.stats?.totalOrders || 0),
        products: parseInt(data?.stats?.totalProducts || 0),
        customers: parseInt(data?.stats?.totalCustomers || 0),
        lowStock: parseInt(data?.stats?.lowStock || 0),
        revenueChange: data?.stats?.revenueTrend ?? null,
        ordersChange: data?.stats?.ordersTrend ?? null,
        productsChange: data?.stats?.productsTrend ?? null,
        customersChange: data?.stats?.customersTrend ?? null,
      }

      const processedRevenueData = (data?.revenueData?.daily || []).map(item => ({
        date: item.date || '',
        revenue: parseFloat(item.revenue || 0)
      }))

      const processedTopProducts = (data?.topProducts || []).map(item => ({
        id: item.id,
        name: item.name || '',
        sales: parseFloat(item.sales || 0),
        revenue: parseFloat(item.revenue || 0),
        trend: item.trend || '+0%'
      }))

      const processedRecentOrders = (data?.recentOrders || []).map(item => ({
        ...item,
        total: parseFloat(item.total || 0)
      }))

      setStats(normalizedStats)
      setRevenueData(processedRevenueData)
      setRecentOrders(processedRecentOrders)
      setSalesDistribution(data?.salesDistribution || [])
      setOrderStatus(data?.orderStatus || {})
      setTopProducts(processedTopProducts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setRevenueData([])
      setRecentOrders([])
      setSalesDistribution([])
      setOrderStatus({})
      setTopProducts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  const exportData = {
    stats,
    revenueData,
    topProducts,
    recentOrders,
    company,
    timeRange
  }

  const exportCallbacks = {
    setExporting,
    setShowExportDropdown,
    setIsPrinting
  }

  const StatCard = ({ title, value, icon: Icon, change, color, delay }) => {
    const isPositive = change > 0
    const isNeutral = change === 0
    const TrendIcon = isNeutral ? FiMinus : (isPositive ? FiTrendingUp : FiTrendingDown)

    const formatValue = (val, title) => {
      if (title.includes('Revenue')) {
        const num = parseFloat(val)
        if (isNaN(num) || num === 0) {
          return 'Rs 0'
        }
        if (num >= 100000) {
          return `Rs ${(num / 100000).toFixed(1)}L`
        } else if (num >= 1000) {
          return `Rs ${(num / 1000).toFixed(1)}k`
        } else {
          return `Rs ${num.toLocaleString('en-IN')}`
        }
      }
      return val
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
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
                className="text-3xl font-bold text-gray-900 dark:text-white mt-2 break-all"
              >
                {formatValue(value, title)}
              </motion.p>
              
              {change !== null && change !== undefined && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center mt-3 space-x-1"
                >
                  {!isNeutral && (
                    <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                  <span className={`text-sm font-medium ${
                    isNeutral ? 'text-gray-500' : (isPositive ? 'text-green-600' : 'text-red-600')
                  }`}>
                    {isNeutral ? 'No change' : `${Math.abs(change)}%`}
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
    <div ref={dashboardRef}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6"
      >
        {/* Welcome Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome back, {company?.name || 'User'}!
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

            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={exporting}
                className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className={`w-4 h-4 ${exporting ? 'animate-pulse' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export'}</span>
              </motion.button>

              <AnimatePresence>
                {showExportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => handlePDFExport(exportData, exportCallbacks)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                    >
                      <FaFile className="w-4 h-4 text-red-500" />
                      <div className="flex-1">
                        <span>Export as PDF</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Professional report format</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExcelExport(exportData, exportCallbacks)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <FiFileText className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <span>Export as Excel</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet with multiple sheets</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleWordExport(exportData, exportCallbacks)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <FiFile className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <span>Export as DOC</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Editable document format</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Print Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePrint(exportData, exportCallbacks)}
              disabled={isPrinting}
              className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg shadow-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPrinter className="w-4 h-4" />
              <span>{isPrinting ? 'Printing...' : 'Print'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats.revenue || 0}
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
            
            <RevenueChart data={revenueData} height={320} />
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Order Status
            </h3>
            
            <OrderStatusChart data={orderStatus} height={256} />
          </motion.div>
        </div>

        {/* Top Products Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Best performing products</span>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiMoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <TopProductsChart data={topProducts} height={320} />
        </motion.div>

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
              <Link to="/orders" className="flex items-center space-x-2">
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                   
                
                <span>View all orders</span>
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
              </Link>
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
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                          {order.customer?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                          {order.customer?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Rs {parseFloat(order.total || 0).toLocaleString('en-IN')}
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
                        {new Date(order.createdAt).toLocaleDateString()}
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
    </div>
  )
}

export default Dashboard