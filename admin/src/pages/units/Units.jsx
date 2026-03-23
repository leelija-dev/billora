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
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import UnitForm from '../../components/features/Units/UnitForm'
import useUnitStore from '../../store/unitStore'

const Units = () => {
  const {
    units,
    totalUnits,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    setFilters,
  } = useUnitStore()

  // Ensure units is an array
  const safeUnits = Array.isArray(units) ? units : []

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [refreshing, setRefreshing] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUnits()
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, []) // Remove fetchUnits from dependency array

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleAddClick = () => {
    setShowAddForm(true)
  }

  const handleEditClick = (unit) => {
    setSelectedUnit(unit)
    setShowEditForm(true)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedUnit(null)
  }

  const handleSubmitUnit = async (unitData) => {
    setFormSubmitting(true)
    try {
      if (showEditForm && selectedUnit) {
        await updateUnit(selectedUnit.id, unitData)
      } else {
        await createUnit(unitData)
      }
      // Refresh the unit list
      await fetchUnits()
      // Hide the form
      handleCancelForm()
    } catch (error) {
      console.error('Error saving unit:', error)
      // Handle error (show toast notification, etc.)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUnit(id)
      setShowDeleteConfirm(false)
      setSelectedUnit(null)
      fetchUnits(currentPage)
    } catch (error) {
      console.error('Failed to delete unit:', error)
    }
  }

  const handlePageChange = (page) => {
    setPageLoading(true)
    fetchUnits(page).finally(() => {
      setPageLoading(false)
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUnits()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '' })
  }

  const columns = [
    {
      header: 'Unit Code',
      accessor: 'code',
      cell: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Unit Name',
      accessor: 'name',
      cell: (value) => (
        <span className="text-gray-700 dark:text-gray-300">
          {value || '-'}
        </span>
      ),
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
              setSelectedUnit(row)
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
            Units
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            {showAddForm || showEditForm ? (
              <span>{showEditForm ? 'Edit Unit' : 'Add New Unit'}</span>
            ) : (
              <span>Manage measurement units for your products</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Only show these buttons when not in form mode */}
          {!showAddForm && !showEditForm && (
            <>
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
            </>
          )}

          {/* Add Unit Button or Back Button */}
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
                Add Unit
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
                Back to Units
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
            {showEditForm ? 'Edit Unit' : 'Add New Unit'}
          </h2>
          <UnitForm
            initialData={selectedUnit}
            onSubmit={handleSubmitUnit}
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
                      placeholder="Search units by code, name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
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

          {/* Units Table */}
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
                    {pageLoading ? 'Loading units...' : 'Loading...'}
                  </p>
                </div>
              </div>
            ) : safeUnits.length === 0 ? (
              <EmptyState
                icon={FiPackage}
                title="No units found"
                description={searchTerm ? "No units match your search criteria" : "Get started by adding your first unit"}
                action={
                  !searchTerm && (
                    <Button onClick={handleAddClick} icon={FiPlus}>
                      Add Your First Unit
                    </Button>
                  )
                }
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Table
                  columns={columns}
                  data={safeUnits}
                  loading={loading}
                />
                
                {/* Pagination */}
                {totalUnits > pageSize && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalUnits}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </div>
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
                  Delete Unit
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{selectedUnit?.name || selectedUnit?.code}"? This action cannot be undone.
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
                      onClick={() => handleDelete(selectedUnit?.id)}
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

export default Units
