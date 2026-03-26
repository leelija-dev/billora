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
import SubscriptionCard from '../../components/features/Billing/SubscriptionCard'
import PaymentHistory from '../../components/features/Billing/PaymentHistory'
import SubscriptionForm from '../../components/features/Billing/SubscriptionForm'
import Select from '../../components/common/Select/Select'
import Pagination from '../../components/common/Pagination/Pagination'
import Button from '../../components/common/Button/Button'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Input from '../../components/common/Input/Input'

const Billing = () => {
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

  const currentPlan = useMemo(() => {
    if (!subscription?.plan) return null
    return plans.find((p) => p.id === subscription.plan) || null
  }, [plans, subscription?.plan])

  // Get user ID from localStorage or auth context
  const getUserId = () => {
    return localStorage.getItem('user_id') || localStorage.getItem('userId') || 1
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
    )
  }

  return (
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
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 rounded-full -mr-10 -mt-10" />
                    
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiTrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                        Current Plan & Usage
                      </h3>

                      {currentPlan ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {currentPlan.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${currentPlan.price}/{currentPlan.interval}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              <StatusBadge
                                status={subscription?.status || 'unknown'}
                                variant={
                                  subscription?.status === 'active' ? 'success' :
                                  subscription?.status === 'past_due' ? 'warning' :
                                  subscription?.status === 'canceled' ? 'danger' : 'default'
                                }
                              />
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Renewal Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {subscription?.currentPeriodEnd 
                                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : 'N/A'}
                              </span>
                            </div>

                            {subscription?.cancelAtPeriodEnd && (
                              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  Your subscription will end on{' '}
                                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Usage Limits */}
                          {currentPlan.limits && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Usage Limits
                              </h4>
                              
                              <div className="space-y-3">
                                {/* Users Usage */}
                                {currentPlan.limits.users && (
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                        <FiUsers className="w-3 h-3 mr-1" />
                                        Users
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {subscription?.usage?.users || 0} / {currentPlan.limits.users}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                      <div 
                                        className={`${getUsageColor(calculateUsagePercentage(subscription?.usage?.users, currentPlan.limits.users))} h-1.5 rounded-full`}
                                        style={{ width: `${calculateUsagePercentage(subscription?.usage?.users, currentPlan.limits.users)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Products Usage */}
                                {currentPlan.limits.products && (
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                        <FiDatabase className="w-3 h-3 mr-1" />
                                        Products
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {subscription?.usage?.products || 0} / {currentPlan.limits.products}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                      <div 
                                        className={`${getUsageColor(calculateUsagePercentage(subscription?.usage?.products, currentPlan.limits.products))} h-1.5 rounded-full`}
                                        style={{ width: `${calculateUsagePercentage(subscription?.usage?.products, currentPlan.limits.products)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Storage Usage */}
                                {currentPlan.limits.storage && (
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                        <FiDatabase className="w-3 h-3 mr-1" />
                                        Storage (GB)
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {subscription?.usage?.storage || 0} / {currentPlan.limits.storage}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                      <div 
                                        className={`${getUsageColor(calculateUsagePercentage(subscription?.usage?.storage, currentPlan.limits.storage))} h-1.5 rounded-full`}
                                        style={{ width: `${calculateUsagePercentage(subscription?.usage?.storage, currentPlan.limits.storage)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* API Calls Usage */}
                                {currentPlan.limits.apiCalls && (
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                        <FiCpu className="w-3 h-3 mr-1" />
                                        API Calls
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {subscription?.usage?.apiCalls?.toLocaleString() || 0} / {currentPlan.limits.apiCalls.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                      <div 
                                        className={`${getUsageColor(calculateUsagePercentage(subscription?.usage?.apiCalls, currentPlan.limits.apiCalls))} h-1.5 rounded-full`}
                                        style={{ width: `${calculateUsagePercentage(subscription?.usage?.apiCalls, currentPlan.limits.apiCalls)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No plan selected</p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Available Plans */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FiPackage className="w-5 h-5 mr-2 text-primary-500" />
                      Available Plans
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChangePlanForm(true)}
                      icon={FiArrowLeft}
                    >
                      Change Plan
                    </Button>
                  </div>
                  
                  {plans.length === 0 ? (
                    <EmptyState
                      title="No plans available"
                      description="Check back later for available subscription plans."
                      icon={FiPackage}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plans.map((plan, index) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                            currentPlan?.id === plan.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          {currentPlan?.id === plan.id && (
                            <div className="absolute -top-3 -right-3">
                              <div className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                Current Plan
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                {plan.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {plan.description || 'No description available'}
                              </p>
                            </div>
                            
                            <div className="flex items-baseline space-x-1">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                ₹{plan.price || plan.amount || 0}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                /{plan.interval || 'month'}
                              </span>
                            </div>
                            
                            {plan.features && plan.features.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Features:</p>
                                <ul className="space-y-1">
                                  {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <FiCheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                onClick={() => handlePurchasePlan(plan)}
                                disabled={currentPlan?.id === plan.id}
                                className="w-full"
                                variant={currentPlan?.id === plan.id ? 'outline' : 'primary'}
                              >
                                {currentPlan?.id === plan.id ? 'Current Plan' : 'Purchase Plan'}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Payment Method Card */}
                {subscription?.paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Method
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                          <FiCreditCard className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subscription.paymentMethod.brand || 'Card'} •••• {subscription.paymentMethod.last4 || '****'}
                          </p>
                          {subscription.paymentMethod.expiryMonth && subscription.paymentMethod.expiryYear && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdatePaymentMethod('new')}
                      >
                        Update
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Filters and Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="flex-1">
                      <Select
                        label="Payment Status"
                        options={[
                          { value: '', label: 'All statuses' },
                          { value: 'succeeded', label: 'Succeeded' },
                          { value: 'paid', label: 'Paid' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'failed', label: 'Failed' },
                          { value: 'refunded', label: 'Refunded' },
                        ]}
                        value={paymentStatus}
                        onChange={(e) => {
                          setCurrentPage(1)
                          setPaymentStatus(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <PaymentHistory 
                  payments={payments} 
                  loading={loading}
                  onViewInvoice={handleViewInvoice}
                  onDownloadInvoice={handleDownloadInvoice}
                />

                {paymentsCount > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalItems={paymentsCount}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                  />
                )}

                {/* Invoices Section - Only show if we have invoices */}
                {invoices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Invoices
                    </h3>
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <FiFileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Invoice #{invoice.number || invoice.id}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(invoice.date || invoice.createdAt).toLocaleDateString()} • ${(invoice.amount || invoice.total || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge
                              status={invoice.status || 'paid'}
                              variant={
                                invoice.status === 'paid' ? 'success' :
                                invoice.status === 'open' ? 'warning' : 'default'
                              }
                            />
                            <button
                              onClick={() => handleDownloadInvoice(invoice)}
                              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <FiDownload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendInvoice(invoice)}
                              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Send by Email"
                            >
                              <FiMail className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {invoicesCount > pageSize && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={invoicePage}
                          totalItems={invoicesCount}
                          pageSize={pageSize}
                          onPageChange={setInvoicePage}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
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
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Cancel Subscription
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period ({subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}).
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  After cancellation, you won't be charged again and your account will be downgraded to the free plan.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1"
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    isLoading={actionLoading}
                    className="flex-1"
                  >
                    Cancel Anyway
                  </Button>
                </div>
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
  )
}

export default Billing