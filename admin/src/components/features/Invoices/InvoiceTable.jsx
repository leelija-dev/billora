import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiEye, 
  FiDownload, 
  FiEdit2, 
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiPrinter,
  FiChevronDown
} from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import { storeAPI } from '../../../services'


const InvoiceTable = ({ 
  invoices, 
  loading, 
  onView, 
  onDownload,
  onEdit,
  onMarkPaid,
  onPrintA4,
  onPrintThermal
}) => {
  const [printDropdown, setPrintDropdown] = useState(null)
  const [stores, setStores] = useState({})
  const [storesLoading, setStoresLoading] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  const dropdownRef = useRef(null)
  
  // Cache for store data
  const storeCacheRef = useRef(new Map())
  const lastFetchTimeRef = useRef(null)
  
  // Handle resize events to prevent unnecessary API calls
  useEffect(() => {
    let resizeTimeout
    
    const handleResizeStart = () => {
      setIsResizing(true)
      clearTimeout(resizeTimeout)
    }
    
    const handleResizeEnd = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setIsResizing(false)
      }, 150) // Wait for resize to finish
    }
    
    window.addEventListener('resize', handleResizeStart)
    window.addEventListener('resize', handleResizeEnd)
    
    return () => {
      window.removeEventListener('resize', handleResizeStart)
      window.removeEventListener('resize', handleResizeEnd)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Fetch store data when invoices change (with caching and resize protection)
  useEffect(() => {
    const fetchStoreData = async () => {
      // Skip if currently resizing
      if (isResizing) {
        console.log('Skipping store fetch during resize')
        return
      }
      
      const storeIds = [...new Set(invoices?.map(invoice => invoice.store_id).filter(Boolean))]
      
      if (storeIds.length === 0) {
        setStoresLoading(false)
        return
      }

      // Check cache first
      const cacheKey = storeIds.sort().join(',')
      const now = Date.now()
      const cached = storeCacheRef.current.get(cacheKey)
      
      if (cached && (now - cached.timestamp) < 10000) { // 10 seconds cache
        console.log('Using cached store data')
        setStores(cached.data)
        setStoresLoading(false)
        return
      }

      // Prevent duplicate requests within 2 seconds
      if (lastFetchTimeRef.current && (now - lastFetchTimeRef.current) < 2000) {
        console.log('Skipping duplicate store request')
        return
      }

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
        
        // Cache the results
        storeCacheRef.current.set(cacheKey, {
          data: allStores,
          timestamp: now
        })
        
        console.log('🏪 Fetched stores:', allStores)
        setStores(allStores)
        setStoresLoading(false)
      } catch (error) {
        console.error('Failed to fetch store data:', error)
        setStoresLoading(false)
      }
    }

    if (invoices && invoices.length > 0 && !isResizing) {
      fetchStoreData()
    }
  }, [invoices, isResizing])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPrintDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ID: #{value}
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: #{value}
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Paid: ₹{parseFloat(row.paid_amount || 0).toFixed(2)}
          </p>
        </div>
      ),
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
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Invoice"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(row)}
            className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Edit Invoice"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>

          {/* Print Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPrintDropdown(printDropdown === row.id ? null : row.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Print Invoice"
            >
              <FiPrinter className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {printDropdown === row.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="py-1">
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onPrintA4(row)
                        setPrintDropdown(null)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <FiPrinter className="w-4 h-4" />
                      <span>A4 Print</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onPrintThermal(row)
                        setPrintDropdown(null)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <FiPrinter className="w-4 h-4" />
                      <span>3" Thermal Print</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Table 
      columns={columns} 
      data={invoices} 
      loading={loading}
      onRowClick={onView}
      className="cursor-pointer"
    />
  )
}

export default InvoiceTable