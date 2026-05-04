import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
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
  FiArrowLeft
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '../../store/productStore'
import { stockAPI } from '../../services/stockService'
import { categoriesAPI } from '../../services/categoriesService'
import { brandsAPI } from '../../services/brandsService'
import { unitsAPI } from '../../services/unitsService'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import ProductModal from '../../components/features/Products/ProductModal'
import Select from '../../components/common/Select/Select'
import ProductForm from '../../components/features/Products/ProductForm' // You'll need to create this component
import StockAddModal from '../../components/common/CreateModals/StockAddModal'

// Stock cache to prevent duplicate requests
const stockCache = new Map()
const STOCK_CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isStockCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < STOCK_CACHE_EXPIRY
}

const getCachedStocks = () => {
  const entry = stockCache.get('all')
  if (isStockCacheValid(entry)) {
    return entry.data
  }
  stockCache.delete('all')
  return null
}

const setCachedStocks = (data) => {
  stockCache.set('all', { data, timestamp: Date.now() })
}

const Products = () => {
  const {
    products,
    totalProducts,
    currentPage,
    pageSize,
    loading,
    filters,
    pagination,
    fetchProducts,
    fetchProductsByUrl,
    deleteProduct,
    setFilters,
    createProduct,
    updateProduct,
  } = useProductStore()

  // Refs to track initialization
  const initializedRef = useRef(false)
  const categoriesInitializedRef = useRef(false)
  const brandsInitializedRef = useRef(false)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [stocks, setStocks] = useState([])
  const [stocksLoading, setStocksLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [units, setUnits] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [brandsLoading, setBrandsLoading] = useState(false)
  const [unitsLoading, setUnitsLoading] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null)
  const [selectedStockProduct, setSelectedStockProduct] = useState(null)

  // Function to get stock for a specific product
  const getProductStock = (productId) => {
    if (!Array.isArray(stocks)) return 0
    const stock = stocks.find(s => s.product_id === productId)
    return stock ? parseFloat(stock.quantity) || 0 : 0
  }

  // Function to get stock record for a specific product
  const getProductStockRecord = (productId) => {
    if (!Array.isArray(stocks)) return null
    return stocks.find(s => s.product_id === productId) || null
  }

  useEffect(() => {
    const fetchData = async () => {
      // Prevent multiple initial loads using ref
      if (initializedRef.current) return
      initializedRef.current = true

      try {
        await fetchProducts()

        // Check cache first
        const cachedStocks = getCachedStocks()
        if (cachedStocks) {
          console.log(' Using cached stocks data')
          setStocks(cachedStocks)
          setInitialLoading(false)
          return
        }

        // Only fetch stocks if not already loaded, no valid cache, and not already loading
        if (stocks.length === 0 && !stocksLoading) {
          setStocksLoading(true)
          const stocksResponse = await stockAPI.getAll()
          console.log(' Stock API Response:', stocksResponse)
          // Extract stocks array from nested response
          const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
          console.log(' Extracted stocks:', stocksData)
          setStocks(stocksData)
          setCachedStocks(stocksData)
        }
      } catch (error) {
        console.error(' Error fetching stocks:', error)
        setStocks([])
      } finally {
        setInitialLoading(false)
        setStocksLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  // Fetch categories, brands and units data
  useEffect(() => {
    const fetchCategoriesBrandsAndUnits = async () => {
      // Prevent duplicate calls using refs
      if (categoriesInitializedRef.current || brandsInitializedRef.current) return
      categoriesInitializedRef.current = true
      brandsInitializedRef.current = true

      // Prevent duplicate calls if already loading or data exists
      if (categoriesLoading || brandsLoading || unitsLoading || (categories.length > 0 && brands.length > 0 && units.length > 0)) {
        return
      }

      setCategoriesLoading(true)
      setBrandsLoading(true)
      setUnitsLoading(true)

      try {
        const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll(),
          unitsAPI.getAll()
        ])

        // FIX: Extract the data array from the paginated response
        // The categories API returns a paginated object with the actual array in the 'data' property
        let categoriesData = []
        if (categoriesRes?.data?.data) {
          // If it's a paginated response with data property containing the array
          categoriesData = Array.isArray(categoriesRes.data.data)
            ? categoriesRes.data.data
            : categoriesRes.data.data.data || []
        } else {
          categoriesData = categoriesRes?.data || []
        }

        // Brands API might return array directly or nested
        let brandsData = []
        if (brandsRes?.data?.data) {
          brandsData = Array.isArray(brandsRes.data.data)
            ? brandsRes.data.data
            : brandsRes.data.data.data || []
        } else {
          brandsData = brandsRes?.data || []
        }

        // Units API might return array directly or nested
        let unitsData = []
        if (unitsRes?.data?.data) {
          unitsData = Array.isArray(unitsRes.data.data)
            ? unitsRes.data.data
            : unitsRes.data.data.data || []
        } else {
          unitsData = unitsRes?.data || []
        }

        console.log('Categories fetched:', categoriesData)
        console.log('Brands fetched:', brandsData)
        console.log('Units fetched:', unitsData)

        setCategories(categoriesData)
        setBrands(brandsData)
        setUnits(unitsData)
      } catch (error) {
        console.error('Error fetching categories, brands and units:', error)
        setCategories([])
        setBrands([])
        setUnits([])
      } finally {
        setCategoriesLoading(false)
        setBrandsLoading(false)
        setUnitsLoading(false)
      }
    }

    fetchCategoriesBrandsAndUnits()
  }, [])

  const handleAddProduct = () => {
    setShowAddForm(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setShowEditForm(true)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedProduct(null)
  }

  const handleSubmitProduct = async (productData) => {
    setFormSubmitting(true)
    try {
      if (showEditForm && selectedProduct) {
        console.log("........................................",productData)
        await updateProduct(selectedProduct.id, productData)
      } else {
        await createProduct(productData)
      }

      // Clear all caches to ensure fresh data
      stockCache.delete('all')

      // Refresh the product list with fresh data
      await fetchProducts()

      // Refresh stocks data to get latest stock information
      try {
        const stocksResponse = await stockAPI.getAll()
        const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
        setStocks(stocksData)
        setCachedStocks(stocksData)
        console.log('Stocks refreshed after product operation:', stocksData)
      } catch (error) {
        console.error('Error refreshing stocks after product operation:', error)
      }

      // Refresh categories and brands in case they were updated
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll()
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

        setCategories(categoriesData)
        setBrands(brandsData)
        console.log('Categories and brands refreshed after product operation')
      } catch (error) {
        console.error('Error refreshing categories and brands:', error)
      }

      // Hide the form
      handleCancelForm()

    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setSelectedProductToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (selectedProductToDelete) {
      try {
        await deleteProduct(selectedProductToDelete)
        setShowDeleteConfirm(false)
        setSelectedProductToDelete(null)

        await fetchProducts()

        // Refresh stocks data
        try {
          const stocksResponse = await stockAPI.getAll()
          const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
          setStocks(stocksData)
          setCachedStocks(stocksData)
          console.log('Stocks refreshed after product deletion:', stocksData)
        } catch (error) {
          console.error('Error refreshing stocks after product deletion:', error)
        }

      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Failed to delete product. Please try again.')
      }
    }
  }

  const openStockModal = (product) => {
    setSelectedStockProduct(product)
    setShowStockModal(true)
  }

  const handleAddStock = async (stockData) => {
    try {
      console.log('handleAddStock - stockData:', stockData);

      // Get the stock record to get the stock_id
      const stockRecord = getProductStockRecord(stockData.product_id);
      console.log('handleAddStock - stockRecord:', stockRecord);

      if (!stockRecord) {
        console.error('No stock record found for product:', stockData.product_id);
        toast.error('No stock record found for this product. Please create a stock record first.');
        return;
      }

      console.log('handleAddStock - API call params:', {
        stockId: stockRecord.id,
        userId: stockData.user_id,
        quantity: stockData.quantity
      });

      // Call the stock API with stock_id instead of product_id
      await stockAPI.addStock(stockRecord.id, stockData.user_id, stockData.quantity)

      // Show success message
      toast.success(`Stock added successfully! New stock: ${stockData.new_stock}`)

      // Refresh the products list to show updated stock
      await fetchProducts()

      // Refresh stocks data
      try {
        const stocksResponse = await stockAPI.getAll()
        const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
        setStocks(stocksData)
        setCachedStocks(stocksData)
      } catch (error) {
        console.error('Error refreshing stocks:', error)
      }

    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Failed to add stock. Please try again.')
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      // Implement bulk delete
      setSelectedProducts([])
      setShowDeleteConfirm(false)
    }
  }

  const handlePageChange = (url) => {
    if (url) {
      fetchProductsByUrl(url)
    }
  }

  const handleRefresh = async () => {
    // Prevent multiple simultaneous refresh calls
    if (refreshing) return

    setRefreshing(true)
    // Clear stock cache to force fresh data
    stockCache.delete('all')
    await fetchProducts()
    // Refetch stocks with fresh data (only if not already loading)
    if (!stocksLoading) {
      try {
        const stocksResponse = await stockAPI.getAll()
        const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
        setStocks(stocksData)
        setCachedStocks(stocksData)
      } catch (error) {
        console.error(' Error refreshing stocks:', error)
      }
    }
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
                onError={(e) => {
                  console.error(`Failed to load product image:`, row.image)
                  // If it's a Google Drive URL, show a special placeholder
                  if (row.image && row.image.includes('drive.google.com')) {
                    e.target.style.display = 'none'
                    const parent = e.target.parentElement
                    const placeholder = document.createElement('div')
                    placeholder.className = 'w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl mr-3 flex flex-col items-center justify-center ring-2 ring-red-200 dark:ring-red-800'
                    placeholder.innerHTML = `
                      <svg class="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-[8px] text-red-600 dark:text-red-400 mt-1">Drive</span>
                    `
                    parent.appendChild(placeholder)
                  } else {
                    // For other failed images, show default placeholder
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgzOFYzMEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMjkiIGN5PSIyNSIgcj0iMiIgZmlsbD0iIzlCQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzBWMzJIMzJWMzBIMzJWMzBaIiBmaWxsPSIjOUJBM0FGIi8+Cjwvc3ZnPg=='
                  }
                  e.target.onerror = null
                }}
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
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku}</p>

            {/* Unit Information */}
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

            {/* Attributes */}
            {row.attributes && (
              <div className="mt-1">
                {(() => {
                  let attributes = row.attributes;
                  
                  // Function to safely parse JSON (handles double-encoded JSON and arrays)
                  const safeJSONParse = (data) => {
                    try {
                      // If it's a string, parse it
                      if (typeof data === 'string') {
                        const parsed = JSON.parse(data);
                        // If the parsed result is still a string, parse again
                        if (typeof parsed === 'string') {
                          return safeJSONParse(parsed);
                        }
                        return parsed;
                      }
                      return data;
                    } catch (e) {
                      return null;
                    }
                  };
                  
                  // Parse if it's a string
                  if (typeof attributes === 'string') {
                    attributes = safeJSONParse(attributes);
                  }
                  
                  // Handle different attribute formats
                  let values = [];
                  
                  if (attributes && typeof attributes === 'object') {
                    if (Array.isArray(attributes)) {
                      // If it's an array of objects, extract all values
                      attributes.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                          values.push(...Object.values(item));
                        } else {
                          values.push(item);
                        }
                      });
                    } else {
                      // If it's a single object, extract values
                      values = Object.values(attributes);
                    }
                  }
                  
                  // Filter out empty/null values and convert to strings
                  values = values
                    .filter(val => val !== null && val !== undefined && val !== '')
                    .map(val => {
                      if (typeof val === 'object') {
                        return JSON.stringify(val);
                      }
                      return String(val);
                    });
                  
                  if (values.length > 0) {
                    const displayValues = values.slice(0, 2);
                    
                    return (
                      <div className="flex flex-wrap gap-1">
                        {displayValues.map((val, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {val}
                          </span>
                        ))}
                        {values.length > 2 && (
                          <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            +{values.length - 2} more
                          </span>
                        )}
                      </div>
                    );
                  }
                  
                  return null;
                })()}
              </div>
            )}

            {/* Variants */}
            {row.variants && Array.isArray(row.variants) && row.variants.length > 0 && (
              <div className="mt-1">
                <div className="flex flex-wrap gap-1">
                  {row.variants.slice(0, 3).flatMap((variant, index) => {
                    const variantValues = [];
                    if (variant.size) variantValues.push(String(variant.size));
                    if (variant.color) variantValues.push(String(variant.color));
                    if (variant.material) variantValues.push(String(variant.material));
                    
                    return variantValues.map((val, valIndex) => (
                      <span key={`${index}-${valIndex}`} className="inline-block px-1.5 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        {val}
                      </span>
                    ));
                  })}
                  {row.variants.length > 3 && (
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      +{row.variants.length - 3} more
                    </span>
                  )}
                </div>
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
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Purchase Price',
      accessor: 'purchase_price',
      cell: (value) => {
        const price = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Category',
      accessor: 'category_id',
      cell: (value) => {
        // Ensure categories is an array before calling find
        const category = Array.isArray(categories) ? categories.find(cat => cat.id === value) : null
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
            {category?.name || `Category ${value}`}
          </span>
        )
      },
    },
    {
      header: 'Brand',
      accessor: 'brand_id',
      cell: (value) => {
        // Ensure brands is an array before calling find
        const brand = Array.isArray(brands) ? brands.find(b => b.id === value) : null
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            {brand?.name || `Brand ${value}`}
          </span>
        )
      },
    },
    {
      header: 'Stock',
      accessor: 'stock',
      cell: (_, row) => {
        const stockQuantity = getProductStock(row.id)
        const maxStock = 100 // You can adjust this based on your needs
        const lowStockThreshold = 10 // You can adjust this based on your needs

        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stockQuantity / maxStock) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${stockQuantity <= lowStockThreshold
                    ? 'bg-red-500'
                    : stockQuantity <= lowStockThreshold * 2
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
              />
            </div>
            <span className={`
              text-sm font-medium
              ${stockQuantity <= lowStockThreshold
                ? 'text-red-600 dark:text-red-400'
                : stockQuantity === 0
                  ? 'text-orange-600 dark:text-orange-400'
                  : stockQuantity <= lowStockThreshold * 2
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-900 dark:text-white'
              }
            `}>
              {stockQuantity}
            </span>
            {stockQuantity === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openStockModal(row)}
                icon={FiPlus}
                className="!px-2 !py-1 text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-700 dark:hover:bg-orange-900/20"
                title="Add Stock"
              >

              </Button>
            )}
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'is_active',
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
            onClick={() => handleEditProduct(row)}
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
          {/* Only show these buttons when not in form mode */}
          {!showAddForm && !showEditForm && (
            <>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
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
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
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
            </>
          )}

          {/* Add Product Button or Back Button */}
          {!showAddForm && !showEditForm ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleAddProduct}
                icon={FiPlus}
                className="shadow-lg shadow-primary-500/30"
              >
                Add Product
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
                Back to Products
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
            {showEditForm ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            product={selectedProduct}
            onSubmit={handleSubmitProduct}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
          />
        </motion.div>
      ) : (
        <>
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
            {initialLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ) : (
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
                    className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${showFilters
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
            )}

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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          label="Category"
                          options={[
                            { value: '', label: 'All Categories' },
                            ...(Array.isArray(categories) ? categories.map(cat => ({
                              value: cat.id,
                              label: cat.name
                            })) : [])
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
            )}
          </motion.div>

          {/* Products Display */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {initialLoading || loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {initialLoading ? 'Loading product data...' : 'Updating product data...'}
                  </p>
                </div>
              </div>
            ) : products.length > 0 ? (
              viewMode === 'table' ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                      columns={columns}
                      data={products}
                      loading={loading}
                      onEdit={handleEditProduct}
                      onDelete={handleDelete}
                      onAddStock={handleAddStock}
                    />
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalProducts}
                    pageSize={pageSize}
                    pagination={pagination}
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
                              onError={(e) => {
                                console.error(`Failed to load product grid image:`, product.image)
                                // If it's a Google Drive URL, show a special placeholder
                                if (product.image && product.image.includes('drive.google.com')) {
                                  e.target.style.display = 'none'
                                  const parent = e.target.parentElement
                                  const placeholder = document.createElement('div')
                                  placeholder.className = 'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
                                  placeholder.innerHTML = `
                                    <svg class="w-12 h-12 text-red-500 dark:text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="text-sm text-red-600 dark:text-red-400 font-medium">Google Drive</span>
                                    <span class="text-xs text-red-500 dark:text-red-500 mt-1">Image not available</span>
                                  `
                                  parent.appendChild(placeholder)
                                } else {
                                  // For other failed images, show default placeholder
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUJBM0FGIi8+CjxwYXRoIGQ9Ik05NSAxMDBWMTA1SDEwMFY5OUg5NVoiIGZpbGw9IiM5QkEzQUYiLz4KPC9zdmc+'
                                }
                                e.target.onerror = null
                              }}
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
                              onClick={() => handleEditProduct(product)}
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
                              ₹{product.selling_price ? parseFloat(product.selling_price).toFixed(2) : '0.00'}
                            </span>
                            <StatusBadge
                              status={product.is_active ? 'active' : 'inactive'}
                              variant={product.is_active ? 'success' : 'default'}
                              size="sm"
                            />
                          </div>

                          {/* Stock Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Stock</span>
                              <span className={`font-medium ${product.stock <= product.lowStockThreshold
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {getProductStock(product.id)} / {product.maxStock || 100}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((getProductStock(product.id) / (product.maxStock || 100)) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${getProductStock(product.id) <= (product.lowStockThreshold || 10)
                                    ? 'bg-red-500'
                                    : getProductStock(product.id) <= (product.lowStockThreshold || 10) * 2
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
                    pagination={pagination}
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
                    onClick={handleAddProduct}
                    icon={FiPlus}
                    size="lg"
                  >
                    Add Your First Product
                  </Button>
                }
              />
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
                  {selectedProductToDelete ? 'Delete Product' : 'Delete Products'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedProductToDelete
                    ? 'Are you sure you want to delete this product? This action cannot be undone.'
                    : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
                  }
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setSelectedProductToDelete(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={selectedProductToDelete ? confirmDelete : handleBulkDelete}
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

      {/* Stock Add Modal */}
      <StockAddModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        onAddStock={handleAddStock}
        product={selectedStockProduct}
        currentStock={selectedStockProduct ? getProductStock(selectedStockProduct.id) : 0}
      />
    </motion.div>
  )
}

export default Products