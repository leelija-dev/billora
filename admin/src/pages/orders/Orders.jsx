import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical,
  FiPrinter,
  FiMail,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore } from '../../store/orderStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import OrderForm from '../../components/features/Orders/OrderForm'
import OrderDetails from '../../components/features/Orders/OrderDetails'
import Select from '../../components/common/Select/Select'
import Modal from '../../components/common/Modal/Modal'

const Orders = () => {
  const {
    orders,
    totalOrders,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchOrders,
    updateOrderStatus,
    setFilters,
  } = useOrderStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('today')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [stats, setStats] = useState({
    total: 156,
    pending: 23,
    processing: 45,
    completed: 88,
    revenue: 45678,
    revenueChange: 12
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setShowEditForm(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
  }

  const handlePageChange = (page) => {
    fetchOrders(page)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const handleFormSuccess = () => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedOrder(null)
    fetchOrders() // Refresh the data
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedOrder(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', status: '', paymentStatus: '', dateFrom: '', dateTo: '' })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger',
      refunded: 'default',
    }
    return colors[status] || 'default'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return FiClock
      case 'processing': return FiRefreshCw
      case 'completed': return FiCheckCircle
      case 'cancelled': return FiXCircle
      default: return FiClock
    }
  }

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedOrders.length === orders.length && orders.length > 0}
            onChange={() => {
              if (selectedOrders.length === orders.length) {
                setSelectedOrders([])
              } else {
                setSelectedOrders(orders.map(o => o.id))
              }
            }}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(row.id)}
          onChange={() => {
            setSelectedOrders(prev =>
              prev.includes(row.id)
                ? prev.filter(id => id !== row.id)
                : [...prev, row.id]
            )
          }}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Order ID',
      accessor: 'orderNumber',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            row.status === 'completed' ? 'bg-green-500' :
            row.status === 'processing' ? 'bg-blue-500' :
            row.status === 'pending' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`} />
          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            #{value}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {value.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{value.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <FiCalendar className="w-3 h-3 mr-1 text-gray-400" />
          {new Date(value).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      cell: (value) => (
        <div className="flex items-center">
          <FiShoppingBag className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{value.length}</span>
        </div>
      ),
    },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => (
        <div className="flex items-center">
          <FiDollarSign className="w-3 h-3 mr-1 text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {value.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const Icon = getStatusIcon(value)
        return (
          <StatusBadge
            status={value}
            variant={getStatusColor(value)}
            icon={Icon}
          />
        )
      },
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={value === 'paid' ? 'success' : value === 'refunded' ? 'default' : 'warning'}
          size="sm"
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewOrder(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditOrder(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Edit Order"
          >
            <FiEdit className="w-4 h-4" />
          </motion.button>
          
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiMoreVertical className="w-4 h-4" />
            </motion.button>
            
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-1">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiPrinter className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiMail className="w-4 h-4" />
                  <span>Email Customer</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2">
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const StatCard = ({ title, value, icon: Icon, color, change, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {change && (
          <p className="text-xs text-green-600 mt-3 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
            +{change}% from last month
          </p>
        )}
      </div>
    </motion.div>
  )

  // Render Create Order Form
  const renderCreateOrderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelForm}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Order
            </h2>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <OrderForm 
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      </div>
    </motion.div>
  )

  // Render Edit Order Form
  const renderEditOrderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelForm}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Order #{selectedOrder?.orderNumber}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customer: {selectedOrder?.customer?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <OrderForm 
          order={selectedOrder}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
          isEdit={true}
        />
      </div>
    </motion.div>
  )

  // Render Main Orders View
  const renderOrdersView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiShoppingBag className="w-4 h-4 mr-2" />
            Manage and track customer orders
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['today', 'week', 'month', 'custom'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  dateRange === range
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </div>

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
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>

          {/* Create Order Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowCreateForm(true)}
              icon={FiPlus}
              className="shadow-lg shadow-primary-500/30"
            >
              Create Order
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={FiShoppingBag}
          color="from-blue-500 to-cyan-500"
          change={12}
          delay={0.1}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={FiDollarSign}
          color="from-green-500 to-emerald-500"
          change={8}
          delay={0.2}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          color="from-yellow-500 to-orange-500"
          delay={0.3}
        />
        <StatCard
          title="Processing"
          value={stats.processing}
          icon={FiRefreshCw}
          color="from-blue-500 to-indigo-500"
          delay={0.4}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          color="from-green-500 to-teal-500"
          delay={0.5}
        />
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedOrders.length} orders selected
                </span>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      selectedOrders.forEach(id => handleStatusChange(id, e.target.value))
                    }
                  }}
                  options={[
                    { value: '', label: 'Bulk Actions' },
                    { value: 'processing', label: 'Mark as Processing' },
                    { value: 'completed', label: 'Mark as Completed' },
                    { value: 'cancelled', label: 'Mark as Cancelled' },
                  ]}
                  className="w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle bulk delete */}}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${
                showFilters 
                  ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
              {(filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo) && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>

            {(searchTerm || filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo) && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearFilters}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    label="Order Status"
                    options={[
                      { value: '', label: 'All Status' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                  />
                  <Select
                    label="Payment Status"
                    options={[
                      { value: '', label: 'All' },
                      { value: 'paid', label: 'Paid' },
                      { value: 'unpaid', label: 'Unpaid' },
                      { value: 'refunded', label: 'Refunded' },
                    ]}
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({ paymentStatus: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date From
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ dateFrom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date To
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ dateTo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <Table
          columns={columns}
          data={orders}
          loading={loading}
        />
      </motion.div>
      
      <Pagination
        currentPage={currentPage}
        totalItems={totalOrders}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </motion.div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <AnimatePresence mode="wait">
        {showCreateForm ? (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {renderCreateOrderForm()}
          </motion.div>
        ) : showEditForm ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {renderEditOrderForm()}
          </motion.div>
        ) : (
          <motion.div
            key="orders-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderOrdersView()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal (always renders but conditionally shown) */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        title={`Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <OrderDetails order={selectedOrder} />
        )}
      </Modal>
    </motion.div>
  )
}

export default Orders