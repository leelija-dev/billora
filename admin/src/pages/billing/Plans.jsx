import React, { useEffect, useMemo, useState } from 'react'
import { 
  FiCreditCard, 
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiDownload,
  FiMail,
  FiX,
  FiUsers,
  FiDatabase,
  FiCpu,
  FiShoppingCart,
  FiPackage
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { plansAPI, invoiceAPI, dashboardAPI, billingAPI } from '../../services'
import { usePermissionStore } from '../../store/permissionStore'
import SubscriptionCard from '../../components/features/Billing/SubscriptionCard'
import PaymentHistory from '../../components/features/Billing/PaymentHistory'
import SubscriptionForm from '../../components/features/Billing/SubscriptionForm'
import Select from '../../components/common/Select/Select'
import Pagination from '../../components/common/Pagination/Pagination'
import Button from '../../components/common/Button/Button'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Input from '../../components/common/Input/Input'
import ProtectedRoute from '../../components/features/Auth/ProtectedRoute'

const Billing = () => {
  const { canAccess, user, permissions } = usePermissionStore()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showChangePlanForm, setShowChangePlanForm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [payments, setPayments] = useState([])
  const [paymentsCount, setPaymentsCount] = useState(0)
  const [invoices, setInvoices] = useState([])
  const [invoicesCount, setInvoicesCount] = useState(0)
  const [dashboardData, setDashboardData] = useState(null)

  const [paymentStatus, setPaymentStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [invoicePage, setInvoicePage] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [purchaseData, setPurchaseData] = useState({
    plan_id: '',
    customer_id: '',
    amount: 0
  })
  
  const pageSize = 10

  // Check if user has billing access
  const hasBillingAccess = canAccess('billing')

  const currentPlan = useMemo(() => {
    if (!subscription?.plan) return null
    return plans.find((p) => p.id === subscription.plan) || null
  }, [plans, subscription?.plan])

  // Get user ID from user object or localStorage
  const getUserId = () => {
    return user?.id || localStorage.getItem('user_id') || localStorage.getItem('userId') || 1
  }

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const userId = getUserId()
      
      // Fetch plans using new API
      const plansRes = await plansAPI.getAll().catch(err => {
        console.warn('Failed to fetch plans:', err)
        return { data: [] }
      })
      
      // Extract plans array from response data
      setPlans(plansRes?.data?.data || plansRes?.data || [])
      
      // Fetch invoice history using new API
      const invoicesRes = await invoiceAPI.getAll(1, {}).catch(err => {
        console.warn('Failed to fetch invoices:', err)
        return { data: [] }
      })
      
      setInvoices(invoicesRes?.data?.data || [])
      setInvoicesCount(invoicesRes?.data?.total || 0)
      
      // Fetch dashboard overview using service
      try {
        const dashboardRes = await dashboardAPI.getOverview(userId)
        setDashboardData(dashboardRes?.data || {})
      } catch (err) {
        console.warn('Failed to fetch dashboard data:', err)
      }
      
      // Fetch user plan purchase history using service
      try {
        const historyRes = await billingAPI.getPlanPurchaseHistory(userId)
        const historyData = historyRes?.data?.data && Array.isArray(historyRes.data.data) 
          ? historyRes.data.data 
          : []
        setPayments(historyData)
        setPaymentsCount(historyData?.length || 0)
        
        // Set current subscription from latest purchase
        if (historyData && historyData.length > 0) {
          const latestPurchase = historyData[0] // Assuming first is latest
          setSubscription({
            plan: latestPurchase.plan_id,
            status: latestPurchase.status || 'active',
            currentPeriodEnd: latestPurchase.end_date,
            amount: latestPurchase.amount
          })
        }
      } catch (err) {
        console.warn('Failed to fetch plan purchase history:', err)
        setPayments([])
        setPaymentsCount(0)
      }
      
    } catch (error) {
      console.error('Failed to fetch billing data:', error)
      setError('Failed to load billing information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [currentPage, paymentStatus, invoicePage])

  const handlePurchasePlan = (plan) => {
    setSelectedPlan(plan)
    setPurchaseData({
      plan_id: plan.id,
      customer_id: '', // Will be set by user
      amount: plan.price || plan.amount || 0
    })
    setShowPurchaseForm(true)
  }

  const handlePlanPurchase = async (e) => {
    e.preventDefault()
    if (!purchaseData.plan_id || !purchaseData.customer_id || !purchaseData.amount) {
      setError('Please fill all required fields')
      return
    }

    setActionLoading(true)
    setError(null)
    try {
      // Create Cashfree order using service
      const orderResponse = await billingAPI.createCashfreeOrder({
        amount: purchaseData.amount,
        plan_id: purchaseData.plan_id,
        customer_id: purchaseData.customer_id
      })
      
      const orderData = orderResponse?.data
      
      if (orderData?.status) {
        // Redirect to payment gateway or handle payment
        if (orderData.payment_url) {
          window.open(orderData.payment_url, '_blank')
        }
        
        setSuccessMessage('Order created successfully! Please complete the payment.')
        setShowPurchaseForm(false)
        setSelectedPlan(null)
        setPurchaseData({ plan_id: '', customer_id: '', amount: 0 })
        
        // Refresh data after a delay
        setTimeout(() => {
          fetchAll()
        }, 3000)
      } else {
        setError(orderData?.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Failed to purchase plan:', error)
      setError('Failed to purchase plan. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpgrade = async (planId) => {
    const plan = plans.find(p => p.id === planId)
    if (plan) {
      handlePurchasePlan(plan)
    }
  }

  const handleCancel = async () => {
    setActionLoading(true)
    try {
      // TODO: Implement subscription cancellation
      alert('Subscription cancellation functionality will be implemented.')
      setShowCancelConfirm(false)
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      setError('Failed to cancel subscription. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivate = async () => {
    setActionLoading(true)
    try {
      // TODO: Implement subscription reactivation
      alert('Subscription reactivation functionality will be implemented.')
    } catch (error) {
      console.error('Failed to reactivate subscription:', error)
      setError('Failed to reactivate subscription. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePaymentMethod = async (paymentMethod) => {
    setActionLoading(true)
    try {
      // TODO: Implement payment method update
      alert('Payment method update functionality will be implemented.')
    } catch (error) {
      console.error('Failed to update payment method:', error)
      setError('Failed to update payment method. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadInvoice = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank')
    } else if (invoice?.receiptUrl) {
      window.open(invoice.receiptUrl, '_blank')
    } else {
      alert('Invoice PDF is not available for download')
    }
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceModal(true)
  }

  const handleSendInvoice = async (invoice) => {
    try {
      // TODO: Implement invoice sending
      alert('Invoice sending functionality will be implemented.')
    } catch (error) {
      console.error('Failed to send invoice:', error)
      setError('Failed to send invoice. Please try again.')
    }
  }

  // Calculate usage percentages for progress bars
  const calculateUsagePercentage = (used, limit) => {
    if (!limit || limit === 0) return 0
    return Math.min((used / limit) * 100, 100)
  }

  // Get color based on usage percentage
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Calculate billing stats
  const stats = {
    totalSpent: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    successfulPayments: payments?.filter(p => p.status === 'succeeded' || p.status === 'paid').length || 0,
    failedPayments: payments?.filter(p => p.status === 'failed').length || 0,
    pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
    nextBilling: subscription?.currentPeriodEnd || null,
    daysUntilBilling: subscription?.currentPeriodEnd 
      ? Math.ceil((new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))
      : 0,
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
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
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Show error state
  if (error && !subscription && !loading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6 p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <FiAlertCircle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Data</h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <Button onClick={fetchAll} icon={FiRefreshCw}>
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6"
      >  
        {/* Error and Success Messages */}
        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg ${
                error 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  error 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {error ? (
                    <FiAlertCircle className={`w-5 h-5 ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                  ) : (
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    error 
                      ? 'text-red-800 dark:text-red-200' 
                      : 'text-green-800 dark:text-green-200'
                  }`}>
                    {error || successMessage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setError(null)
                    setSuccessMessage(null)
                  }}
                  className={`p-1 rounded-lg ${
                    error 
                      ? 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30' 
                      : 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30'
                  }`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiCreditCard className="w-4 h-4 mr-2" />
              {showChangePlanForm ? 'Change Your Plan' : 'Manage your subscription and billing information'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {showChangePlanForm ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowChangePlanForm(false)}
                  icon={FiArrowLeft}
                >
                  Back to Overview
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchAll}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {!subscription && !loading ? (
          <EmptyState
            icon={FiCreditCard}
            title="No subscription found"
            description="We couldn't load your subscription. Try again."
            action={
              <Button onClick={fetchAll} isLoading={loading}>
                Reload
              </Button>
            }
          />
        ) : (
          <>
            {/* Stats Cards - Hide when change plan form is shown */}
            <AnimatePresence mode="wait">
              {!showChangePlanForm && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                  <StatCard
                    title="Total Spent"
                    value={`$${stats.totalSpent.toFixed(2)}`}
                    icon={FiDollarSign}
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                  />
                  <StatCard
                    title="Successful Payments"
                    value={stats.successfulPayments}
                    icon={FiCheckCircle}
                    color="from-green-500 to-emerald-500"
                    subtitle={`${((stats.successfulPayments / (payments.length || 1)) * 100).toFixed(1)}% success rate`}
                    delay={0.2}
                  />
                  <StatCard
                    title="Failed Payments"
                    value={stats.failedPayments}
                    icon={FiXCircle}
                    color="from-red-500 to-pink-500"
                    delay={0.3}
                  />
                  <StatCard
                    title="Pending"
                    value={stats.pendingPayments}
                    icon={FiAlertCircle}
                    color="from-yellow-500 to-orange-500"
                    delay={0.4}
                  />
                  <StatCard
                    title="Next Billing"
                    value={stats.daysUntilBilling > 0 ? `${stats.daysUntilBilling} days` : 'Today'}
                    icon={FiCalendar}
                    color="from-purple-500 to-indigo-500"
                    subtitle={stats.nextBilling ? new Date(stats.nextBilling).toLocaleDateString() : 'N/A'}
                    delay={0.5}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Plan Form */}
            <AnimatePresence mode="wait">
              {showChangePlanForm && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SubscriptionForm
                    plans={plans}
                    currentPlan={currentPlan}
                    onSubmit={handleUpgrade}
                    onCancel={() => setShowChangePlanForm(false)}
                    isSubmitting={actionLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content - Hide when change plan form is shown */}
            <AnimatePresence mode="wait">
              {!showChangePlanForm && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Subscription Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subscription Card */}
                    <SubscriptionCard
                      subscription={subscription}
                      onUpgrade={() => setShowChangePlanForm(true)}
                      onCancel={() => setShowCancelConfirm(true)}
                      onReactivate={handleReactivate}
                      onUpdatePaymentMethod={handleUpdatePaymentMethod}
                      loading={actionLoading}
                    />

                    {/* Plan Details & Usage Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Current Plan
                      </h3>
                      {currentPlan ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Plan</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {currentPlan.name || 'Basic Plan'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Price</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${currentPlan.price || currentPlan.amount || 0}/{currentPlan.interval || 'month'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <StatusBadge
                              status={subscription?.status || 'active'}
                              variant={subscription?.status === 'active' ? 'success' : 'warning'}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 dark:text-gray-400">
                            No active plan found
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Usage Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Usage Overview
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            75 GB / 100 GB
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${getUsageColor(75)}`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            7,500 / 10,000
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className={`h-full ${getUsageColor(75)}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment History */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Payment History
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={paymentStatus}
                          onChange={setPaymentStatus}
                          options={[
                            { value: '', label: 'All Payments' },
                            { value: 'succeeded', label: 'Successful' },
                            { value: 'failed', label: 'Failed' },
                            { value: 'pending', label: 'Pending' }
                          ]}
                          className="w-40"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={fetchAll}
                          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                          <FiRefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                    <PaymentHistory
                      payments={payments}
                      loading={loading}
                      onPaymentClick={(payment) => console.log('Payment clicked:', payment)}
                    />
                    {paymentsCount > pageSize && (
                      <div className="mt-4 flex justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalItems={paymentsCount}
                          itemsPerPage={pageSize}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Invoice History */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invoice History
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // TODO: Implement invoice creation
                          alert('Invoice creation will be implemented.')
                        }}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-lg"
                      >
                        Create Invoice
                      </motion.button>
                    </div>
                    
                    {invoices.length === 0 ? (
                      <EmptyState
                        icon={FiFileText}
                        title="No invoices found"
                        description="You haven't created any invoices yet."
                      />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Invoice #
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Customer
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Amount
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((invoice) => (
                              <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-3 px-4">
                                  <span className="font-mono text-sm">
                                    #{invoice.id}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {new Date(invoice.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {invoice.customer_name || 'Walk-in Customer'}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium">
                                  ${parseFloat(invoice.total_amount || 0).toFixed(2)}
                                </td>
                                <td className="py-3 px-4">
                                  <StatusBadge
                                    status={invoice.status || 'paid'}
                                    variant={invoice.status === 'paid' ? 'success' : 'warning'}
                                    size="sm"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleViewInvoice(invoice)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                      title="View Details"
                                    >
                                      <FiFileText className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDownloadInvoice(invoice)}
                                      className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                      title="Download PDF"
                                    >
                                      <FiDownload className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {invoicesCount > pageSize && (
                      <div className="mt-4 flex justify-center">
                        <Pagination
                          currentPage={invoicePage}
                          totalItems={invoicesCount}
                          itemsPerPage={pageSize}
                          onPageChange={setInvoicePage}
                        />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Cancel Subscription Confirmation Modal */}
        <AnimatePresence>
          {showCancelConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCancelConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiX className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Cancel Subscription
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Are you sure you want to cancel your subscription? This action cannot be undone.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelConfirm(false)}
                        className="w-full"
                      >
                        Keep Subscription
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        variant="danger"
                        onClick={handleCancel}
                        isLoading={actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? 'Cancelling...' : 'Cancel Anyway'}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan Purchase Modal */}
        <AnimatePresence>
          {showPurchaseForm && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPurchaseForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Purchase Plan
                  </motion.h3>
                  
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedPlan.name}
                    </h4>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₹{selectedPlan.price || selectedPlan.amount || 0}/{selectedPlan.interval || 'month'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {selectedPlan.description || 'No description available'}
                    </p>
                  </motion.div>
                  
                  <motion.form 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handlePlanPurchase}
                    className="space-y-4"
                  >
                    <Input
                      type="hidden"
                      name="plan_id"
                      value={purchaseData.plan_id}
                      readOnly
                    />
                    
                    <Input
                      label="Customer ID"
                      type="number"
                      placeholder="Enter customer ID"
                      value={purchaseData.customer_id}
                      onChange={(e) => setPurchaseData({ ...purchaseData, customer_id: e.target.value })}
                      required
                    />
                    
                    <Input
                      type="hidden"
                      name="amount"
                      value={purchaseData.amount}
                      readOnly
                    />
                    
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}
                    
                    {successMessage && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPurchaseForm(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full"
                        >
                          {actionLoading ? 'Processing...' : 'Complete Purchase'}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice View Modal */}
        <AnimatePresence>
          {showInvoiceModal && selectedInvoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowInvoiceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Invoice #{selectedInvoice.number || selectedInvoice.id}
                  </h3>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedInvoice.date || selectedInvoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${(selectedInvoice.amount || selectedInvoice.total || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <StatusBadge
                        status={selectedInvoice.status || 'paid'}
                        variant={selectedInvoice.status === 'paid' ? 'success' : 'warning'}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadInvoice(selectedInvoice)}
                      icon={FiDownload}
                    >
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => handleSendInvoice(selectedInvoice)}
                      icon={FiMail}
                    >
                      Send Email
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ProtectedRoute>
  )
}

export default Billing