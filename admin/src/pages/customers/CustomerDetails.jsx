import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,

  FiEdit2,
  FiTrash2,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiAlertCircle,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi'
import { customerAPI } from '../../services/customerService'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import CustomerForm from '../../components/features/Customers/CustomerForm'
import toast from 'react-hot-toast'
import { FaRupeeSign } from 'react-icons/fa'

// Cache for customer details
const customerDetailsCache = new Map()
const paymentHistoryCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cache, key) => {
  const entry = cache.get(key)
  if (isCacheValid(entry)) {
    return entry.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (cache, key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

const CustomerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  
  // Refs to track previous values
  const prevIdRef = useRef(null)
  const prevFiltersRef = useRef(filters)

  // Fetch customer details and payment history
  const fetchCustomerDetails = async () => {
    console.log('🔍 CustomerDetails - Fetching customer details for ID:', id)
    
    try {
      setLoading(true)
      
      // Always fetch customer details
      const customerResponse = await customerAPI.getById(id)
      const customerData = customerResponse.data?.data || customerResponse.data
      
      // Fetch payment history with date filters if provided
      let paymentHistoryData = []
      if (filters.start_date || filters.end_date) {
        console.log('🔍 CustomerDetails - Fetching filtered payment history')
        const paymentResponse = await customerAPI.getPaymentHistory(id, filters.start_date, filters.end_date)
        
        // Handle different response structures
        if (paymentResponse?.data?.bill_payment_history && Array.isArray(paymentResponse.data.bill_payment_history)) {
          paymentHistoryData = paymentResponse.data.bill_payment_history
        } else if (paymentResponse?.data?.data && Array.isArray(paymentResponse.data.data)) {
          paymentHistoryData = paymentResponse.data.data
        } else if (Array.isArray(paymentResponse?.data)) {
          paymentHistoryData = paymentResponse.data
        }
      } else {
        // Use payment history from customer response when no filters
        paymentHistoryData = customerResponse.data?.bill_payment_history || []
      }
      
      console.log('🔍 CustomerDetails - Customer data received:', customerData)
      console.log('🔍 CustomerDetails - Payment history received:', paymentHistoryData)
      
      // Set state
      setCustomer(customerData)
      setPaymentHistory(paymentHistoryData)
      
    } catch (error) {
      console.error('❌ CustomerDetails - Failed to fetch customer details:', error)
      toast.error('Failed to load customer details')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when ID or filters change
  useEffect(() => {
    if (id !== prevIdRef.current) {
      prevIdRef.current = id
      fetchCustomerDetails()
    }
  }, [id])

  // Fetch data when filters change
  useEffect(() => {
    const currentFilters = JSON.stringify(filters)
    const prevFilters = JSON.stringify(prevFiltersRef.current)
    
    if (currentFilters !== prevFilters) {
      prevFiltersRef.current = { ...filters }
      fetchCustomerDetails()
    }
  }, [filters.start_date, filters.end_date])

  
  const handleEditCustomer = async (customerData) => {
    try {
      setFormSubmitting(true)
      await customerAPI.update(id, customerData)
      // Refresh customer data
      const response = await customerAPI.getById(id)
      setCustomer(response.data?.data || response.data)
      setShowEditForm(false)
      toast.success('Customer updated successfully!')
      // Clear cache
      customerDetailsCache.clear()
    } catch (error) {
      console.error('Failed to update customer:', error)
      toast.error(error.response?.data?.message || 'Failed to update customer')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Validate payment amount
  const validatePaymentAmount = (amount) => {
    if (!amount || amount === "") {
      return "Payment amount is required"
    }
    
    const numAmount = parseFloat(amount)
    const dueAmount = parseFloat(customer?.due_amount || 0)
    
    if (isNaN(numAmount)) {
      return "Please enter a valid number"
    }
    
    if (numAmount <= 0) {
      return "Payment amount must be greater than zero"
    }
    
    if (numAmount > dueAmount) {
      return `Payment amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`
    }
    
    return ""
  }

  // Handle payment amount change
  const handlePaymentAmountChange = (e) => {
    let value = e.target.value
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, "")
    
    // Ensure only one decimal point
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2)
    }
    
    setPaymentAmount(value)
    
    // Validate on change
    const error = validatePaymentAmount(value)
    setPaymentError(error)
  }

  const handlePayment = async () => {
    const error = validatePaymentAmount(paymentAmount)
    if (error) {
      setPaymentError(error)
      toast.error(error)
      return
    }

    const amount = parseFloat(paymentAmount)
    const dueAmount = parseFloat(customer?.due_amount || 0)
    
    if (amount > dueAmount) {
      const errorMsg = `Payment amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`
      setPaymentError(errorMsg)
      toast.error(errorMsg)
      return
    }

    try {
      setFormSubmitting(true)
      await customerAPI.makeDuePayment(id, { due_payment: paymentAmount })
      
      // Clear cache to force fresh data fetch
      customerDetailsCache.clear()
      
      // Refresh customer data (includes updated payment history)
      const response = await customerAPI.getById(id)
      const customerData = response.data?.data || response.data
      const paymentHistoryData = response.data?.bill_payment_history || []
      
      setCustomer(customerData)
      setPaymentHistory(paymentHistoryData)
      
      setShowPaymentForm(false)
      setPaymentAmount('')
      setPaymentError('')
      toast.success(`Payment of ₹${parseFloat(paymentAmount).toFixed(2)} processed successfully!`)
    } catch (error) {
      console.error('Failed to process payment:', error)
      toast.error(error.response?.data?.message || 'Failed to process payment')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await customerAPI.delete(id)
      toast.success('Customer deleted successfully!')
      navigate('/customers')
    } catch (error) {
      console.error('Failed to delete customer:', error)
      toast.error(error.response?.data?.message || 'Failed to delete customer')
    }
  }

  const clearFilters = () => {
    setFilters({ start_date: '', end_date: '' })
    toast.success('Filters cleared!')
  }

  const handleRefresh = async () => {
    // Clear cache to force fresh data fetch
    customerDetailsCache.clear()
    
    // Fetch customer details (includes payment history)
    await fetchCustomerDetails()
    toast.success('Data refreshed successfully!')
  }

  const handleExport = () => {
    if (paymentHistory.length === 0) {
      toast.error('No payment history to export')
      return
    }
    // Export logic here
    toast.success('Export started!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <EmptyState
          title="Customer not found"
          description="The customer you're looking for doesn't exist or has been deleted."
          action={
            <Button onClick={() => navigate('/customers')} icon={FiArrowLeft}>
              Back to Customers
            </Button>
          }
        />
      </div>
    )
  }

  const paymentColumns = [
    {
      header: 'Date',
      accessor: 'created_at',
      cell: (value) => new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    {
      header: 'Invoice ID',
      accessor: 'invoice_id',
      cell: (value) => value ? `#${value}` : 'N/A'
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
    },
    {
      header: 'Paid Amount',
      accessor: 'paid_amount',
      cell: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
    },
    {
      header: 'Due Amount',
      accessor: 'due_amount',
      cell: (value) => {
        const dueAmount = parseFloat(value || 0)
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            dueAmount <= 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            ₹{dueAmount.toFixed(2)}
          </span>
        )
      }
    },
    {
      header: 'Payment Method',
      accessor: 'payment_method',
      cell: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {value || 'N/A'}
        </span>
      )
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      cell: (value) => value || '-'
    }
  ]

  // Calculate statistics
  const totalPaid = paymentHistory.reduce((sum, payment) => sum + parseFloat(payment.paid_amount || 0), 0)
  const totalPurchases = paymentHistory.reduce((sum, payment) => sum + parseFloat(payment.total_amount || 0), 0)
  const averagePayment = paymentHistory.length > 0 ? totalPaid / paymentHistory.length : 0

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-4 h-4 text-white" />
          </motion.div>
        </div>
        <motion.p
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {value}
        </motion.p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => navigate('/customers')}
                icon={FiArrowLeft}
                size="sm"
                className="shadow-md"
              >
                Back
              </Button>
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Customer Details
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View and manage customer information
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(true)}
                icon={FiEdit2}
                size="sm"
              >
                Edit
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowPaymentForm(true)}
                icon={FiCreditCard}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Pay Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                icon={FiTrash2}
                size="sm"
              >
                Delete
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Customer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{customer.name}</h2>
                  <p className="text-white/80 text-sm">Customer since {new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <StatusBadge
                status={customer.status || 'active'}
                variant={customer.status === 'active' ? 'success' : 'default'}
                size="lg"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start space-x-3">
                <FiMail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                    {customer.email || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiPhone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.address}
                    {customer.city && `, ${customer.city}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaRupeeSign className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Due Amount</p>
                  <p className={`text-sm font-bold ${parseFloat(customer.due_amount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{parseFloat(customer.due_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Purchases"
            value={`₹${totalPurchases.toFixed(2)}`}
            icon={FiShoppingBag}
            color="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatCard
            title="Total Paid"
            value={`₹${totalPaid.toFixed(2)}`}
            icon={FiCreditCard}
            color="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <StatCard
            title="Average Payment"
            value={`₹${averagePayment.toFixed(2)}`}
            icon={FiTrendingUp}
            color="from-indigo-500 to-purple-500"
            delay={0.3}
          />
          <StatCard
            title="Total Transactions"
            value={paymentHistory.length}
            icon={FiClock}
            color="from-orange-500 to-red-500"
            subtitle="payment records"
            delay={0.4}
          />
        </div>

        {/* Payment History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Complete transaction history with payment details
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 rounded-xl border transition-colors flex items-center space-x-2 text-sm ${
                    showFilters
                      ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filters</span>
                  {(filters.start_date || filters.end_date) && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm"
                >
                  <FiRefreshCw className={`w-4 h-4 ${paymentLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </motion.button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={filters.start_date}
                          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={filters.end_date}
                          onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          icon={FiX}
                          className="px-4"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {paymentLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
              />
            </div>
          ) : paymentHistory.length === 0 ? (
            <EmptyState
              title="No payment history"
              description="No payments have been recorded for this customer yet."
              icon={FaRupeeSign }
              action={
                <Button onClick={() => setShowPaymentForm(true)} icon={FiCreditCard} size="sm">
                  Make First Payment
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={paymentColumns}
                data={paymentHistory}
                loading={paymentLoading}
                className="min-w-[800px]"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Edit Customer
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Update customer information
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditForm(false)}
                      icon={FiX}
                    />
                  </motion.div>
                </div>
              </div>
              
              <div className="p-6">
                <CustomerForm
                  mode="edit"
                  initialData={customer}
                  onSubmit={handleEditCustomer}
                  onCancel={() => setShowEditForm(false)}
                  isSubmitting={formSubmitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowPaymentForm(false)
              setPaymentError('')
              setPaymentAmount('')
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <FiCreditCard className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Make Payment
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-4"
                  >
                    Customer: <span className="font-semibold text-gray-900 dark:text-white">{customer.name}</span>
                  </motion.p>
                  
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Due Amount</span>
                      <span className={`text-xl font-bold ${parseFloat(customer.due_amount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{parseFloat(customer.due_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="text-left">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                          ₹
                        </span>
                        <input
                          type="text"
                          value={paymentAmount}
                          onChange={handlePaymentAmountChange}
                          placeholder="Enter amount"
                          className={`w-full pl-8 pr-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                            paymentError
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          disabled={formSubmitting}
                          autoFocus
                        />
                      </div>
                      {paymentError && (
                        <div className="flex items-center space-x-1 mt-2">
                          <FiAlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-red-500 text-sm">{paymentError}</p>
                        </div>
                      )}
                      {!paymentError && paymentAmount && parseFloat(paymentAmount) > 0 && (
                        <p className="text-xs text-green-500 mt-2">
                          ✓ Valid payment amount
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Maximum: ₹{parseFloat(customer.due_amount || 0).toFixed(2)}
                        </p>
                        {parseFloat(customer.due_amount || 0) > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const maxAmount = parseFloat(customer.due_amount || 0)
                              setPaymentAmount(maxAmount.toString())
                              setPaymentError("")
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                          >
                            Pay Full Amount
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPaymentForm(false)
                          setPaymentError('')
                          setPaymentAmount('')
                        }}
                        disabled={formSubmitting}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={
                          !paymentAmount || 
                          parseFloat(paymentAmount) <= 0 || 
                          parseFloat(paymentAmount) > parseFloat(customer.due_amount || 0) ||
                          formSubmitting
                        }
                        loading={formSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {formSubmitting ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <FiTrash2 className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Delete Customer
                </motion.h3>
                
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{customer.name}</span>? 
                  This action cannot be undone.
                </motion.p>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CustomerDetails