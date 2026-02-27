import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiPackage,
  FiArrowLeft,
  FiRefreshCw,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiMoreVertical,
  FiEdit,
  FiX,
  FiCheck,
  FiInfo,
  FiArrowRight,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useInventoryStore } from '../../store/inventoryStore'
import { useProductStore } from '../../store/productStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import DatePicker from '../../components/common/DatePicker/DatePicker'
import Select from '../../components/common/Select/Select'

const Inventory = () => {
  const {
    stockLogs,
    totalLogs,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchStockLogs,
    addStock,
    removeStock,
    setFilters,
  } = useInventoryStore()

  const { products, fetchProducts } = useProductStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRemoveForm, setShowRemoveForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('today')
  const [selectedLogs, setSelectedLogs] = useState([])

  useEffect(() => {
    fetchStockLogs()
    fetchProducts()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) return
    
    await addStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    })
    
    handleCancelForm()
    fetchStockLogs()
  }

  const handleRemoveStock = async () => {
    if (!selectedProduct || !quantity) return
    
    await removeStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    })
    
    handleCancelForm()
    fetchStockLogs()
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowRemoveForm(false)
    setSelectedProduct(null)
    setQuantity('')
    setNotes('')
  }

  const handlePageChange = (page) => {
    fetchStockLogs(page)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStockLogs()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', type: '', dateFrom: '', dateTo: '' })
  }

  const toggleLogSelection = (logId) => {
    setSelectedLogs(prev =>
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    )
  }

  // Calculate stats
  const stats = {
    totalMovements: stockLogs?.length || 0,
    stockIn: stockLogs?.filter(l => l.type === 'IN').length || 0,
    stockOut: stockLogs?.filter(l => l.type === 'OUT').length || 0,
    totalQuantity: stockLogs?.reduce((sum, l) => 
      l.type === 'IN' ? sum + l.quantity : sum - l.quantity, 0) || 0,
  }

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedLogs.length === stockLogs?.length && stockLogs?.length > 0}
            onChange={() => {
              if (selectedLogs.length === stockLogs?.length) {
                setSelectedLogs([])
              } else {
                setSelectedLogs(stockLogs?.map(l => l.id) || [])
              }
            }}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedLogs.includes(row.id)}
          onChange={() => toggleLogSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      cell: (value) => (
        <div className="flex items-center">
          <FiClock className="w-3 h-3 mr-2 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(value).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Product',
      accessor: 'productName',
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
            <FiPackage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {row.productSku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (value) => (
        <StatusBadge
          status={value === 'IN' ? 'Stock In' : 'Stock Out'}
          variant={value === 'IN' ? 'success' : 'danger'}
          icon={value === 'IN' ? FiTrendingUp : FiTrendingDown}
        />
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value, row) => (
        <div className="flex items-center">
          <span className={`text-lg font-semibold ${
            row.type === 'IN' ? 'text-green-600' : 'text-red-600'
          }`}>
            {row.type === 'IN' ? '+' : '-'}{value}
          </span>
        </div>
      ),
    },
    {
      header: 'Stock Changes',
      accessor: 'previousStock',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{value}</span>
          <FiArrowRight className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {row.newStock}
          </span>
        </div>
      ),
    },
    {
      header: 'Notes',
      accessor: 'notes',
      cell: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={value}>
            {value || '-'}
          </p>
        </div>
      ),
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
      cell: (value) => (
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
            {value?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{value || 'System'}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (_, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {/* View details */}}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <FiInfo className="w-4 h-4" />
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
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
                  <FiEdit className="w-4 h-4" />
                  <span>Edit Notes</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2">
                  <FiX className="w-4 h-4" />
                  <span>Reverse Movement</span>
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

  // Render Add Stock Form
  const renderAddStockForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancelForm}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Add Stock
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Increase inventory quantity for a product
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Product
            </label>
            <Select
              placeholder="Choose a product"
              options={products?.map(p => ({ 
                value: p.id, 
                label: `${p.name} (SKU: ${p.sku}) - Current Stock: ${p.stock}` 
              }))}
              value={selectedProduct?.id}
              onChange={(e) => {
                const product = products?.find(p => p.id === parseInt(e.target.value))
                setSelectedProduct(product)
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity to Add
            </label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this stock addition"
            />
          </div>
          
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800"
            >
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-4">
                Stock Update Preview
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Adding:</span>
                  <span className="font-medium text-green-600">+{parseInt(quantity) || 0}</span>
                </div>
                <div className="border-t border-green-200 dark:border-green-800 my-2 pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">New Stock:</span>
                    <span className="text-green-600">
                      {selectedProduct.stock + (parseInt(quantity) || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={handleCancelForm}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStock}
              disabled={!selectedProduct || !quantity}
              className="shadow-lg shadow-green-500/30"
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Confirm Addition
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Render Remove Stock Form
  const renderRemoveStockForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancelForm}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Remove Stock
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Decrease inventory quantity for a product
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Product
            </label>
            <Select
              placeholder="Choose a product"
              options={products?.map(p => ({ 
                value: p.id, 
                label: `${p.name} (SKU: ${p.sku}) - Current Stock: ${p.stock}` 
              }))}
              value={selectedProduct?.id}
              onChange={(e) => {
                const product = products?.find(p => p.id === parseInt(e.target.value))
                setSelectedProduct(product)
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity to Remove
            </label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity to remove"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason (Optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for stock removal (e.g., damaged, sold, expired)"
            />
          </div>
          
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800"
            >
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-4">
                Stock Update Preview
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Removing:</span>
                  <span className="font-medium text-red-600">-{parseInt(quantity) || 0}</span>
                </div>
                <div className="border-t border-red-200 dark:border-red-800 my-2 pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">New Stock:</span>
                    <span className={`${parseInt(quantity) > selectedProduct.stock ? 'text-red-600' : 'text-red-600'}`}>
                      {selectedProduct.stock - (parseInt(quantity) || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              {parseInt(quantity) > selectedProduct.stock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center text-red-700 dark:text-red-300"
                >
                  <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">Cannot remove more than current stock quantity</p>
                </motion.div>
              )}
            </motion.div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={handleCancelForm}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveStock}
              disabled={!selectedProduct || !quantity || parseInt(quantity) > selectedProduct?.stock}
              className="shadow-lg shadow-red-500/30"
            >
              <FiX className="w-4 h-4 mr-2" />
              Confirm Removal
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Render Main Inventory View
  const renderInventoryView = () => (
    <div className='space-y-6'>
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            Track stock movements and manage inventory levels
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['today', 'week', 'month', 'custom'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  dateRange === range
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
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

          {/* Add Stock Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowAddForm(true)}
              icon={FiPlus}
              className="shadow-lg shadow-primary-500/30"
            >
              Add Stock
            </Button>
          </motion.div>

          {/* Remove Stock Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowRemoveForm(true)}
              icon={FiPackage}
            >
              Remove
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Movements"
          value={stats.totalMovements}
          icon={FiPackage}
          color="from-blue-500 to-cyan-500"
          delay={0.1}
        />
        <StatCard
          title="Stock In"
          value={stats.stockIn}
          icon={FiTrendingUp}
          color="from-green-500 to-emerald-500"
          subtitle={`${((stats.stockIn / stats.totalMovements) * 100 || 0).toFixed(1)}% of total`}
          delay={0.2}
        />
        <StatCard
          title="Stock Out"
          value={stats.stockOut}
          icon={FiTrendingDown}
          color="from-red-500 to-orange-500"
          delay={0.3}
        />
        <StatCard
          title="Net Change"
          value={stats.totalQuantity}
          icon={FiShoppingBag}
          color="from-purple-500 to-pink-500"
          subtitle={stats.totalQuantity > 0 ? 'Net increase' : 'Net decrease'}
          delay={0.4}
        />
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedLogs.length} movements selected
                </span>
                <button
                  onClick={() => setSelectedLogs([])}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Export selected */}}
                >
                  Export Selected
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by product name or SKU..."
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
              {(filters.type || filters.dateFrom || filters.dateTo) && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>

            {(searchTerm || filters.type || filters.dateFrom || filters.dateTo) && (
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
                    label="Movement Type"
                    options={[
                      { value: '', label: 'All Types' },
                      { value: 'IN', label: 'Stock In' },
                      { value: 'OUT', label: 'Stock Out' },
                    ]}
                    value={filters.type}
                    onChange={(e) => setFilters({ type: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      From Date
                    </label>
                    <DatePicker
                      value={filters.dateFrom}
                      onChange={(date) => setFilters({ dateFrom: date })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      To Date
                    </label>
                    <DatePicker
                      value={filters.dateTo}
                      onChange={(date) => setFilters({ dateTo: date })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Low Stock Alert */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                  Low Stock Alert!
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  5 products are running low on stock. Review them to avoid stockouts.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <span className="text-sm font-medium">View Products</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stock Logs Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <Table
          columns={columns}
          data={stockLogs}
          loading={loading}
        />
      </motion.div>
      
      <Pagination
        currentPage={currentPage}
        totalItems={totalLogs}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderAddStockForm()}
          </motion.div>
        ) : showRemoveForm ? (
          <motion.div
            key="remove-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderRemoveStockForm()}
          </motion.div>
        ) : (
          <motion.div
            key="inventory-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderInventoryView()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Inventory