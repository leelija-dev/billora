import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
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
import { orderAPI } from '../../services/orderService'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import OrderForm from '../../components/features/Orders/OrderForm'
import OrderDetails from '../../components/features/Orders/OrderDetails'
import Select from '../../components/common/Select/Select'
import Modal from '../../components/common/Modal/Modal'
import { generateA4InvoiceHTML } from '../../templates/A4InvoiceTemplate'
import { generateThermalInvoiceHTML } from '../../templates/ThermalInvoiceTemplate'

const Orders = () => {
  const { user } = useAuthStore()
  const {
    orders,
    totalOrders,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderPayment,
    setFilters,
  } = useOrderStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('today')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [paidAmount, setPaidAmount] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    revenue: 0,
    revenueChange: 0
  })

  // Computed filtered orders based on current filters
  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders]
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(order => 
        (order.order_id && order.order_id.toString().toLowerCase().includes(searchLower)) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
        (order.customer_phone && order.customer_phone.toLowerCase().includes(searchLower)) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.order_status === filters.status)
    }
    
    // Apply payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => order.payment_status === filters.paymentStatus)
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(order => new Date(order.created_at) >= fromDate)
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(order => new Date(order.created_at) <= toDate)
    }
    
    return filtered
  }, [orders, filters])

  useEffect(() => {
    // Fetch orders with current user ID
    if (user?.id) {
      fetchOrders(1, user.id)
    }
  }, [user?.id])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (user?.id) {
        setFilters({ search: searchTerm }, user.id)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters, user?.id])

  useEffect(() => {
    if (filteredOrders.length > 0) {
      const pendingOrders = filteredOrders.filter(order => order.order_status === 'pending').length
      const processingOrders = filteredOrders.filter(order => order.order_status === 'processing').length
      const completedOrders = filteredOrders.filter(order => order.order_status === 'completed').length
      const totalRevenue = filteredOrders
        .filter(order => order.order_status === 'completed' && order.total_amount)
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)

      setStats({
        total: filteredOrders.length,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        revenue: totalRevenue,
        revenueChange: 0
      })
    } else {
      setStats({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        revenue: 0,
        revenueChange: 0
      })
    }
  }, [filteredOrders])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setShowEditForm(true)
  }

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      await fetchOrders(1, user.id) // Refresh orders with user ID
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    try {
      await updatePaymentStatus(orderId, newStatus)
      await fetchOrders(1, user.id) // Refresh orders with user ID
      toast.success('Payment status updated successfully')
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleViewPaymentDetails = async (order) => {
    try {
      const response = await orderAPI.getOrderPaymentDetails(order.id, user.id)
      setPaymentDetails(response.data)
      setSelectedOrder(order)
      setShowPaymentModal(true)
    } catch (error) {
      console.error('Error fetching payment details:', error)
      toast.error('Failed to fetch payment details')
    }
  }

  const handlePrintOrder = (order) => {
    setSelectedOrder(order)
    setShowPrintModal(true)
  }

  const handleUpdatePayment = async () => {
    if (!selectedOrder || !paidAmount) {
      toast.error('Please enter a payment amount')
      return
    }
    
    const amount = parseFloat(paidAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }
    
    if (amount > (paymentDetails?.remaining_due || 0)) {
      toast.error(`Payment amount cannot exceed remaining due of ₹${paymentDetails?.remaining_due?.toFixed(2)}`)
      return
    }
    
    setUpdatingStatus(true)
    try {
      const result = await updateOrderPayment(selectedOrder.id, user.id, amount)
      
      if (result.success) {
        // Close modal and reset form
        setShowPaymentModal(false)
        setSelectedOrder(null)
        setPaymentDetails(null)
        setPaidAmount('')
        
        // Refresh orders to show updated data
        await fetchOrders(1, user.id)
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      toast.error('Failed to update payment')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePrintInvoice = (order, printType) => {
    if (printType === 'a4') {
      const invoiceContent = generateA4InvoiceHTML(order)
      printInvoice(invoiceContent, 'a4')
    } else if (printType === 'thermal') {
      const receiptContent = generateThermalInvoiceHTML(order)
      printInvoice(receiptContent, 'thermal')
    } else {
      console.error('Invalid print type:', printType)
    }
  }

  const printInvoice = (content, type) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${type === 'a4' ? 'Invoice' : 'Receipt'}</title>
          <style>
            @media print {
              body { margin: 0; }
              ${type === 'a4' ? '@page { margin: 1cm; }' : '@page { size: 80mm auto; margin: 5mm; }'}
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handlePageChange = (page) => {
    fetchOrders(page, user.id)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders(1, user.id)
    setRefreshing(false)
  }

  const handleFormSuccess = () => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedOrder(null)
    fetchOrders(1, user.id)
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedOrder(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    if (user?.id) {
      setFilters({ search: '', status: '', paymentStatus: '', dateFrom: '', dateTo: '' }, user.id)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      ready_to_serve: 'primary',
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
      case 'ready_to_serve': return FiCheckCircle
      case 'completed': return FiCheckCircle
      case 'cancelled': return FiXCircle
      default: return FiClock
    }
  }

  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready_to_serve', label: 'Ready to Serve' },
    { value: 'completed', label: 'Completed' },
  ]

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
  ]

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
            onChange={() => {
              if (selectedOrders.length === filteredOrders.length) {
                setSelectedOrders([])
              } else {
                setSelectedOrders(filteredOrders.map(o => o.id))
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
      accessor: 'order_id',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            row.order_status === 'completed' ? 'bg-green-500' :
            row.order_status === 'processing' ? 'bg-blue-500' :
            row.order_status === 'pending' ? 'bg-yellow-500' :
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
      accessor: 'customer_name',
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {value?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.customer_phone}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'created_at',
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
      accessor: 'total_items',
      cell: (value) => (
        <div className="flex items-center">
          <FiShoppingBag className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (value) => (
        <div className="flex items-center">
          <span className="text-gray-400 mr-1">₹</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {parseFloat(value || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      header: 'Paid Amount',
      accessor: 'paid_amount',
      cell: (value) => (
        <div className="flex items-center">
          <span className="text-green-400 mr-1">₹</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {parseFloat(value || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      header: 'Due Amount',
      accessor: 'due_amount',
      cell: (value, row) => {
        const dueAmount = parseFloat(row.total_amount || 0) - parseFloat(row.paid_amount || 0)
        return (
          <div className="flex items-center">
            
            <span className={`font-semibold ${dueAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              ₹{dueAmount.toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'order_status',
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
      accessor: 'payment_status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={value === 'completed' ? 'success' : value === 'failed' ? 'danger' : 'warning'}
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
            onClick={() => handlePrintOrder(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Print Order"
          >
            <FiPrinter className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewOrder(row)}
            className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Order Details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
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
          {/* <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
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
          </div> */}

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
          {/* <motion.div
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
          </motion.div> */}
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
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={() => <span className="text-white">₹</span>}
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
                      selectedOrders.forEach(id => handleOrderStatusChange(id, e.target.value))
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
                    onChange={(e) => setFilters({ status: e.target.value }, user?.id)}
                  />
                  <Select
                    label="Payment Status"
                    options={[
                      { value: '', label: 'All' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'failed', label: 'Failed' },
                    ]}
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({ paymentStatus: e.target.value }, user?.id)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date From
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ dateFrom: e.target.value }, user?.id)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date To
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ dateTo: e.target.value }, user?.id)}
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
          data={filteredOrders}
          loading={loading}
        />
        <Pagination
        currentPage={currentPage}
        totalItems={filteredOrders.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      </motion.div>
      
      
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

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        title={`Order #${selectedOrder?.orderNumber || selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder}
            onUpdateOrder={handleOrderStatusChange}
            onUpdatePayment={handlePaymentStatusChange}
            onUpdateOrderPayment={updateOrderPayment}
            onPrintInvoice={handlePrintInvoice}
            user={user}
          />
        )}
      </Modal>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false)
          setSelectedOrder(null)
          setPaymentDetails(null)
          setPaidAmount('')
        }}
        title={`Payment Details - Order #${selectedOrder?.orderNumber || selectedOrder?.id}`}
        size="md"
      >
        {selectedOrder && paymentDetails && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Total:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{(selectedOrder.total_amount || paymentDetails.total_amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₹{(paymentDetails.total_paid || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Remaining Due:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    ₹{(paymentDetails.remaining_due || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {(paymentDetails.remaining_due || 0) > 0 ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Update Payment</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter payment amount"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      max={paymentDetails.remaining_due || 0}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum: ₹{(paymentDetails.remaining_due || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleUpdatePayment}
                      disabled={!paidAmount || parseFloat(paidAmount) <= 0 || updatingStatus}
                      className="flex-1"
                    >
                      {updatingStatus ? 'Processing...' : 'Update Payment'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPaymentModal(false)
                        setSelectedOrder(null)
                        setPaymentDetails(null)
                        setPaidAmount('')
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Fully Paid</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  This order has been fully paid. No further payments are required.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedOrder(null)
                    setPaymentDetails(null)
                    setPaidAmount('')
                  }}
                  className="mt-3"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Print Options Modal */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => {
          setShowPrintModal(false)
          setSelectedOrder(null)
        }}
        title={`Print Options - Order #${selectedOrder?.orderNumber || selectedOrder?.id}`}
        size="sm"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose print format for Order #{selectedOrder?.orderNumber || selectedOrder?.id}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  handlePrintInvoice(selectedOrder, 'a4')
                  setShowPrintModal(false)
                  setSelectedOrder(null)
                }}
                className="w-full"
                variant="primary"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                Print A4 Invoice
              </Button>
              
              <Button
                onClick={() => {
                  handlePrintInvoice(selectedOrder, 'thermal')
                  setShowPrintModal(false)
                  setSelectedOrder(null)
                }}
                className="w-full"
                variant="secondary"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                Print Thermal
              </Button>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPrintModal(false)
                  setSelectedOrder(null)
                }}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Orders