import React, { useEffect, useState } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 

  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import {FaFileMedical} from 'react-icons/fa'

import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import MedicineTypeForm from '../../components/features/MedicineTypes/MedicineTypeForm'
import useMedicineTypeStore from '../../store/medicineTypeStore'
import { useAuthStore } from '../../store/authStore'

const MedicineTypes = () => {
  const { user } = useAuthStore()
  const {
    medicineTypes,
    loading,
    error,
    fetchMedicineTypes,
    createMedicineType,
    updateMedicineType,
    deleteMedicineType,
    clearError,
  } = useMedicineTypeStore()

  // Ensure medicineTypes is an array
  const safeMedicineTypes = Array.isArray(medicineTypes) ? medicineTypes : []
  
  // Debug: Log medicine types data
  console.log('Medicine types from store:', medicineTypes)
  console.log('SafeMedicineTypes:', safeMedicineTypes)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedMedicineType, setSelectedMedicineType] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          await fetchMedicineTypes(user.id)
        } catch (error) {
          console.error('Failed to fetch medicine types:', error)
        } finally {
          setInitialLoading(false)
        }
      }
    }
    fetchData()
  }, [user?.id])

  // Filter medicine types based on search term
  const filteredMedicineTypes = safeMedicineTypes.filter(medicineType =>
    medicineType.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setShowAddForm(true)
    clearError()
  }

  const handleEditClick = (medicineType) => {
    setSelectedMedicineType(medicineType)
    setShowEditForm(true)
    clearError()
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedMedicineType(null)
    clearError()
  }

  const handleSubmitMedicineType = async (medicineTypeData) => {
    setFormSubmitting(true)
    try {
      const dataWithUser = {
        ...medicineTypeData,
        user_id: user.id
      }
      
      if (showEditForm && selectedMedicineType) {
        await updateMedicineType(selectedMedicineType.id, dataWithUser)
      } else {
        await createMedicineType(dataWithUser)
      }
      
      // Refresh the medicine types list
      await fetchMedicineTypes(user.id)
      // Hide the form
      handleCancelForm()
    } catch (error) {
      console.error('Error saving medicine type:', error)
      // Error is handled by the store and displayed in the form
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMedicineType(id)
      setShowDeleteConfirm(false)
      setSelectedMedicineType(null)
      // Refresh the list
      await fetchMedicineTypes(user.id)
    } catch (error) {
      console.error('Failed to delete medicine type:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchMedicineTypes(user.id)
    } catch (error) {
      console.error('Failed to refresh medicine types:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const columns = [
    {
      header: 'Medicine Type Name',
      accessor: 'name',
      cell: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Created Date',
      accessor: 'created_at',
      cell: (value) => (
        <span className="text-gray-600 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString() : '-'}
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
              setSelectedMedicineType(row)
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
            Medicine Types
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FaFileMedical className="w-4 h-4 mr-2" />
            {showAddForm || showEditForm ? (
              <span>{showEditForm ? 'Edit Medicine Type' : 'Add New Medicine Type'}</span>
            ) : (
              <span>Manage medicine types for your products</span>
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

          {/* Add Medicine Type Button or Back Button */}
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
                Add Medicine Type
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
                Back to Medicine Types
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
            {showEditForm ? 'Edit Medicine Type' : 'Add New Medicine Type'}
          </h2>
          <MedicineTypeForm
            initialData={selectedMedicineType}
            onSubmit={handleSubmitMedicineType}
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
                      placeholder="Search medicine types by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {searchTerm && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={clearSearch}
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

          {/* Medicine Types Table */}
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
                    Loading medicine types...
                  </p>
                </div>
              </div>
            ) : filteredMedicineTypes.length === 0 ? (
              <EmptyState
                icon={FaFileMedical}
                title="No medicine types found"
                description={searchTerm ? "No medicine types match your search criteria" : "Get started by adding your first medicine type"}
                action={
                  !searchTerm && (
                    <Button onClick={handleAddClick} icon={FiPlus}>
                      Add Your First Medicine Type
                    </Button>
                  )
                }
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Table
                  columns={columns}
                  data={filteredMedicineTypes}
                  loading={loading}
                />
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
                  Delete Medicine Type
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{selectedMedicineType?.name}"? This action cannot be undone.
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
                      onClick={() => handleDelete(selectedMedicineType?.id)}
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

export default MedicineTypes
