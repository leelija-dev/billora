import React, { useEffect, useState } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 
  FiUsers,
  FiDownload,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
  FiX,
  FiStar,
  FiMessageCircle,
  FiArrowLeft,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useCustomerStore } from '../../store/customerStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import CustomerForm from '../../components/features/Customers/CustomerForm'
import Select from '../../components/common/Select/Select'

const Customers = () => {
  const {
    customers,
    totalCustomers,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setFilters,
  } = useCustomerStore()

  const [formMode, setFormMode] = useState(null) // 'add', 'edit', or null
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [viewMode, setViewMode] = useState('table')
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleAddClick = () => {
    setFormMode('add')
    setSelectedCustomer(null)
  }

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer)
    setFormMode('edit')
  }

  const handleCancelForm = () => {
    setFormMode(null)
    setSelectedCustomer(null)
  }

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id)
      setShowDeleteConfirm(false)
      setSelectedCustomer(null)
      fetchCustomers(currentPage)
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedCustomers) {
        await deleteCustomer(id)
      }
      setSelectedCustomers([])
      setShowDeleteConfirm(false)
      fetchCustomers(currentPage)
    } catch (error) {
      console.error('Failed to delete customers:', error)
    }
  }

  const handleAddSubmit = async (data) => {
    setFormSubmitting(true)
    try {
      const result = await createCustomer(data)
      if (result?.success) {
        setFormMode(null)
        await fetchCustomers(currentPage)
      }
    } catch (error) {
      console.error('Failed to create customer:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleEditSubmit = async (data) => {
    if (!selectedCustomer?.id) return
    setFormSubmitting(true)
    try {
      const result = await updateCustomer(selectedCustomer.id, data)
      if (result?.success) {
        setFormMode(null)
        setSelectedCustomer(null)
        await fetchCustomers(currentPage)
      }
    } catch (error) {
      console.error('Failed to update customer:', error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handlePageChange = (page) => {
    fetchCustomers(page)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCustomers()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', status: '' })
  }

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const selectAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map(c => c.id))
    }
  }

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      for (const id of selectedCustomers) {
        await updateCustomer(id, { status: newStatus })
      }
      setSelectedCustomers([])
      fetchCustomers(currentPage)
    } catch (error) {
      console.error('Failed to update customer statuses:', error)
    }
  }

  // Calculate stats
  const stats = {
    total: customers?.length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
    inactive: customers?.filter(c => c.status === 'inactive').length || 0,
    blocked: customers?.filter(c => c.status === 'blocked').length || 0,
    totalSpent: customers?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 0,
    totalOrders: customers?.reduce((sum, c) => sum + (c.totalOrders || 0), 0) || 0,
  }

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedCustomers.length === customers.length && customers.length > 0}
            onChange={selectAllCustomers}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(row.id)}
          onChange={() => toggleCustomerSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Customer',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {value?.charAt(0) || 'U'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
              row.status === 'active' ? 'bg-green-500' :
              row.status === 'blocked' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FiMail className="w-3 h-3 mr-1" />
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      cell: (value, row) => (
        <div className="space-y-1">
          {value && value !== '-' ? (
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <FiPhone className="w-3 h-3 mr-1 text-gray-400" />
              {value}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No phone</p>
          )}
          {row.company && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.company}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'address',
      cell: (value, row) => (
        <div className="flex items-start space-x-1">
          <FiMapPin className="w-3 h-3 mt-0.5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.city || 'N/A'}, {row.country || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Orders',
      accessor: 'totalOrders',
      cell: (value) => (
        <div className="flex items-center">
          <FiShoppingBag className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {value ?? 0}
          </span>
        </div>
      ),
    },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      cell: (value) => (
        <div className="flex items-center">
          <FiDollarSign className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ${(value || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer Since',
      accessor: 'createdAt',
      cell: (value) => (
        <div className="flex items-center">
          <FiCalendar className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(value).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const statusConfig = {
          active: { variant: 'success', icon: FiUserCheck },
          inactive: { variant: 'warning', icon: FiUserMinus },
          blocked: { variant: 'danger', icon: FiUserX },
        }
        const config = statusConfig[value] || statusConfig.inactive
        const Icon = config.icon
        
        return (
          <StatusBadge
            status={value}
            variant={config.variant}
            icon={Icon}
          />
        )
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditClick(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit customer"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCustomer(row)
              setShowDeleteConfirm(true)
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete customer"
          >
            <FiTrash2 className="w-4 h-4" />
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
                <button 
                  onClick={() => window.location.href = `mailto:${row.email}`}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
                >
                  <FiMail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
                {row.phone && (
                  <button 
                    onClick={() => window.location.href = `tel:${row.phone}`}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
                  >
                    <FiPhone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    // Handle add to VIP
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
                >
                  <FiStar className="w-4 h-4" />
                  <span>Add to VIP</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <button 
                  onClick={() => {
                    if (row.status !== 'blocked') {
                      handleBulkStatusUpdate('blocked')
                    }
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2"
                >
                  <FiUserX className="w-4 h-4" />
                  <span>Block Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

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
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiUsers className="w-4 h-4 mr-2" />
            {formMode ? (
              <span>{formMode === 'add' ? 'Add New Customer' : 'Edit Customer'}</span>
            ) : (
              <span>Manage your customer relationships and view insights</span>
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
                Back to Customers
              </Button>
            </motion.div>
          ) : (
            <>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FiUsers className="w-4 h-4" />
                </motion.button>
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

              {/* Add Customer Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddClick}
                  icon={FiPlus}
                  className="shadow-lg shadow-primary-500/30"
                >
                  Add Customer
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Customer Form */}
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
            <CustomerForm
              initialData={selectedCustomer}
              mode={formMode}
              onSubmit={formMode === 'add' ? handleAddSubmit : handleEditSubmit}
              onCancel={handleCancelForm}
              isSubmitting={formSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!formMode && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <StatCard
              title="Total Customers"
              value={stats.total}
              icon={FiUsers}
              color="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            <StatCard
              title="Active"
              value={stats.active}
              icon={FiUserCheck}
              color="from-green-500 to-emerald-500"
              subtitle={`${((stats.active / stats.total) * 100 || 0).toFixed(1)}% of total`}
              delay={0.2}
            />
            <StatCard
              title="Inactive"
              value={stats.inactive}
              icon={FiUserMinus}
              color="from-yellow-500 to-orange-500"
              delay={0.3}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={FiShoppingBag}
              color="from-purple-500 to-pink-500"
              delay={0.4}
            />
            <StatCard
              title="Total Spent"
              value={`$${stats.totalSpent.toFixed(2)}`}
              icon={FiDollarSign}
              color="from-indigo-500 to-purple-500"
              subtitle={`Avg: $${(stats.totalSpent / (stats.total || 1)).toFixed(2)}/customer`}
              delay={0.5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar - Hide when form is shown */}
      <AnimatePresence>
        {!formMode && selectedCustomers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedCustomers.length} customers selected
                </span>
                <button
                  onClick={() => setSelectedCustomers([])}
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
                      handleBulkStatusUpdate(e.target.value)
                    }
                  }}
                  options={[
                    { value: '', label: 'Bulk Actions' },
                    { value: 'active', label: 'Mark as Active' },
                    { value: 'inactive', label: 'Mark as Inactive' },
                    { value: 'blocked', label: 'Mark as Blocked' },
                  ]}
                  className="w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
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
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search customers by name, email, phone, or company..."
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        label="Status"
                        options={[
                          { value: '', label: 'All Statuses' },
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                          { value: 'blocked', label: 'Blocked' },
                        ]}
                        value={filters.status}
                        onChange={(e) => setFilters({ status: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customers Table/Grid - Hide when form is shown */}
      <AnimatePresence mode="wait">
        {!formMode && (
          <motion.div
            key="table"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7 }}
          >
            {customers?.length === 0 && !loading ? (
              <EmptyState
                icon={FiUsers}
                title="No customers found"
                description="Try adjusting your search or filters, or add your first customer."
                action={
                  <Button onClick={handleAddClick} icon={FiPlus}>
                    Add Customer
                  </Button>
                }
              />
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <Table columns={columns} data={customers} loading={loading} />
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalCustomers}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              </>
            )}
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
                  Delete {selectedCustomers.length > 1 ? 'Customers' : 'Customer'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedCustomers.length > 1 
                    ? `Are you sure you want to delete ${selectedCustomers.length} selected customers? This action cannot be undone.`
                    : `Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`
                  }
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setSelectedCustomer(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={selectedCustomers.length > 1 ? handleBulkDelete : () => handleDelete(selectedCustomer?.id)}
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

export default Customers