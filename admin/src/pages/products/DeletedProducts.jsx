import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiPackage,
  FiRotateCcw,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
  FiEye,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeletedProductStore } from '../../store/deletedProductStore'
import { productsAPI } from '../../services/productsService'
import { categoriesAPI } from '../../services/categoriesService'
import { brandsAPI } from '../../services/brandsService'
import { unitsAPI } from '../../services/unitsService'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Modal from '../../components/common/Modal/Modal'

const DeletedProducts = () => {
  const {
    deletedProducts,
    totalDeletedProducts,
    currentPage,
    pageSize,
    loading,
    pagination,
    fetchDeletedProducts,
    fetchDeletedProductsByUrl,
    restoreProduct,
    forceDeleteProduct,
  } = useDeletedProductStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [units, setUnits] = useState([])

  useEffect(() => {
    fetchDeletedProducts()
    fetchCategoriesBrandsAndUnits()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDeletedProducts(1, searchTerm)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const fetchCategoriesBrandsAndUnits = async () => {
    try {
      const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
        categoriesAPI.getAll(),
        brandsAPI.getAll(),
        unitsAPI.getAll()
      ])

      let categoriesData = []
      if (categoriesRes?.data?.data) {
        categoriesData = Array.isArray(categoriesRes.data.data)
          ? categoriesRes.data.data
          : categoriesRes.data.data.data || []
      } else {
        categoriesData = categoriesRes?.data || []
      }

      let brandsData = []
      if (brandsRes?.data?.data) {
        brandsData = Array.isArray(brandsRes.data.data)
          ? brandsRes.data.data
          : brandsRes.data.data.data || []
      } else {
        brandsData = brandsRes?.data || []
      }

      let unitsData = []
      if (unitsRes?.data?.data) {
        unitsData = Array.isArray(unitsRes.data.data)
          ? unitsRes.data.data
          : unitsRes.data.data.data || []
      } else {
        unitsData = unitsRes?.data || []
      }

      setCategories(categoriesData)
      setBrands(brandsData)
      setUnits(unitsData)
    } catch (error) {
      console.error('Error fetching categories, brands and units:', error)
      setCategories([])
      setBrands([])
      setUnits([])
    }
  }

  const handleRefresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    await fetchDeletedProducts()
    setRefreshing(false)
  }

  const handleRestore = async (product) => {
    setSelectedProduct(product)
    setShowRestoreConfirm(true)
  }

  const confirmRestore = async () => {
    if (selectedProduct) {
      try {
        await restoreProduct(selectedProduct.id)
        setShowRestoreConfirm(false)
        setSelectedProduct(null)
        toast.success('Product restored successfully')
      } catch (error) {
        console.error('Error restoring product:', error)
        toast.error('Failed to restore product')
      }
    }
  }

  const handleForceDelete = async (product) => {
    setSelectedProduct(product)
    setShowDeleteConfirm(true)
  }

  const confirmForceDelete = async () => {
    if (selectedProduct) {
      try {
        await forceDeleteProduct(selectedProduct.id)
        setShowDeleteConfirm(false)
        setSelectedProduct(null)
        toast.success('Product permanently deleted')
      } catch (error) {
        console.error('Error permanently deleting product:', error)
        toast.error('Failed to permanently delete product')
      }
    }
  }

  const handlePageChange = (url) => {
    if (url) {
      fetchDeletedProductsByUrl(url)
    }
  }

  const columns = [
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
                className="w-12 h-12 rounded-xl object-cover mr-3 ring-2 ring-red-200 dark:ring-red-800 opacity-75"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRkY2RjZGIi8+CjxwYXRoIGQ9Ik0yMCAyMEgzOFYzMEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMjkiIGN5PSIyNSIgcj0iMiIgZmlsbD0iIzlCQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzBWMzJIMzJWMzBIMzJWMzBaIiBmaWxsPSIjOUJBM0FGIi8+Cjwvc3ZnPg=='
                  e.target.onerror = null
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl mr-3 flex items-center justify-center ring-2 ring-red-200 dark:ring-red-800">
                <FiPackage className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
            )}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white line-through opacity-75">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku}</p>
            {row.unit_id && (
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {(() => {
                    const unit = Array.isArray(units) ? units.find(u => u.id === row.unit_id) : null
                    return unit ? `${row.unit_amount || '1'} ${unit.name}` : `Unit ${row.unit_id}`
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Selling Price',
      accessor: 'selling_price',
      cell: (value) => {
        const price = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium line-through opacity-75">
            ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Category',
      accessor: 'category_id',
      cell: (value) => {
        const category = Array.isArray(categories) ? categories.find(cat => cat.id === value) : null
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm line-through opacity-75">
            {category?.name || `Category ${value}`}
          </span>
        )
      },
    },
    {
      header: 'Brand',
      accessor: 'brand_id',
      cell: (value) => {
        const brand = Array.isArray(brands) ? brands.find(b => b.id === value) : null
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm line-through opacity-75">
            {brand?.name || `Brand ${value}`}
          </span>
        )
      },
    },
    {
      header: 'Deleted At',
      accessor: 'deleted_at',
      cell: (value) => (
        <span className="text-sm text-red-600 dark:text-red-400">
          {value ? new Date(value).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Unknown'}
        </span>
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
            onClick={() => handleRestore(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Restore product"
          >
            <FiRotateCcw className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleForceDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Permanently delete"
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 to-red-600 dark:from-red-100 dark:to-red-400 bg-clip-text text-transparent">
            Deleted Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiAlertTriangle className="w-4 h-4 mr-2" />
            Manage soft-deleted products - restore or permanently delete
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search deleted products by name, SKU, category, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
          icon={FiSearch}
        />
      </motion.div>

      {/* Deleted Products Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {deletedProducts.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={deletedProducts}
              loading={loading}
            />
            <Pagination
              currentPage={currentPage}
              totalItems={totalDeletedProducts}
              pageSize={pageSize}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            icon={FiPackage}
            title="No deleted products"
            description="There are no soft-deleted products to display."
            actionText="Deleted products will appear here"
          />
        )}
      </motion.div>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={showRestoreConfirm}
        onClose={() => {
          setShowRestoreConfirm(false)
          setSelectedProduct(null)
        }}
        title="Restore Product"
        size="sm"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="text-center">
              <FiRotateCcw className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Restore "{selectedProduct.name}"?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                This will restore the product and make it active again.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={confirmRestore}
                className="flex-1"
                variant="primary"
              >
                <FiRotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestoreConfirm(false)
                  setSelectedProduct(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedProduct(null)
        }}
        title="Permanently Delete Product"
        size="sm"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="text-center">
              <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Permanently Delete "{selectedProduct.name}"?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                This action cannot be undone. The product will be permanently removed from the database.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={confirmForceDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSelectedProduct(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default DeletedProducts
