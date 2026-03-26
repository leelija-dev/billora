import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiDownload
} from 'react-icons/fi'
import { customerAPI } from '../../services/customerService'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import CustomerForm from '../../components/features/Customers/CustomerForm'

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
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: ''
  })

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true)
        const response = await customerAPI.getById(id)
        setCustomer(response.data?.data || response.data)
      } catch (error) {
        console.error('Failed to fetch customer details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerDetails()
  }, [id])

  // Fetch payment history
  useEffect(() => {
    fetchPaymentHistory()
  }, [id, filters])

  const fetchPaymentHistory = async () => {
    try {
      setPaymentLoading(true)
      const params = new URLSearchParams()
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      
      const response = await customerAPI.getPaymentHistory(id, params.toString())
      setPaymentHistory(response.data?.bill_payment_history || [])
    } catch (error) {
      console.error('Failed to fetch payment history:', error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleEditCustomer = async (customerData) => {
    try {
      setFormSubmitting(true)
      await customerAPI.update(id, customerData)
      // Refresh customer data
      const response = await customerAPI.getById(id)
      setCustomer(response.data?.data || response.data)
      setShowEditForm(false)
    } catch (error) {
      console.error('Failed to update customer:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return
    
    try {
      setFormSubmitting(true)
      await customerAPI.makeDuePayment(id, { due_payment: paymentAmount })
      // Refresh customer data
      const response = await customerAPI.getById(id)
      setCustomer(response.data?.data || response.data)
      // Refresh payment history
      fetchPaymentHistory()
      setShowPaymentForm(false)
      setPaymentAmount('')
    } catch (error) {
      console.error('Failed to process payment:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await customerAPI.delete(id)
      navigate('/customers')
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const clearFilters = () => {
    setFilters({ start_date: '', end_date: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
      cell: (value) => new Date(value).toLocaleDateString()
    },
    {
      header: 'Invoice ID',
      accessor: 'invoice_id',
      cell: (value) => `#${value || 'N/A'}`
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
      cell: (value) => (
        <span className={parseFloat(value || 0) < 0 ? 'text-green-600' : 'text-red-600'}>
          ₹{parseFloat(value || 0).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Payment Method',
      accessor: 'payment_method',
      cell: (value) => value || 'N/A'
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              onClick={() => navigate('/customers')}
              icon={FiArrowLeft}
            >
              Back to Customers
            </Button>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customer Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage customer information
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setShowEditForm(true)}
              icon={FiEdit2}
            >
              Edit Customer
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowPaymentForm(true)}
              icon={FiCreditCard}
            >
              Make Payment
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              icon={FiTrash2}
            >
              Delete
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {customer.name}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <FiPhone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {customer.phone}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <FiMail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {customer.email || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Amount</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{parseFloat(customer.due_amount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Address and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Address Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-900 dark:text-white">
                  {customer.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {customer.city || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created Date</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCheckCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <StatusBadge
                  status={customer.status || 'active'}
                  text={customer.status || 'Active'}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment History
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                className="w-40"
              />
              <Input
                type="date"
                placeholder="End Date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                className="w-40"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  icon={FiX}
                  size="sm"
                >
                  Clear
                </Button>
              </motion.div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={fetchPaymentHistory}
                icon={FiRefreshCw}
                size="sm"
              >
                Refresh
              </Button>
            </motion.div>
          </div>
        </div>

        {paymentLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
            />
          </div>
        ) : paymentHistory.length === 0 ? (
          <EmptyState
            title="No payment history"
            description="No payments have been recorded for this customer yet."
            icon={FiDollarSign}
          />
        ) : (
          <Table
            columns={paymentColumns}
            data={paymentHistory}
            loading={paymentLoading}
          />
        )}
      </motion.div>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Customer
                </h3>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditForm(false)}
                    icon={FiX}
                  />
                </motion.div>
              </div>
              
              <CustomerForm
                initialData={customer}
                onSubmit={handleEditCustomer}
                onCancel={() => setShowEditForm(false)}
                isSubmitting={formSubmitting}
              />
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
            onClick={() => setShowPaymentForm(false)}
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
                  <FiCreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Current due amount: <span className="font-semibold text-red-600">₹{parseFloat(customer.due_amount || 0).toFixed(2)}</span>
                </motion.p>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <Input
                    type="number"
                    label="Payment Amount"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="0"
                    max={customer.due_amount || 0}
                    step="0.01"
                  />
                  
                  <div className="flex space-x-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        variant="outline"
                        onClick={() => setShowPaymentForm(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={handlePayment}
                        disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                        className="w-full"
                      >
                        {formSubmitting ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
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
                  <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
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
                  Are you sure you want to delete <span className="font-semibold">{customer.name}</span>? 
                  This action cannot be undone.
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
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </motion.div>
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
