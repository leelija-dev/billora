import React, { useEffect, useState } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 
  FiPackage,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGrid,
  FiList,
  FiEye,
  FiCopy,
  FiArchive,
  FiUpload,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import StoreForm from '../../components/features/Stores/StoreForm'
import useStoreStore from '../../store/storeStore'
import { useAuthStore } from '../../store/authStore'

const Stores = () => {
  const { user } = useAuthStore()
  const {
    stores,
    totalStores,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    getEditData,
    setFilters,
  } = useStoreStore()

  // Ensure stores is an array
  const safeStores = Array.isArray(stores) ? stores : []
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedStores, setSelectedStores] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Get current user ID from auth store
  const getUserId = () => {
    // First try to get user from auth store (most reliable)
    if (user && user.id) {
      return user.id.toString()
    }
    
    // Fallback to localStorage if auth store is not available
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        const userId = parsed.state?.user?.id || parsed.user?.id
        return userId ? userId.toString() : '1'
      } catch (error) {
        console.error('Error parsing auth storage:', error)
        return '1'
      }
    }
    
    // Last fallback - try old auth key
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        return parsed.user?.id || parsed.userId || '1'
      } catch {
        return '1'
      }
    }
    
    console.warn('No user found in auth store or localStorage, using fallback')
    return '1'
  }

  const currentUserId = getUserId()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching stores for user:', currentUserId)
        await fetchStores(currentUserId)
        console.log('✅ Stores fetched successfully')
      } catch (error) {
        console.error('❌ Failed to fetch stores:', error)
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
  }, [searchTerm])

  const handleAddStore = () => {
    setShowAddForm(true)
    setShowEditForm(false)
    setSelectedStore(null)
  }

  const handleEditStore = async (store) => {
    try {
      const editData = await getEditData(currentUserId)
      setSelectedStore(editData.data || store)
      setShowEditForm(true)
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to fetch edit data:', error)
      setSelectedStore(store)
      setShowEditForm(true)
      setShowAddForm(false)
    }
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedStore(null)
  }

  const handleSubmitStore = async (storeData) => {
    setFormSubmitting(true)
    try {
      if (showEditForm && selectedStore) {
        await updateStore(selectedStore.id, storeData)
        console.log('✅ Store updated successfully')
      } else {
        await createStore(storeData)
        console.log('✅ Store created successfully')
      }
      // Refresh the store list
      await fetchStores(currentUserId)
      // Hide the form
      handleCancelForm()
    } catch (error) {
      console.error(`Error ${showEditForm ? 'updating' : 'creating'} store:`, error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      await deleteStore(id)
      await fetchStores(currentUserId)
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedStores.length} stores?`)) {
      // Implement bulk delete
      for (const id of selectedStores) {
        await deleteStore(id)
      }
      setSelectedStores([])
      setShowDeleteConfirm(false)
      await fetchStores(currentUserId)
    }
  }

  const handlePageChange = (page) => {
    fetchStores(currentUserId, { ...filters, page })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStores(currentUserId)
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', status: '', type: '' })
    fetchStores(currentUserId)
  }

  const toggleStoreSelection = (storeId) => {
    setSelectedStores(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    )
  }

  const selectAllStores = () => {
    if (selectedStores.length === safeStores.length) {
      setSelectedStores([])
    } else {
      setSelectedStores(safeStores.map(s => s.id))
    }
  }

  // Helper function to get status display
  const getStatusDisplay = (store) => {
    const isActive = store.status === true || store.status === 'active' || store.status === 1
    return {
      active: isActive,
      text: isActive ? 'Active' : 'Inactive',
      variant: isActive ? 'success' : 'default'
    }
  }

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedStores.length === safeStores.length && safeStores.length > 0}
            onChange={selectAllStores}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedStores.includes(row.id)}
          onChange={() => toggleStoreSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Store',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">GST: {row.gst || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'email',
      cell: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <FiMail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{value || 'N/A'}</span>
          </div>
          {row.mobile && (
            <div className="flex items-center space-x-2 text-sm">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{row.mobile}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'address',
      cell: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-start space-x-2 text-sm">
            <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-gray-600 dark:text-gray-400">{value || 'N/A'}</div>
              <div className="text-gray-500 dark:text-gray-500">{row.city || 'N/A'}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const isActive = value === true || value === 'active' || value === 1
        return (
          <StatusBadge
            status={isActive ? 'active' : 'inactive'}
            variant={isActive ? 'success' : 'default'}
          />
        )
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditStore(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit store"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(value)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete store"
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
            
            {/* Quick actions dropdown */}
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-1">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiEye className="w-4 h-4" />
                  <span>View details</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiCopy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiArchive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading store data...
        </p>
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6 min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header with Gradient */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Stores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            Manage your store/shop information and settings
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Only show these buttons when not in form mode */}
          {!showAddForm && !showEditForm && (
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
                  <FiList className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
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

              {/* Import Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiUpload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </>
          )}

          {/* Add Store Button or Back Button */}
          {!showAddForm && !showEditForm && safeStores.length === 0 ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleAddStore}
                icon={FiPlus}
                className="shadow-lg shadow-primary-500/30"
              >
                Add Store
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
             
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Conditional rendering: Show form or table/search */}
      {showAddForm || showEditForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <StoreForm
            store={selectedStore}
            onSubmit={handleSubmitStore}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
            isEdit={showEditForm}
          />
        </motion.div>
      ) : (
        <>
          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedStores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {selectedStores.length} store{selectedStores.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => setSelectedStores([])}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Selected
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                    >
                      Bulk Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            {initialLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search stores by name, email, or city..."
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
                    {(filters.status || filters.type) && (
                      <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </motion.button>

                  {(searchTerm || filters.status || filters.type) && (
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
            )}

            {!initialLoading && (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          label="Status"
                          options={[
                            { value: '', label: 'All Status' },
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                          ]}
                          value={filters.status || ''}
                          onChange={(e) => {
                            setFilters({ status: e.target.value })
                            fetchStores(currentUserId)
                          }}
                        />
                        <Select
                          label="Store Type"
                          options={[
                            { value: '', label: 'All Types' },
                            { value: 'retail', label: 'Retail' },
                            { value: 'warehouse', label: 'Warehouse' },
                            { value: 'online', label: 'Online' },
                          ]}
                          value={filters.type || ''}
                          onChange={(e) => {
                            setFilters({ type: e.target.value })
                            fetchStores(currentUserId)
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Stores Display */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {initialLoading ? (
              <SkeletonLoader />
            ) : loading && !initialLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Updating store data...
                  </p>
                </div>
              </div>
            ) : safeStores.length > 0 ? (
              viewMode === 'table' ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                      columns={columns}
                      data={safeStores}
                      loading={loading}
                    />
                  </div>
                  {totalStores > pageSize && (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalStores}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                // Grid View
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {safeStores.map((store, index) => {
                      const status = getStatusDisplay(store)
                      return (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                        >
                          {/* Store Header */}
                          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                  <FiPackage className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white text-lg">
                                    {store.name}
                                  </h3>
                                  <p className="text-white/80 text-sm">GST: {store.gst || 'N/A'}</p>
                                </div>
                              </div>
                              <StatusBadge
                                status={status.active ? 'active' : 'inactive'}
                                variant={status.active ? 'success' : 'default'}
                                size="sm"
                              />
                            </div>
                            
                            {/* Quick Actions Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEditStore(store)}
                                className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(store.id)}
                                className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50"
                              >
                                <FiEye className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Store Info */}
                          <div className="p-4 space-y-3">
                            {/* Contact */}
                            <div className="space-y-2">
                              {store.email && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <FiMail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400 truncate">
                                    {store.email}
                                  </span>
                                </div>
                              )}
                              {store.mobile && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <FiPhone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {store.mobile}
                                  </span>
                                </div>
                              )}
                              {(store.address || store.city) && (
                                <div className="flex items-start space-x-2 text-sm">
                                  <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <div className="text-gray-600 dark:text-gray-400">
                                    {store.address && <div>{store.address}</div>}
                                    {store.city && <div className="text-gray-500">{store.city}</div>}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Additional Info */}
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {store.created_at ? new Date(store.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  {totalStores > pageSize && (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalStores}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )
            ) : (
              <EmptyState
                icon={FiPackage}
                title="No stores yet"
                description={searchTerm ? "No stores match your search criteria" : "Get started by adding your first store to manage your business locations"}
                action={
                  !searchTerm && safeStores.length === 0 && (
                    <Button 
                      onClick={handleAddStore}
                      icon={FiPlus}
                      size="lg"
                    >
                      Add Your First Store
                    </Button>
                  )
                }
              />
            )}
          </motion.div>
        </>
      )}

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
                  Delete {selectedStores.length > 1 ? 'Stores' : 'Store'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {selectedStores.length} selected {selectedStores.length === 1 ? 'store' : 'stores'}? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleBulkDelete}
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

export default Stores