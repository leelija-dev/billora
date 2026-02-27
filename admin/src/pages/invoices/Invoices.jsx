import React, { useEffect, useState } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiFileText, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle,
  FiArrowLeft,
  FiX,
  FiDollarSign,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvoiceStore } from '../../store/invoiceStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import InvoiceTable from '../../components/features/Invoices/InvoiceTable'
import InvoiceForm from '../../components/features/Invoices/InvoiceForm'
import InvoiceModal from '../../components/features/Invoices/InvoiceModal'

const Invoices = () => {
  const {
    invoices,
    totalInvoices,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    setFilters,
  } = useInvoiceStore()

  const [formMode, setFormMode] = useState(null) // 'add', 'edit', or null
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [editInvoice, setEditInvoice] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handlePageChange = (page) => {
    fetchInvoices(page)
  }

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setShowViewModal(true)
  }

  const handleDownload = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank')
    }
  }

  const handleAddClick = () => {
    setFormMode('add')
    setEditInvoice(null)
  }

  const handleEditClick = (invoice) => {
    setEditInvoice(invoice)
    setFormMode('edit')
  }

  const handleCancelForm = () => {
    setFormMode(null)
    setEditInvoice(null)
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
        setFormMode(null)
        await fetchInvoices(currentPage)
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleEditSubmit = async (data) => {
    if (!editInvoice?.id) return
    setFormSubmitting(true)
    try {
      const res = await updateInvoice(editInvoice.id, data)
      if (res?.success) {
        setFormMode(null)
        setEditInvoice(null)
        await fetchInvoices(currentPage)
      }
    } catch (error) {
      console.error('Failed to update invoice:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', status: '' })
  }

  // Calculate stats
  const stats = {
    total: invoices?.length || 0,
    paid: invoices?.filter(i => i.status === 'paid').length || 0,
    unpaid: invoices?.filter(i => i.status === 'unpaid').length || 0,
    overdue: invoices?.filter(i => i.status === 'overdue').length || 0,
    totalAmount: invoices?.reduce((sum, i) => sum + (i.total || 0), 0) || 0,
    paidAmount: invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0) || 0,
    unpaidAmount: invoices?.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((sum, i) => sum + (i.total || 0), 0) || 0,
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
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiFileText className="w-4 h-4 mr-2" />
            {formMode ? (
              <span>{formMode === 'add' ? 'Create New Invoice' : 'Edit Invoice'}</span>
            ) : (
              <span>Manage and track your invoices</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {formMode ? (
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
        {!formMode && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
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
              value={`$${stats.totalAmount.toFixed(2)}`}
              icon={FiDollarSign}
              color="from-purple-500 to-indigo-500"
              delay={0.5}
            />
            <StatCard
              title="Outstanding"
              value={`$${stats.unpaidAmount.toFixed(2)}`}
              icon={FiDollarSign}
              color="from-red-500 to-orange-500"
              subtitle={`${((stats.unpaidAmount / stats.totalAmount) * 100 || 0).toFixed(1)}% of total`}
              delay={0.6}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Form */}
      <AnimatePresence mode="wait">
        {formMode && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <InvoiceForm
              initialData={editInvoice}
              mode={formMode}
              onSubmit={formMode === 'add' ? handleAddSubmit : handleEditSubmit}
              onCancel={handleCancelForm}
              isSubmitting={formSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!formMode && (
          <motion.div
            key="filters"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
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
                    <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </motion.button>

                {(searchTerm || filters.status) && (
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoices Table - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!formMode && (
          <motion.div
            key="table"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            {invoices?.length === 0 && !loading ? (
              <EmptyState
                icon={FiFileText}
                title="No invoices found"
                description="Try adjusting your search or filters, or create your first invoice."
                action={
                  <Button onClick={handleAddClick} icon={FiPlus}>
                    Create Invoice
                  </Button>
                }
              />
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <InvoiceTable
                    invoices={(invoices || []).map((inv) => ({
                      ...inv,
                      amount: inv.total ?? 0,
                      currency: inv.currency || 'USD',
                    }))}
                    loading={loading}
                    onView={handleView}
                    onDownload={handleDownload}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onMarkPaid={handleMarkPaid}
                  />
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={totalInvoices}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Invoice
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete invoice <span className="font-semibold">#{invoiceToDelete?.invoiceNumber}</span>? 
                  This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setInvoiceToDelete(null)
                    }}
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Invoices