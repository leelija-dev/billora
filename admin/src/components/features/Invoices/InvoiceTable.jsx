import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiEye, 
  FiEdit2, 
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiPrinter,
  FiSlash,
  FiCreditCard,
  FiX,
} from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'
import { storeAPI } from '../../../services'


const InvoiceTable = ({ 
  invoices, 
  loading, 
  onView, 
  onEdit,
  onCancelInvoice,
  onPayDue,
  onPrintA4,
  onPrintThermal
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [stores, setStores] = useState({})
  const [storesLoading, setStoresLoading] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  
  // Cache for store data
  const storeCacheRef = useRef(new Map())
  const lastFetchTimeRef = useRef(null)
  const resizeTimeoutRef = useRef(null)
  const isFetchingRef = useRef(false)
  
  // Global resize lock - prevent ALL API calls during resize
  const globalResizeLockRef = useRef(false)
  
  // Handle resize events to prevent unnecessary API calls
  useEffect(() => {
    let resizeDebounce
    
    const handleResize = () => {
      // Set global lock immediately
      globalResizeLockRef.current = true
      
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      
      setIsResizing(true)
      
      // Set a longer debounce to ensure resize is completely finished
      resizeTimeoutRef.current = setTimeout(() => {
        setIsResizing(false)
        globalResizeLockRef.current = false // Release lock after resize
        console.log('Resize finished, API calls unlocked')
      }, 500) // Increased to 500ms for better protection
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize, { passive: true })
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      globalResizeLockRef.current = false // Ensure lock is released
    }
  }, [])

  // Fetch store data when invoices change (with enhanced caching and resize protection)
  useEffect(() => {
    const fetchStoreData = async () => {
      // Multiple layers of protection
      if (isResizing || globalResizeLockRef.current || isFetchingRef.current) {
        console.log('Skipping store fetch - resize locked or already fetching')
        return
      }
      
      const storeIds = [...new Set(invoices?.map(invoice => invoice.store_id).filter(Boolean))]
      
      if (storeIds.length === 0) {
        setStoresLoading(false)
        return
      }

      // Enhanced cache key with timestamp to ensure uniqueness
      const cacheKey = storeIds.sort().join(',')
      const now = Date.now()
      const cached = storeCacheRef.current.get(cacheKey)
      
      // Increased cache duration to 60 seconds (1 minute)
      if (cached && (now - cached.timestamp) < 60000) {
        console.log('Using cached store data (60s cache)')
        setStores(cached.data)
        setStoresLoading(false)
        return
      }

      // Prevent duplicate requests within 10 seconds (much longer cooldown)
      if (lastFetchTimeRef.current && (now - lastFetchTimeRef.current) < 10000) {
        console.log('Skipping duplicate store request (10s cooldown)')
        return
      }

      // Set fetching lock
      isFetchingRef.current = true
      setStoresLoading(true)
      lastFetchTimeRef.current = now
      
      try {
        // Group invoices by user_id to fetch stores efficiently
        const userStoreMap = {}
        storeIds.forEach(storeId => {
          const invoice = invoices.find(inv => inv.store_id === storeId)
          if (invoice && invoice.user_id) {
            if (!userStoreMap[invoice.user_id]) {
              userStoreMap[invoice.user_id] = []
            }
            userStoreMap[invoice.user_id].push(storeId)
          }
        })

        // Fetch stores for each user
        const storePromises = Object.entries(userStoreMap).map(async ([userId, storeIdsForUser]) => {
          try {
            const response = await storeAPI.getByUserId(userId)
            const storesArray = response.data?.data?.data || response.data?.data || []
            
            // Find specific stores we need
            const relevantStores = storesArray.filter(store => storeIdsForUser.includes(store.id))
            
            return relevantStores.reduce((acc, store) => {
              acc[store.id] = store
              return acc
            }, {})
          } catch (error) {
            console.error(`Failed to fetch stores for user ${userId}:`, error)
            return {}
          }
        })

        const storeResults = await Promise.all(storePromises)
        const allStores = storeResults.reduce((acc, stores) => ({ ...acc, ...stores }), {})
        
        // Cache the results with longer duration
        storeCacheRef.current.set(cacheKey, {
          data: allStores,
          timestamp: now
        })
        
        console.log('🏪 Fetched stores (new data):', allStores)
        setStores(allStores)
        setStoresLoading(false)
      } catch (error) {
        console.error('Failed to fetch store data:', error)
        setStoresLoading(false)
      } finally {
        // Always release the fetching lock
        isFetchingRef.current = false
      }
    }

    // Only fetch if we have invoices and no locks are active
    if (invoices && invoices.length > 0 && !isResizing && !globalResizeLockRef.current) {
      fetchStoreData()
    }
  }, [invoices, isResizing])

  const handlePrintClick = (invoice, e) => {
    e.stopPropagation()
    setSelectedInvoice(invoice)
    setPrintModalOpen(true)
  }

  const handlePrintA4Click = () => {
    if (selectedInvoice && onPrintA4) {
      onPrintA4(selectedInvoice)
    }
    setPrintModalOpen(false)
    setSelectedInvoice(null)
  }

  const handlePrintThermalClick = () => {
    if (selectedInvoice && onPrintThermal) {
      onPrintThermal(selectedInvoice)
    }
    setPrintModalOpen(false)
    setSelectedInvoice(null)
  }

  const closeModal = () => {
    setPrintModalOpen(false)
    setSelectedInvoice(null)
  }

  const getStatusConfig = (status) => {
    const configs = {
      completed: { variant: 'success', icon: FiCheckCircle, label: 'Completed' },
      paid: { variant: 'success', icon: FiCheckCircle, label: 'Paid' },
      unpaid: { variant: 'warning', icon: FiClock, label: 'Unpaid' },
      overdue: { variant: 'danger', icon: FiAlertCircle, label: 'Overdue' },
      draft: { variant: 'default', icon: FiFileText, label: 'Draft' },
      cancelled: { variant: 'default', icon: FiFileText, label: 'Cancelled' },
      refunded: { variant: 'info', icon: FiFileText, label: 'Refunded' },
    }
    return configs[status] || configs.unpaid
  }

  const columns = [
    {
      header: 'Invoice',
      accessor: 'id',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">#{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_id',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.customer_name || `Customer #${value}`}
          </p>
        </div>
      ),
    },
    {
      header: 'Store',
      accessor: 'store_id',
      cell: (value, row) => {
        const storeData = stores[value]
        
        if (storesLoading) {
          return (
            <div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          )
        }
        
        const storeName = storeData?.name || row.store_name || `Store #${value}`
        
        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {storeName}
            </p>
          </div>
        )
      },
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹{parseFloat(value || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      header: 'Paid Amount',
      accessor: 'paid_amount',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-green-600 dark:text-green-400">
            ₹{parseFloat(value || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      header: 'Due Amount',
      accessor: 'due_amount',
      cell: (value, row) => {
        const totalAmount = parseFloat(row.total_amount || 0)
        const paidAmount = parseFloat(row.paid_amount || 0)
        const dueAmount = totalAmount - paidAmount
        
        return (
          <div>
            <p className={`font-medium ${dueAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              ₹{dueAmount.toFixed(2)}
            </p>
          </div>
        )
      },
    },
    {
      header: 'Items',
      accessor: 'total_items',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value || 0} items</p>
          {row.invoice_items && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.invoice_items.length} products
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => {
        const dueAmount = Math.max(
          0,
          parseFloat(row.total_amount || 0) - parseFloat(row.paid_amount || 0)
        )
        const isCancelled = row.status === 'cancelled'
        const canPayDue = !isCancelled && dueAmount > 0.001

        return (
        <div className="flex flex-wrap items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onView(row)
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View invoice"
            type="button"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: isCancelled ? 1 : 1.1 }}
            whileTap={{ scale: isCancelled ? 1 : 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              if (!isCancelled && onEdit) onEdit(row)
            }}
            disabled={isCancelled}
            className={`p-1.5 rounded-lg transition-colors ${
              isCancelled
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
            }`}
            title={isCancelled ? 'Cannot edit cancelled invoice' : 'Edit invoice'}
            type="button"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: !canPayDue ? 1 : 1.1 }}
            whileTap={{ scale: !canPayDue ? 1 : 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              if (canPayDue && onPayDue) onPayDue(row)
            }}
            disabled={!canPayDue}
            className={`p-1.5 rounded-lg transition-colors ${
              !canPayDue
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20'
            }`}
            title={!canPayDue ? 'No due to pay' : 'Pay due on this invoice'}
            type="button"
          >
            <FiCreditCard className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: isCancelled ? 1 : 1.1 }}
            whileTap={{ scale: isCancelled ? 1 : 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              if (!isCancelled && onCancelInvoice) onCancelInvoice(row)
            }}
            disabled={isCancelled}
            className={`p-1.5 rounded-lg transition-colors ${
              isCancelled
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
            }`}
            title={isCancelled ? 'Already cancelled' : 'Cancel invoice'}
            type="button"
          >
            <FiSlash className="w-4 h-4" />
          </motion.button>

          {/* Print Button - Opens Modal */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handlePrintClick(row, e)}
            className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Print invoice"
            type="button"
          >
            <FiPrinter className="w-4 h-4" />
          </motion.button>
        </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const config = getStatusConfig(value)
        return (
          <StatusBadge
            status={config.label}
            variant={config.variant}
            icon={config.icon}
          />
        )
      },
    }
    
  ]

  return (
    <>
      <Table 
        columns={columns} 
        data={invoices} 
        loading={loading}
        onRowClick={onView}
        className="cursor-pointer"
      />

      {/* Print Options Modal */}
      <AnimatePresence>
        {printModalOpen && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiPrinter className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Print Invoice
                </motion.h3>
                
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Invoice #{selectedInvoice.id}
                  <br />
                  <span className="text-sm mt-1 block">
                    Total Amount: ₹{parseFloat(selectedInvoice.total_amount || 0).toFixed(2)}
                  </span>
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePrintA4Click}
                      className="w-full py-3 text-lg"
                      icon={FiPrinter}
                    >
                      A4 Print
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePrintThermalClick}
                      variant="outline"
                      className="w-full py-3 text-lg"
                      icon={FiPrinter}
                    >
                      3" Thermal Print
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default InvoiceTable