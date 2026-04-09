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
import CategoryForm from '../../components/features/Categories/CategoryForm'
import useCategoryStore from '../../store/categoryStore'
import Select from '../../components/common/Select/Select'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'

const Categories = () => {
  const {
    categories,
    totalCategories,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setFilters,
  } = useCategoryStore()

  // Ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : []
  
  // Debug: Log categories data
  console.log('Categories from store:', categories)
  console.log('SafeCategories:', safeCategories)
  console.log('TotalCategories:', totalCategories)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [refreshing, setRefreshing] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const [viewMode, setViewMode] = useState('table')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories()
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, [fetchCategories]) 

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters]) 

  const handleAddClick = () => {
    setShowAddForm(true)
  }

  const handleEditClick = (category) => {
    // Ensure category data is properly formatted for the form
    const formattedCategory = {
      ...category,
      is_active: category.is_active === 1 || category.is_active === true ? 1 : 0
    }
    setSelectedCategory(formattedCategory)
    setShowEditForm(true)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedCategory(null)
  }

  const handleSubmitCategory = async (categoryData) => {
    setFormSubmitting(true)
    try {
      // Ensure is_active is a number before sending to API
      const dataToSubmit = {
        ...categoryData,
        is_active: categoryData.is_active === 1 || categoryData.is_active === true ? 1 : 0
      }
      
      if (showEditForm && selectedCategory) {
        await updateCategory(selectedCategory.id, dataToSubmit)
      } else {
        await createCategory(dataToSubmit)
      }
      // Refresh the category list
      await fetchCategories()
      // Hide the form
      handleCancelForm()
    } catch (error) {
      console.error('Error saving category:', error)
      // Handle error (show toast notification, etc.)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      setShowDeleteConfirm(false)
      setSelectedCategory(null)
      fetchCategories(currentPage)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handlePageChange = (page) => {
    setPageLoading(true)
    fetchCategories(page).finally(() => {
      setPageLoading(false)
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCategories()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '' })
  }

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const selectAllCategories = () => {
    if (selectedCategories.length === safeCategories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(safeCategories.map(c => c.id))
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
      try {
        for (const id of selectedCategories) {
          await deleteCategory(id)
        }
        setSelectedCategories([])
        setShowDeleteConfirm(false)
        await fetchCategories()
      } catch (error) {
        console.error('Failed to delete categories:', error)
      }
    }
  }

  // Helper function to get status display
  const getStatusDisplay = (category) => {
    const isActive = category.is_active === true || category.is_active === 1
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
            checked={selectedCategories.length === safeCategories.length && safeCategories.length > 0}
            onChange={selectAllCategories}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedCategories.includes(row.id)}
          onChange={() => toggleCategorySelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Category',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
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
            onClick={() => handleEditClick(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedCategory(row)
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
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            {showAddForm || showEditForm ? (
              <span>{showEditForm ? 'Edit Category' : 'Add New Category'}</span>
            ) : (
              <span>Manage product categories for your inventory</span>
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

          {/* Add Category Button or Back Button */}
          {!showAddForm && !showEditForm ? (
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
                Add Category
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
                Back to Categories
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {showEditForm ? 'Edit Category' : 'Add New Category'}
          </h2>
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={handleSubmitCategory}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
          />
        </motion.div>
      ) : (
        <>
          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'} selected
                    </span>
                    <button
                      onClick={() => setSelectedCategories([])}
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
                      placeholder="Search categories by name, description..."
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
                                fetchCategories()
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </>
            )}
          </motion.div>

          {/* Categories Display */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
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
                    {pageLoading ? 'Loading categories...' : 'Loading...'}
                  </p>
                </div>
              </div>
            ) : safeCategories.length === 0 ? (
              <EmptyState
                icon={FiPackage}
                title="No categories found"
                description={searchTerm ? "No categories match your search criteria" : "Get started by adding your first category"}
                action={
                  !searchTerm && (
                    <Button onClick={handleAddClick} icon={FiPlus}>
                      Add Your First Category
                    </Button>
                  )
                }
              />
            ) : viewMode === 'table' ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Table
                  columns={columns}
                  data={safeCategories}
                  loading={loading}
                />
                
                {/* Pagination */}
                {totalCategories > pageSize && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalCategories}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </div>
            ) : (
              // Grid View
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {safeCategories.map((category, index) => {
                    const status = getStatusDisplay(category)
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                      >
                        {/* Category Header */}
                        <div className="relative h-32 bg-gradient-to-r from-green-500 to-emerald-600">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <FiPackage className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  {category.name}
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
                              onClick={() => handleEditClick(category)}
                              className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedCategory(category)
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

                        {/* Category Info */}
                        <div className="p-4 space-y-3">
                          {/* Description */}
                          {category.description && (
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {category.description}
                              </div>
                            </div>
                          )}
                          
                          {/* Additional Info */}
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Created By:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {category.created_by || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                {totalCategories > pageSize && (
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalCategories}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                )}
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
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Category
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(selectedCategory?.id)}
                    >
                      Delete
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Categories