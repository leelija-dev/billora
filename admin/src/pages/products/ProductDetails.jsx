// src/pages/products/ProductDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiShoppingCart,
  FiBox,
  FiCalendar,
  FiUser,
  FiActivity,
  FiCopy,
  FiRefreshCw,
  FiInfo,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBarChart2,
  FiClipboard,
  FiGrid,
  FiList,
  FiMapPin,
  FiShare2,
  FiDownload,
  FiPrinter,
  FiPlus,
  FiX
} from 'react-icons/fi'
import { useProductStore } from '../../store/productStore'
import { stockAPI } from '../../services/stockService'
import { categoriesAPI } from '../../services/categoriesService'
import { brandsAPI } from '../../services/brandsService'
import { unitsAPI } from '../../services/unitsService'
import Button from '../../components/common/Button/Button'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import StockAddModal from '../../components/common/CreateModals/StockAddModal'
import ProductForm from '../../components/features/Products/ProductForm'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, deleteProduct, fetchProducts } = useProductStore()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stocks, setStocks] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [units, setUnits] = useState([])
  const [showStockModal, setShowStockModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [stockHistory, setStockHistory] = useState([])
  const [stockHistoryLoading, setStockHistoryLoading] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        // Fetch fresh product data
        await fetchProducts()
        const productData = getProductById(parseInt(id))
        
        if (!productData) {
          toast.error('Product not found')
          navigate('/products')
          return
        }
        
        setProduct(productData)

        // Fetch categories, brands, units
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

        // Fetch stock data
        const stocksResponse = await stockAPI.getAll()
        const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
        const productStock = stocksData.find(s => s.product_id === parseInt(id))
        setStocks(productStock || null)

        // Fetch stock history
        await fetchStockHistory()

        // Fetch related products (same category)
        if (productData.category_id) {
          const sameCategoryProducts = await fetchProductsByCategory(productData.category_id, productData.id)
          setRelatedProducts(sameCategoryProducts)
        }

      } catch (error) {
        console.error('Error fetching product details:', error)
        toast.error('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id, getProductById, navigate])

  const fetchStockHistory = async () => {
    setStockHistoryLoading(true)
    try {
      // Assuming you have a stock history endpoint
      // const response = await stockAPI.getHistory(id)
      // setStockHistory(response.data)
      
      // For demo, creating mock history data
      const mockHistory = [
        { id: 1, date: '2024-01-15', type: 'purchase', quantity: 50, user: 'John Doe', note: 'Initial stock' },
        { id: 2, date: '2024-01-20', type: 'sale', quantity: -5, user: 'Jane Smith', note: 'Customer order #1234' },
        { id: 3, date: '2024-01-25', type: 'purchase', quantity: 30, user: 'John Doe', note: 'Restock' },
        { id: 4, date: '2024-02-01', type: 'sale', quantity: -8, user: 'Mike Johnson', note: 'Customer order #1235' },
        { id: 5, date: '2024-02-05', type: 'adjustment', quantity: 2, user: 'Admin', note: 'Inventory adjustment' },
      ]
      setStockHistory(mockHistory)
    } catch (error) {
      console.error('Error fetching stock history:', error)
    } finally {
      setStockHistoryLoading(false)
    }
  }

  const fetchProductsByCategory = async (categoryId, currentProductId) => {
    try {
      const { getProductsByCategory } = useProductStore.getState()
      const products = await getProductsByCategory(categoryId)
      return products.filter(p => p.id !== currentProductId).slice(0, 4)
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleCancelForm = () => {
    setShowEditForm(false)
  }

  const handleSubmitProduct = async (productData) => {
    setFormSubmitting(true)
    try {
      const { updateProduct } = useProductStore.getState()
      await updateProduct(parseInt(id), productData)
      
      // Refresh product data
      await fetchProducts()
      const updatedProductData = getProductById(parseInt(id))
      setProduct(updatedProductData)
      
      // Refresh related data
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

      // Refresh stock data
      const stocksResponse = await stockAPI.getAll()
      const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
      const updatedStock = stocksData.find(s => s.product_id === parseInt(id))
      setStocks(updatedStock)

      setShowEditForm(false)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleAddStock = async (stockData) => {
    try {
      await stockAPI.addStock(stocks.id, stockData.user_id, stockData.quantity)
      toast.success(`Stock added successfully! New stock: ${stockData.new_stock}`)
      
      // Refresh stock data
      const stocksResponse = await stockAPI.getAll()
      const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
      const updatedStock = stocksData.find(s => s.product_id === parseInt(id))
      setStocks(updatedStock)
      
      // Refresh stock history
      await fetchStockHistory()
      
      setShowStockModal(false)
    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Failed to add stock')
    }
  }

  const handleCopySKU = () => {
    navigator.clipboard.writeText(product.sku)
    toast.success('SKU copied to clipboard')
  }

  const getStockStatus = (quantity) => {
    if (!quantity || quantity === 0) return { label: 'Out of Stock', color: 'red', icon: FiXCircle }
    if (quantity <= (product.lowStockThreshold || 10)) return { label: 'Low Stock', color: 'orange', icon: FiAlertCircle }
    if (quantity <= (product.lowStockThreshold || 10) * 2) return { label: 'Medium Stock', color: 'yellow', icon: FiActivity }
    return { label: 'In Stock', color: 'green', icon: FiCheckCircle }
  }

  const getStockPercentage = () => {
    if (!stocks) return 0
    const maxStock = product.maxStock || 100
    return Math.min((stocks.quantity / maxStock) * 100, 100)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getProfitMargin = () => {
    if (!product.selling_price || !product.purchase_price) return 0
    const profit = product.selling_price - product.purchase_price
    return ((profit / product.purchase_price) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  // Show edit form when editing
  if (showEditForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Product
            </h1>
            <Button
              variant="outline"
              onClick={handleCancelForm}
              icon={FiArrowLeft}
            >
              Back to Details
            </Button>
          </div>

          {/* Form */}
          <ProductForm
            product={product}
            onSubmit={handleSubmitProduct}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
          />
        </div>
      </motion.div>
    )
  }

  const category = categories.find(c => c.id === product.category_id)
  const brand = brands.find(b => b.id === product.brand_id)
  const unit = units.find(u => u.id === product.unit_id)
  const stockStatus = getStockStatus(stocks?.quantity)
  const profitMargin = getProfitMargin()

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                  icon={FiArrowLeft}
                  className="!px-3"
                >
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h1>
                  <div className="flex items-center mt-2 space-x-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      SKU: {product.sku}
                    </p>
                    <button
                      onClick={handleCopySKU}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <FiCopy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  icon={FiEdit2}
                >
                  Edit Product
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  icon={FiTrash2}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Images & Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Image Gallery */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-8"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUJBM0FGIi8+CjxwYXRoIGQ9Ik05NSAxMDBWMTA1SDEwMFY5OUg5NVoiIGZpbGw9IiM5QkEzQUYiLz4KPC9zdmc+'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <FiPackage className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                      <p className="mt-4 text-gray-500 dark:text-gray-400">No image available</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
              >
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-4 px-6 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview', icon: FiInfo },
                      { id: 'details', label: 'Details', icon: FiClipboard },
                      { id: 'stock', label: 'Stock History', icon: FiBarChart2 },
                      { id: 'variants', label: 'Variants', icon: FiGrid },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors
                          ${activeTab === tab.id
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }
                        `}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Description */}
                      {product.description && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Description
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      )}

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <FiTag className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {category?.name || 'Uncategorized'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <FiStar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Brand</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {brand?.name || 'No brand'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <FiBox className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Unit</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {unit ? `${product.unit_amount || '1'} ${unit.name}` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <FiActivity className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <StatusBadge
                              status={product.is_active ? 'active' : 'inactive'}
                              variant={product.is_active ? 'success' : 'default'}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Attributes */}
                      {product.attributes && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                            Attributes
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            {(() => {
                              let attributes = product.attributes
                              const safeJSONParse = (data) => {
                                try {
                                  if (typeof data === 'string') {
                                    const parsed = JSON.parse(data)
                                    if (typeof parsed === 'string') {
                                      return safeJSONParse(parsed)
                                    }
                                    return parsed
                                  }
                                  return data
                                } catch (e) {
                                  return null
                                }
                              }
                              
                              if (typeof attributes === 'string') {
                                attributes = safeJSONParse(attributes)
                              }
                              
                              if (attributes && typeof attributes === 'object') {
                                const attributeEntries = Array.isArray(attributes)
                                  ? attributes.flatMap(item => Object.entries(item))
                                  : Object.entries(attributes)
                                
                                if (attributeEntries.length > 0) {
                                  return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {attributeEntries.map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center">
                                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {key}:
                                          </span>
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {String(value)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                }
                              }
                              return <p className="text-gray-500 dark:text-gray-400">No attributes</p>
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {formatDate(product.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <FiRefreshCw className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {formatDate(product.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stock History Tab */}
                  {activeTab === 'stock' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {stockHistoryLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                      ) : stockHistory.length > 0 ? (
                        <div className="space-y-3">
                          {stockHistory.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                            >
                              <div className="flex items-center space-x-3">
                                {entry.type === 'purchase' ? (
                                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                                ) : entry.type === 'sale' ? (
                                  <FiTrendingDown className="w-5 h-5 text-red-500" />
                                ) : (
                                  <FiActivity className="w-5 h-5 text-yellow-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {entry.type === 'purchase' ? 'Stock Added' : 
                                     entry.type === 'sale' ? 'Stock Removed' : 
                                     'Stock Adjusted'}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {entry.date} • {entry.user}
                                  </p>
                                  {entry.note && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {entry.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className={`text-right ${
                                entry.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                <p className="text-sm font-semibold">
                                  {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No stock history available
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Variants Tab */}
                  {activeTab === 'variants' && product.variants && product.variants.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="grid gap-4">
                        {product.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                          >
                            <div className="space-y-1">
                              {variant.size && (
                                <p className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Size:</span>{' '}
                                  <span className="font-medium text-gray-900 dark:text-white">{variant.size}</span>
                                </p>
                              )}
                              {variant.color && (
                                <p className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Color:</span>{' '}
                                  <span className="font-medium text-gray-900 dark:text-white">{variant.color}</span>
                                </p>
                              )}
                              {variant.material && (
                                <p className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Material:</span>{' '}
                                  <span className="font-medium text-gray-900 dark:text-white">{variant.material}</span>
                                </p>
                              )}
                            </div>
                            {variant.price && (
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(variant.price)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'variants' && (!product.variants || product.variants.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No variants available for this product
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Pricing & Stock Info */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2 text-primary-500" />
                  Pricing Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Selling Price</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(product.selling_price)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Price</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.purchase_price)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
                    <span className={`text-lg font-semibold ${
                      profitMargin > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profitMargin}%
                    </span>
                  </div>
                  
                  {product.mrp && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">MRP</span>
                      <span className="text-lg font-semibold text-gray-500 line-through">
                        {formatCurrency(product.mrp)}
                      </span>
                    </div>
                  )}
                  
                  {product.tax_rate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Tax Rate</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.tax_rate}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stock Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiShoppingCart className="w-5 h-5 mr-2 text-primary-500" />
                  Stock Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <stockStatus.icon className={`w-5 h-5 text-${stockStatus.color}-500`} />
                      <span className={`text-sm font-medium text-${stockStatus.color}-600 dark:text-${stockStatus.color}-400`}>
                        {stockStatus.label}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stocks?.quantity || 0}
                    </span>
                  </div>
                  
                  {/* Stock Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Stock Level</span>
                      <span>{Math.round(getStockPercentage())}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getStockPercentage()}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          getStockPercentage() <= 10 ? 'bg-red-500' :
                          getStockPercentage() <= 20 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {product.lowStockThreshold && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Low Stock Threshold</span>
                      <span className="text-gray-700 dark:text-gray-300">{product.lowStockThreshold}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => setShowStockModal(true)}
                    icon={FiPlus}
                    className="w-full mt-4"
                    disabled={!stocks}
                  >
                    Add Stock
                  </Button>
                </div>
              </motion.div>

              {/* Quick Actions Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiShare2}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Product link copied')
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiDownload}
                    onClick={() => {
                      // Implement export functionality
                      toast.success('Export started')
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiPrinter}
                    onClick={() => window.print()}
                  >
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiCopy}
                    onClick={() => {
                      // Implement duplicate functionality
                      toast.success('Product duplicated')
                    }}
                  >
                    Duplicate
                  </Button>
                </div>
              </motion.div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Related Products
                  </h3>
                  <div className="space-y-3">
                    {relatedProducts.map((related) => (
                      <Link
                        key={related.id}
                        to={`/products/${related.id}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {related.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCurrency(related.selling_price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stock Add Modal */}
      <StockAddModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        onAddStock={handleAddStock}
        product={product}
        currentStock={stocks?.quantity || 0}
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
                  Delete Product
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
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
                    onClick={handleDelete}
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
    </>
  )
}

export default ProductDetails