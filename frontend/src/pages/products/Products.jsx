import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 
  FiPackage,
  FiGrid,
  FiList,
  FiDownload,
  FiUpload,
  FiMoreVertical,
  FiEye,
  FiCopy,
  FiArchive,
  FiAlertCircle,
  FiChevronDown,
  FiX,
  FiRefreshCw,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '../../store/productStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import ProductModal from '../../components/features/Products/ProductModal'
import Select from '../../components/common/Select/Select'

const Products = () => {
  const {
    products,
    totalProducts,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchProducts,
    deleteProduct,
    setFilters,
  } = useProductStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      // Implement bulk delete
      setSelectedProducts([])
      setShowDeleteConfirm(false)
    }
  }

  const handlePageChange = (page) => {
    fetchProducts(page)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
    setRefreshing(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ search: '', category: '', status: '' })
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length && products.length > 0}
            onChange={selectAllProducts}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={() => toggleProductSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Product',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            {row.image ? (
              <img
                src={row.image}
                alt={value}
                className="w-12 h-12 rounded-xl object-cover mr-3 ring-2 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <FiPackage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            {row.lowStock && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
            )}
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (value) => (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
          {value}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      cell: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / row.maxStock) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                value <= row.lowStockThreshold 
                  ? 'bg-red-500' 
                  : value <= row.lowStockThreshold * 2
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          </div>
          <span className={`text-sm font-medium ${
            value <= row.lowStockThreshold 
              ? 'text-red-600 dark:text-red-400' 
              : value <= row.lowStockThreshold * 2
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {value}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          variant={value ? 'success' : 'default'}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit product"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(value)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete product"
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
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
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiPackage className="w-4 h-4 mr-2" />
            Manage your product catalog and inventory
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
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

          {/* Add Product Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowAddModal(true)}
              icon={FiPlus}
              className="shadow-lg shadow-primary-500/30"
            >
              Add Product
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedProducts.length} products selected
                </span>
                <button
                  onClick={() => setSelectedProducts([])}
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, SKU, or category..."
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
              {(filters.category || filters.status) && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>

            {(searchTerm || filters.category || filters.status) && (
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
                    label="Category"
                    options={[
                      { value: '', label: 'All Categories' },
                      { value: 'electronics', label: 'Electronics' },
                      { value: 'clothing', label: 'Clothing' },
                      { value: 'books', label: 'Books' },
                      { value: 'home', label: 'Home & Garden' },
                      { value: 'sports', label: 'Sports' },
                      { value: 'toys', label: 'Toys' },
                    ]}
                    value={filters.category}
                    onChange={(e) => setFilters({ category: e.target.value })}
                  />
                  <Select
                    label="Status"
                    options={[
                      { value: '', label: 'All Status' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                  />
                  <Select
                    label="Stock Status"
                    options={[
                      { value: '', label: 'All Stock' },
                      { value: 'low', label: 'Low Stock' },
                      { value: 'out', label: 'Out of Stock' },
                      { value: 'in', label: 'In Stock' },
                    ]}
                    value={filters.stockStatus}
                    onChange={(e) => setFilters({ stockStatus: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Products Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {products.length > 0 ? (
          viewMode === 'table' ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Table
                  columns={columns}
                  data={products}
                  loading={loading}
                />
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={totalProducts}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            // Grid View
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      
                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(product.id)}
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

                      {/* Low Stock Badge */}
                      {product.stock <= product.lowStockThreshold && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          Low Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        SKU: {product.sku}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        <StatusBadge
                          status={product.isActive ? 'active' : 'inactive'}
                          variant={product.isActive ? 'success' : 'default'}
                          size="sm"
                        />
                      </div>

                      {/* Stock Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Stock</span>
                          <span className={`font-medium ${
                            product.stock <= product.lowStockThreshold 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {product.stock} / {product.maxStock}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${
                              product.stock <= product.lowStockThreshold 
                                ? 'bg-red-500' 
                                : product.stock <= product.lowStockThreshold * 2
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={totalProducts}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          )
        ) : (
          <EmptyState
            icon={FiPackage}
            title="No products yet"
            description="Get started by adding your first product to the catalog. You can add products individually or import them in bulk."
            action={
              <Button 
                onClick={() => setShowAddModal(true)}
                icon={FiPlus}
                size="lg"
              >
                Add Your First Product
              </Button>
            }
          />
        )}
      </motion.div>

      {/* Product Modals */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        mode="edit"
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
                  Delete Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {selectedProducts.length} selected products? This action cannot be undone.
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

export default Products