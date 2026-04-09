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
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import BrandForm from '../../components/features/Brands/BrandForm'
import useBrandStore from '../../store/brandStore'
import Select from '../../components/common/Select/Select'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import { useAuthStore } from '../../store/authStore'

const Brands = () => {
  const { user } = useAuthStore()
  const {
    brands,
    totalBrands,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    setFilters,
  } = useBrandStore()

  // Ensure brands is an array
  const safeBrands = Array.isArray(brands) ? brands : []
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('table')
  const [selectedBrands, setSelectedBrands] = useState([])
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
        console.log('🔄 Fetching brands for user:', currentUserId)
        await fetchBrands()
        console.log('✅ Brands fetched successfully')
      } catch (error) {
        console.error('❌ Failed to fetch brands:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, []) // Remove fetchBrands from dependency array

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
      // Remove manual fetch here - let setFilters handle it
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm]) // Remove setFilters, fetchBrands, and other dependencies

  const handleAddBrand = () => {
    setShowAddForm(true)
    setShowEditForm(false)
    setSelectedBrand(null)
  }

  const handleEditBrand = async (brand) => {
    try {
      console.log('🏷️ Editing brand:', brand)
      console.log('🏷️ Brand ID:', brand.id)
      console.log('🏷️ Brand name:', brand.name)
      console.log('🏷️ Brand is_active:', brand.is_active)
      // Set the brand data directly from the table row
      setSelectedBrand(brand)
      setShowEditForm(true)
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to set brand for editing:', error)
    }
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedBrand(null)
  }

  const handleSubmitBrand = async (brandData) => {
    setFormSubmitting(true)
    try {
      if (showEditForm && selectedBrand) {
        await updateBrand(selectedBrand.id, brandData)
        console.log('✅ Brand updated successfully')
      } else {
        await createBrand(brandData)
        console.log('✅ Brand created successfully')
      }
      
      // Hide form - the store already updates local state immediately
      handleCancelForm()
      
      // Force a small re-render by updating a dummy state
      setTimeout(() => {
        // This ensures the UI reflects the changes
        const { brands } = useBrandStore.getState()
        console.log('📊 Brands after operation:', brands)
      }, 100)
      
    } catch (error) {
      console.error(`Error ${showEditForm ? 'updating' : 'creating'} brand:`, error)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(id)
      
      // Force a small re-render to ensure UI reflects changes
      setTimeout(() => {
        const { brands } = useBrandStore.getState()
        console.log('📊 Brands after deletion:', brands)
      }, 100)
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBrands.length} brands?`)) {
      for (const id of selectedBrands) {
        await deleteBrand(id)
      }
      setSelectedBrands([])
      setShowDeleteConfirm(false)
      
      // Force a small re-render to ensure UI reflects changes
      setTimeout(() => {
        const { brands } = useBrandStore.getState()
        console.log('📊 Brands after bulk deletion:', brands)
      }, 100)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBrands()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '' })
  }

  const toggleBrandSelection = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const selectAllBrands = () => {
    if (selectedBrands.length === safeBrands.length) {
      setSelectedBrands([])
    } else {
      setSelectedBrands(safeBrands.map(b => b.id))
    }
  }

  // Helper function to get status display
  const getStatusDisplay = (brand) => {
    const isActive = brand.is_active === true || brand.is_active === 1
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
            checked={selectedBrands.length === safeBrands.length && safeBrands.length > 0}
            onChange={selectAllBrands}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedBrands.includes(row.id)}
          onChange={() => toggleBrandSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Brand',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {row.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (value) => (
        <span className="text-gray-600 dark:text-gray-400">
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      cell: (value) => {
        const isActive = value === true || value === 1
        return (
          <StatusBadge
            status={isActive ? 'active' : 'inactive'}
            variant={isActive ? 'success' : 'default'}
          />
        )
      },
    },
    {
      header: 'Created By',
      accessor: 'created_by',
      cell: (value) => (
        <span className="text-gray-600 dark:text-gray-400">
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEditBrand(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedBrand(row)
              setShowDeleteConfirm(true)
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
          
          
        </div>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
            Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            {showAddForm || showEditForm ? (
              <span>{showEditForm ? 'Edit Brand' : 'Add New Brand'}</span>
            ) : (
              <span>Manage product brands for your inventory</span>
            )}
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
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleRefresh}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Import Button */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiUpload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </>
          )}

          {/* Add Brand Button or Back Button */}
          {!showAddForm && !showEditForm ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                onClick={handleAddBrand}
                icon={FiPlus}
                className="shadow-lg shadow-primary-500/30"
              >
                Add Brand
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                variant="outline"
                onClick={handleCancelForm}
                icon={FiArrowLeft}
              >
                Back to Brands
              </Button>
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          
          <BrandForm
            initialData={selectedBrand}
            mode={showEditForm ? 'edit' : 'add'}
            onSubmit={handleSubmitBrand}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
          />
        </motion.div>
      ) : (
        <>
          {/* Search and Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            {initialLoading ? (
              // Loading skeleton for search
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
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search brands by name, description..."
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
                    </motion.button>
                    
                    {(searchTerm) && (
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
              </>
            )}
          </motion.div>

          {/* Brands Display */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            {initialLoading ? (
              // Loading skeleton for table
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading brands...
                  </p>
                </div>
              </div>
            ) : safeBrands.length === 0 ? (
              <EmptyState
                icon={FiPackage}
                title="No brands found"
                description={searchTerm ? "No brands match your search criteria" : "Get started by adding your first brand"}
                action={
                  !searchTerm && (
                    <Button onClick={handleAddBrand} icon={FiPlus}>
                      Add Your First Brand
                    </Button>
                  )
                }
              />
            ) : viewMode === 'table' ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Table
                  columns={columns}
                  data={safeBrands}
                  loading={loading}
                />
              </div>
            ) : (
              // Grid View
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {safeBrands.map((brand, index) => {
                    const status = getStatusDisplay(brand)
                    return (
                      <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                      >
                        {/* Brand Header */}
                        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-600">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <FiPackage className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  {brand.name}
                                </h3>
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
                              onClick={() => handleEditBrand(brand)}
                              className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedBrand(brand)
                                setShowDeleteConfirm(true)
                              }}
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

                        {/* Brand Info */}
                        <div className="p-4 space-y-3">
                          {/* Description */}
                          {brand.description && (
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {brand.description}
                              </div>
                            </div>
                          )}
                          
                          {/* Additional Info */}
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Created By:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {brand.created_by || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </>
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Brand
                </h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{selectedBrand?.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDelete(selectedBrand?.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Brand
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Brands
