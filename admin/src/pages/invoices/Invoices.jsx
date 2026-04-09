import React, { useEffect, useState } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiFileText, 
  FiTrash2, 
  FiCheckCircle,
  FiArrowLeft,
  FiX,
  FiDollarSign,
  FiClock,
  FiAlertCircle

} from 'react-icons/fi'
import { FaReceipt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvoiceStore } from '../../store/invoiceStore'
import { usePermissionStore } from '../../store/permissionStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import InvoiceTable from '../../components/features/Invoices/InvoiceTable'
import InvoiceModal from '../../components/features/Invoices/InvoiceModal'
import BillGenerateForm from '../../components/features/Invoices/BillGenerateForm'
import { printA4Invoice, printThermalInvoice } from '../../templates/PrintUtils'
import { customerAPI } from '../../services/customerService'
import { storeAPI } from '../../services/storeService'
import { productsAPI } from '../../services/productsService'

const Invoices = () => {
  const navigate = useNavigate()
  const { canAccess } = usePermissionStore()
  const {
    invoices,
    totalInvoices,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchInvoices,
    createInvoice,
    deleteInvoice,
    fetchBillGenerateData,
    setFilters,
  } = useInvoiceStore()

  // Check if user has stock management permission
  const hasStockPermission = canAccess('stock-management')

  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)
  const [showBillGenerate, setShowBillGenerate] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchInvoices()
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handlePageChange = (page) => {
    setPageLoading(true)
    fetchInvoices(page).finally(() => {
      setPageLoading(false)
    })
  }

  const handleView = (invoice) => {
    navigate(`/invoices/detail/${invoice.id}`)
  }

  const handleDownload = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank')
    }
  }

  const handleAddClick = () => {
    setShowAddForm(true)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
  }

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async () => {
    if (!invoiceToDelete?.id) return
    try {
      const res = await deleteInvoice(invoiceToDelete.id)
      if (res?.success) {
        setShowDeleteConfirm(false)
        setInvoiceToDelete(null)
        await fetchInvoices(currentPage)
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    }
  }

  const handleMarkPaid = async (invoice) => {
    if (!invoice?.id || invoice.status === 'paid') return
    try {
      const res = await markAsPaid(invoice.id)
      if (res?.success) {
        await fetchInvoices(currentPage)
      }
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error)
    }
  }

  const handleAddSubmit = async (data) => {
    setFormSubmitting(true)
    try {
      const res = await createInvoice(data)
      if (res?.success) {
        setShowAddForm(false)
        await fetchInvoices(currentPage)
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', status: '' })
  }

  const handleBillGenerate = () => {
    navigate('/invoice')
  }

  const handlePrintA4 = async (invoice) => {
    try {
      const [customerResponse, storeResponse] = await Promise.all([
        customerAPI.getById(invoice.customer_id),
        storeAPI.getByUserId(invoice.user_id)
      ])

      const customerData = customerResponse.data?.data || {}
      const storesArray = storeResponse.data?.data?.data || storeResponse.data?.data || []
      const storeData = storesArray.find(store => store.id === invoice.store_id) || storesArray[0] || {}

      const invoiceItems = invoice.invoice_items || invoice.items || []
      let enhancedItems = []
      
      if (invoiceItems.length > 0) {
        const productPromises = invoiceItems.map(item => 
          productsAPI.getById(item.product_id)
            .then(productResponse => {
              const productData = productResponse.data?.data || productResponse.data || {}
              return {
                ...item,
                product_name: productData.name || item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                price: parseFloat(item.price || productData.selling_price || 0),
                quantity: parseFloat(item.quantity || item.item_count || 1),
                total_price: parseFloat(item.total_price || item.total || 0),
                gst: parseFloat(item.gst || productData.gst_percentage || 0),
                discount: parseFloat(item.discount || productData.discount_percentage || 0)
              }
            })
            .catch(error => {
              console.error(`Failed to fetch product ${item.product_id}:`, error)
              return {
                ...item,
                product_name: item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                price: parseFloat(item.price || 0),
                quantity: parseFloat(item.quantity || item.item_count || 1),
                total_price: parseFloat(item.total_price || item.total || 0),
                gst: parseFloat(item.gst || 0),
                discount: parseFloat(item.discount || 0)
              }
            })
        )
        
        enhancedItems = await Promise.all(productPromises)
      } else {
        enhancedItems = [{
          id: 1,
          product_id: 1,
          product_name: 'Product Item',
          price: parseFloat(invoice.total_amount || 1000),
          quantity: 1,
          total_price: parseFloat(invoice.total_amount || 1000),
          gst: 18,
          discount: 0
        }]
      }

      const enhancedInvoice = {
        ...invoice,
        invoice_number: invoice.invoice_number || `INV-${invoice.id}`,
        customer_name: customerData.name || invoice.customer_name || 'Walk-in Customer',
        customer_phone: customerData.phone || invoice.customer_phone || 'N/A',
        customer_email: customerData.email || invoice.customer_email || 'N/A',
        customer_address: customerData.address ? `${customerData.address}, ${customerData.city}` : invoice.customer_address || 'N/A',
        customer_gst: customerData.gst || invoice.customer_gst || 'N/A',
        store_name: storeData.name || invoice.store_name || 'Your Store Name',
        store_address: storeData.address ? `${storeData.address}, ${storeData.city}` : invoice.store_address || '123 Business Street, City',
        store_gst: storeData.gst || invoice.store_gst || 'GSTIN123456',
        store_email: storeData.email || invoice.store_email || 'store@business.com',
        store_phone: storeData.mobile || storeData.phone || invoice.store_phone || '123-456-7890',
        items: enhancedItems
      }
      printA4Invoice(enhancedInvoice)
    } catch (error) {
      console.error('Failed to fetch data for A4 printing:', error)
      printA4Invoice(invoice)
    }
  }

  const handlePrintThermal = async (invoice) => {
    try {
      const [customerResponse, storeResponse] = await Promise.all([
        customerAPI.getById(invoice.customer_id),
        storeAPI.getByUserId(invoice.user_id)
      ])

      const customerData = customerResponse.data?.data || {}
      const storesArray = storeResponse.data?.data?.data || storeResponse.data?.data || []
      const storeData = storesArray.find(store => store.id === invoice.store_id) || storesArray[0] || {}

      const invoiceItems = invoice.invoice_items || invoice.items || []
      let enhancedItems = []
      
      if (invoiceItems.length > 0) {
        const productPromises = invoiceItems.map(item => 
          productsAPI.getById(item.product_id)
            .then(productResponse => {
              const productData = productResponse.data?.data || productResponse.data || {}
              return {
                ...item,
                product_name: productData.name || item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                price: parseFloat(item.price || productData.selling_price || 0),
                quantity: parseFloat(item.quantity || item.item_count || 1),
                total_price: parseFloat(item.total_price || item.total || 0),
                gst: parseFloat(item.gst || productData.gst_percentage || 0),
                discount: parseFloat(item.discount || productData.discount_percentage || 0)
              }
            })
            .catch(error => {
              console.error(`Failed to fetch product ${item.product_id} for thermal:`, error)
              return {
                ...item,
                product_name: item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                price: parseFloat(item.price || 0),
                quantity: parseFloat(item.quantity || item.item_count || 1),
                total_price: parseFloat(item.total_price || item.total || 0),
                gst: parseFloat(item.gst || 0),
                discount: parseFloat(item.discount || 0)
              }
            })
        )
        
        enhancedItems = await Promise.all(productPromises)
      } else {
        enhancedItems = [{
          id: 1,
          product_id: 1,
          product_name: 'Product Item',
          price: parseFloat(invoice.total_amount || 1000),
          quantity: 1,
          total_price: parseFloat(invoice.total_amount || 1000),
          gst: 18,
          discount: 0
        }]
      }

      const enhancedInvoice = {
        ...invoice,
        invoice_number: invoice.invoice_number || `INV-${invoice.id}`,
        customer_name: customerData.name || invoice.customer_name || 'Walk-in Customer',
        customer_phone: customerData.phone || invoice.customer_phone || 'N/A',
        customer_email: customerData.email || invoice.customer_email || 'N/A',
        customer_address: customerData.address ? `${customerData.address}, ${customerData.city}` : invoice.customer_address || 'N/A',
        customer_gst: customerData.gst || invoice.customer_gst || 'N/A',
        store_name: storeData.name || invoice.store_name || 'Your Store Name',
        store_address: storeData.address ? `${storeData.address}, ${storeData.city}` : invoice.store_address || 'Store Address',
        store_gst: storeData.gst || invoice.store_gst || 'GSTIN123456',
        store_email: storeData.email || invoice.store_email || 'store@business.com',
        store_phone: storeData.mobile || storeData.phone || invoice.store_phone || 'Store Phone',
        items: enhancedItems
      }
      printThermalInvoice(enhancedInvoice)
    } catch (error) {
      console.error('Failed to fetch data for thermal printing:', error)
      printThermalInvoice(invoice)
    }
  }

  // Calculate stats with safe invoices array
  const safeInvoices = Array.isArray(invoices) ? invoices : []
  
  const stats = {
    total: safeInvoices?.length || 0,
    completed: safeInvoices?.filter(i => i.status === 'completed').length || 0,
    paid: safeInvoices?.filter(i => i.status === 'paid' || i.status === 'completed').length || 0,
    unpaid: safeInvoices?.filter(i => i.status === 'unpaid').length || 0,
    overdue: safeInvoices?.filter(i => i.status === 'overdue').length || 0,
    totalAmount: safeInvoices?.reduce((sum, i) => sum + (parseFloat(i.total_amount) || 0), 0) || 0,
    paidAmount: safeInvoices?.filter(i => i.status === 'paid' || i.status === 'completed')
      .reduce((sum, i) => sum + (parseFloat(i.paid_amount) || 0), 0) || 0,
    unpaidAmount: safeInvoices?.filter(i => i.status === 'unpaid' || i.status === 'overdue')
      .reduce((sum, i) => sum + (parseFloat(i.total_amount) || 0), 0) || 0,
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiFileText className="w-4 h-4 mr-2" />
            {showAddForm ? (
              <span>Create New Invoice</span>
            ) : (
              <span>Manage and track your invoices</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {showAddForm ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Button
                variant="outline"
                onClick={handleCancelForm}
                icon={FiArrowLeft}
              >
                Back to Invoices
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                onClick={handleAddClick}
                icon={FiPlus}
                className="shadow-lg shadow-primary-500/30"
              >
                Create Invoice
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!showAddForm && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            {initialLoading ? (
              // Loading skeleton for stats cards
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              <>
                <StatCard
                  title="Total Invoices"
                  value={stats.total}
                  icon={FiFileText}
                  color="from-blue-500 to-cyan-500"
                  delay={0.1}
                />
                <StatCard
                  title="Paid"
                  value={stats.paid}
                  icon={FiCheckCircle}
                  color="from-green-500 to-emerald-500"
                  subtitle={`${((stats.paid / stats.total) * 100 || 0).toFixed(1)}% of total`}
                  delay={0.2}
                />
                <StatCard
                  title="Unpaid"
                  value={stats.unpaid}
                  icon={FiClock}
                  color="from-yellow-500 to-orange-500"
                  delay={0.3}
                />
                <StatCard
                  title="Overdue"
                  value={stats.overdue}
                  icon={FiAlertCircle}
                  color="from-red-500 to-pink-500"
                  delay={0.4}
                />
                <StatCard
                  title="Total Amount"
                  value={`₹${stats.totalAmount.toFixed(2)}`}
                  icon={FiDollarSign}
                  color="from-purple-500 to-indigo-500"
                  delay={0.5}
                />
                <StatCard
                  title="Outstanding"
                  value={`₹${stats.unpaidAmount.toFixed(2)}`}
                  icon={FiDollarSign}
                  color="from-red-500 to-orange-500"
                  subtitle={`${((stats.unpaidAmount / stats.totalAmount) * 100 || 0).toFixed(1)}% of total`}
                  delay={0.6}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Form */}
      <AnimatePresence mode="wait">
        {showAddForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <BillGenerateForm
              mode="add"
              onSubmit={handleAddSubmit}
              onCancel={handleCancelForm}
              isSubmitting={formSubmitting}
              hasStockPermission={hasStockPermission}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!showAddForm && (
          <motion.div
            key="filters"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            {initialLoading ? (
              // Loading skeleton for filters
              <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search invoices by number, customer, or amount..."
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
                      {filters.status && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-1 w-2 h-2 bg-primary-500 rounded-full"
                        />
                      )}
                    </motion.button>

                    {(searchTerm || filters.status) && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
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
                            label="Status"
                            options={[
                              { value: '', label: 'All Statuses' },
                              { value: 'paid', label: 'Paid' },
                              { value: 'unpaid', label: 'Unpaid' },
                              { value: 'overdue', label: 'Overdue' },
                              { value: 'cancelled', label: 'Cancelled' },
                              { value: 'refunded', label: 'Refunded' },
                            ]}
                            value={filters.status}
                            onChange={(e) => setFilters({ status: e.target.value })}
                          />
                          
                          <Select
                            label="Date Range"
                            options={[
                              { value: '', label: 'All Time' },
                              { value: 'today', label: 'Today' },
                              { value: 'week', label: 'This Week' },
                              { value: 'month', label: 'This Month' },
                              { value: 'quarter', label: 'This Quarter' },
                              { value: 'year', label: 'This Year' },
                            ]}
                            value={filters.dateRange}
                            onChange={(e) => setFilters({ dateRange: e.target.value })}
                          />

                          <Input
                            label="Min Amount"
                            type="number"
                            placeholder="0"
                            value={filters.minAmount}
                            onChange={(e) => setFilters({ minAmount: e.target.value })}
                          />

                          <Input
                            label="Max Amount"
                            type="number"
                            placeholder="10000"
                            value={filters.maxAmount}
                            onChange={(e) => setFilters({ maxAmount: e.target.value })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoices Table - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!showAddForm && (
          <motion.div
            key="table"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            {initialLoading || pageLoading ? (
              // Loading skeleton for table
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    {initialLoading ? 'Loading invoice data...' : 'Updating invoice data...'}
                  </p>
                </div>
              </div>
            ) : safeInvoices?.length === 0 ? (
              <EmptyState
                icon={FiFileText}
                title="No invoices found"
                description="Try adjusting your search or filters, or create your first invoice."
                action={
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={handleAddClick} icon={FiPlus}>
                      Create Invoice
                    </Button>
                  </motion.div>
                }
              />
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <InvoiceTable
                    invoices={(safeInvoices || []).map((inv) => ({
                      ...inv,
                      amount: inv.total ?? 0,
                      currency: inv.currency || 'USD',
                    }))}
                    loading={loading}
                    onView={handleView}
                    onDownload={handleDownload}
                    onMarkPaid={handleMarkPaid}
                    onPrintA4={handlePrintA4}
                    onPrintThermal={handlePrintThermal}
                  />
                </div>

                {totalInvoices > pageSize && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalInvoices}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Invoice Modal */}
      <InvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedInvoice(null)
        }}
        invoice={selectedInvoice}
      />

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
                  Delete Invoice
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Are you sure you want to delete invoice <span className="font-semibold">#{invoiceToDelete?.invoiceNumber}</span>? 
                  This action cannot be undone and will remove all associated data.
                </motion.p>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setInvoiceToDelete(null)
                      }}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
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

      {/* Bill Generate Modal */}
      <AnimatePresence>
        {showBillGenerate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBillGenerate(false)}
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
                  <FaReceipt className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Bill Generation
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Generate bills with stock management integration. This will open the bill generation page where you can create new invoices with product selection and stock management.
                </motion.p>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowBillGenerate(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={() => window.open('/invoice', '_blank')}
                      className="w-full"
                    >
                      Open Bill Generator
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

export default Invoices