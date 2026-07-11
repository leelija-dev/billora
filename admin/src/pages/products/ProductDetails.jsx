// src/pages/products/ProductDetails.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    FiArrowLeft,
    FiEdit2,
    FiTrash2,
    FiPackage,
    FiTag,
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
    FiX,
    FiBarChart,
    FiEye,
    FiClock,
    FiAward,
    FiShield
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
import QRBarcodePrintModal from '../../components/features/Stocks/QRBarcodePrintModal' 
import { FaQrcode, FaRupeeSign } from 'react-icons/fa'

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { 
        getProductById, 
        deleteProduct, 
        fetchProducts,
        fetchProductsByUrl,
        pagination,
        currentPage,
        clearCache
    } = useProductStore()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
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
    const [showQrBarcodeModal, setShowQrBarcodeModal] = useState(false)
    const [updatingStock, setUpdatingStock] = useState(false)

    // Refs to track initialization
    const initializedRef = useRef(false)

    // Function to get total stock quantity for a product from its stocks array
    const getProductTotalStock = (product) => {
        if (!product || !product.stocks || !Array.isArray(product.stocks)) return 0
        return product.stocks.reduce((total, stock) => {
            const quantity = parseFloat(stock.quantity) || 0
            return total + quantity
        }, 0)
    }

    // Function to get all stock records for a product
    const getProductStocks = (product) => {
        if (!product || !product.stocks || !Array.isArray(product.stocks)) return []
        return product.stocks
    }

    // Function to get the primary stock record for a product
    const getPrimaryStockRecord = (product) => {
        if (!product || !product.stocks || !Array.isArray(product.stocks)) return null
        return product.stocks[0] || null
    }

    // Fetch product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (initializedRef.current) return
            initializedRef.current = true
            
            setLoading(true)
            try {
                // First fetch products to ensure store is populated
                await fetchProducts()
                
                // Get product by ID - this calls productsAPI.getById(id) which returns full product with relations
                const productData = await getProductById(parseInt(id))
                console.log('Product data from store:', productData)

                if (!productData) {
                    toast.error('Product not found')
                    navigate('/products')
                    return
                }

                setProduct(productData)

                // Fetch categories, brands and units for dropdowns and display
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

                // Fetch stock history
                await fetchStockHistory()

                // Fetch related products from same category
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
    }, [id, getProductById, navigate, fetchProducts])

    const fetchStockHistory = async () => {
        setStockHistoryLoading(true)
        try {
            // TODO: Replace with actual API call when available
            const mockHistory = [
               
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
            const result = await updateProduct(parseInt(id), productData)

            if (result?.success === false) {
                // Error already handled in store
                setFormSubmitting(false)
                return
            }

            // Clear cache and refresh
            clearCache()
            useProductStore.setState({ lastFetchTime: null, cacheKey: null })
            await fetchProducts()

            // Get updated product data
            const updatedProductData = await getProductById(parseInt(id))
            setProduct(updatedProductData)

            // Refresh categories, brands and units
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

            setShowEditForm(false)
            toast.success('Product updated successfully')
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('Failed to update product')
        } finally {
            setFormSubmitting(false)
        }
    }

    const handleAddStock = async (stockData) => {
        if (updatingStock) return

        setUpdatingStock(true)
        try {
            // Get the primary stock record for this product
            const stockRecord = getPrimaryStockRecord(product)
            
            if (!stockRecord) {
                toast.error('No stock record found for this product. Please create a stock record first.')
                return
            }

            // Call the stock API with the stock record ID
            await stockAPI.addStock(
                stockRecord.id,
                stockData.user_id,
                stockData.quantity
            )

            toast.success(`Stock added successfully! New stock: ${stockData.new_stock}`)

            // Clear cache to force fresh data
            clearCache()
            useProductStore.setState({ lastFetchTime: null, cacheKey: null })

            // Refresh the products list
            await fetchProducts()

            // Get updated product data
            const updatedProductData = await getProductById(parseInt(id))
            setProduct(updatedProductData)

            // Refresh stock history
            await fetchStockHistory()

            setShowStockModal(false)
        } catch (error) {
            console.error('Error adding stock:', error)
            toast.error('Failed to add stock. Please try again.')
        } finally {
            setUpdatingStock(false)
        }
    }

    const handleDelete = async () => {
        try {
            const result = await deleteProduct(parseInt(id))
            if (result?.success !== false) {
                toast.success('Product deleted successfully')
                navigate('/products')
            }
        } catch (error) {
            console.error('Error deleting product:', error)
            toast.error('Failed to delete product')
        }
    }

    const handleCopySKU = () => {
        navigator.clipboard.writeText(product.sku)
        toast.success('SKU copied to clipboard')
    }

    const handleShowQrBarcode = () => {
        setShowQrBarcodeModal(true)
    }

    const handleCloseQrBarcode = () => {
        setShowQrBarcodeModal(false)
    }

    const getStockStatus = (quantity) => {
        const lowStockThreshold = parseFloat(product?.minimum_stock_quantity) || 10
        if (!quantity || quantity === 0) { 
            return { label: 'Out of Stock', color: 'red', icon: FiXCircle, bgColor: 'bg-red-100 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400' }
        }
        if (quantity <= lowStockThreshold) { 
            return { label: 'Low Stock', color: 'orange', icon: FiAlertCircle, bgColor: 'bg-orange-100 dark:bg-orange-900/20', textColor: 'text-orange-700 dark:text-orange-400' }
        }
        if (quantity <= lowStockThreshold * 2) { 
            return { label: 'Medium Stock', color: 'yellow', icon: FiActivity, bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-400' }
        }
        return { label: 'In Stock', color: 'green', icon: FiCheckCircle, bgColor: 'bg-green-100 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400' }
    }

    const getStockPercentage = () => {
        const totalStock = getProductTotalStock(product)
        const maxStock = parseFloat(product?.maximum_stock_quantity) || 100
        return Math.min((totalStock / maxStock) * 100, 100)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0.00'
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const getProfitMargin = () => {
        if (!product?.selling_price || !product?.purchase_price) return 0
        const profit = parseFloat(product.selling_price) - parseFloat(product.purchase_price)
        return ((profit / parseFloat(product.purchase_price)) * 100).toFixed(1)
    }

    // Parse attributes for display
    const parseAttributes = (attributes) => {
        if (!attributes) return null
        try {
            if (Array.isArray(attributes)) {
                return attributes.flatMap(item => Object.entries(item))
            }
            if (typeof attributes === 'object') {
                return Object.entries(attributes)
            }
            if (typeof attributes === 'string') {
                const parsed = JSON.parse(attributes)
                if (typeof parsed === 'string') {
                    return parseAttributes(parsed)
                }
                if (Array.isArray(parsed)) {
                    return parsed.flatMap(item => Object.entries(item))
                }
                return Object.entries(parsed)
            }
            return null
        } catch (e) {
            return null
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FiPackage className="w-6 h-6 text-primary-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return null
    }

    if (showEditForm) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Edit Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Update product information</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleCancelForm}
                            icon={FiArrowLeft}
                        >
                            Back to Details
                        </Button>
                    </div>

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

    const totalStock = getProductTotalStock(product)
    const stockRecords = getProductStocks(product)
    // Use the nested objects from the product response (from productsAPI.getById)
    const category = product.category || null
    const brand = product.brand || null
    const unit = product.unit || null
    const stockStatus = getStockStatus(totalStock)
    const profitMargin = getProfitMargin()
    const lowStockThreshold = parseFloat(product.minimum_stock_quantity) || 10
    const attributeEntries = parseAttributes(product.attributes)

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiPackage className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                            {product.name}
                                        </h1>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">SKU:</span>
                                            <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {product.sku}
                                            </code>
                                            <button
                                                onClick={handleCopySKU}
                                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                                            >
                                                <FiCopy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/products')}
                                    icon={FiArrowLeft}
                                    className="!px-3 !bg-gradient-to-r !from-gray-500 !to-gray-600 !text-white !border-none hover:!from-gray-600 hover:!to-gray-700 !shadow-md"
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShowQrBarcode}
                                    icon={FaQrcode}
                                    size="sm"
                                    className="!bg-gradient-to-r !from-purple-500 !to-purple-600 !text-white !border-none hover:!from-purple-600 hover:!to-purple-700 !shadow-md"
                                >
                                    QR Code
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleEdit}
                                    icon={FiEdit2}
                                    size="sm"
                                    className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !border-none hover:!from-blue-600 hover:!to-blue-700 !shadow-md"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    icon={FiTrash2}
                                    size="sm"
                                    className="!bg-gradient-to-r !from-red-600 !to-red-700 !text-white !border-none hover:!from-red-700 hover:!to-red-800 !shadow-md"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalStock}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg ${stockStatus.bgColor} flex items-center justify-center`}>
                                    <stockStatus.icon className={`w-5 h-5 ${stockStatus.textColor}`} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.textColor}`}>
                                    {stockStatus.label}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(product.selling_price)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <FaRupeeSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Purchase: {formatCurrency(product.purchase_price)}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</p>
                                    <p className={`text-2xl font-bold mt-1 ${profitMargin > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {profitMargin}%
                                    </p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg ${profitMargin > 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center`}>
                                    {profitMargin > 0 ? <FiTrendingUp className={`w-5 h-5 ${profitMargin > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} /> : <FiTrendingDown className={`w-5 h-5 ${profitMargin > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />}
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Profit: {formatCurrency(parseFloat(product.selling_price) - parseFloat(product.purchase_price))}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{category?.name || 'Uncategorized'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <FiTag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            {brand && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Brand: {brand.name}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Product Image */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-8"
                                            onError={(e) => {
                                                console.error(`Failed to load product image:`, product.image)
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
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUJBM0FGIi8+CjxwYXRoIGQ9Ik05NSAxMDBWMTA1SDEwMFY5OUg5NVoiIGZpbGw9IiM5QkEzQUYiLz4KPC9zdmc+'
                                                }
                                                e.target.onerror = null
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <FiPackage className="w-24 h-24 text-gray-300 dark:text-gray-600" />
                                            <p className="mt-4 text-gray-400 dark:text-gray-500">No image available</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Tabs Section */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <nav className="flex space-x-1 px-4 overflow-x-auto">
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
                                                    flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
                                                    ${activeTab === tab.id
                                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                    }
                                                `}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                <span className="hidden sm:inline">{tab.label}</span>
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
                                            {product.description && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                        <FiInfo className="w-4 h-4 mr-2 text-primary-500" />
                                                        Description
                                                    </h3>
                                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                    <FiPackage className="w-4 h-4 mr-2 text-primary-500" />
                                                    Product Information
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiTag className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {category?.name || 'Uncategorized'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiStar className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Brand</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {brand?.name || 'No brand'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiBox className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Unit</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {unit ? `${product.unit_amount || '1'} ${unit.name}` : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiActivity className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                                                            <StatusBadge
                                                                status={product.is_active ? 'active' : 'inactive'}
                                                                variant={product.is_active ? 'success' : 'default'}
                                                            />
                                                        </div>
                                                    </div>

                                                    {product.minimum_stock_quantity && (
                                                        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                            <FiAlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Low Stock Threshold</p>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {product.minimum_stock_quantity} units
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
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
                                            {attributeEntries && attributeEntries.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                        <FiClipboard className="w-4 h-4 mr-2 text-primary-500" />
                                                        Attributes
                                                    </h3>
                                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {attributeEntries.map(([key, value]) => (
                                                                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                                                                        {key}:
                                                                    </span>
                                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                                        {String(value)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                    <FiClock className="w-4 h-4 mr-2 text-primary-500" />
                                                    Timeline
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatDate(product.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <FiRefreshCw className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatDate(product.updated_at)}
                                                            </p>
                                                        </div>
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
                                                    {stockHistory.map((entry, index) => (
                                                        <motion.div
                                                            key={entry.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.type === 'purchase' ? 'bg-green-100 dark:bg-green-900/20' :
                                                                        entry.type === 'sale' ? 'bg-red-100 dark:bg-red-900/20' :
                                                                            'bg-yellow-100 dark:bg-yellow-900/20'
                                                                    }`}>
                                                                    {entry.type === 'purchase' ? (
                                                                        <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                                    ) : entry.type === 'sale' ? (
                                                                        <FiTrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                                    ) : (
                                                                        <FiActivity className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                                                    )}
                                                                </div>
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
                                                            <div className={`text-right font-semibold ${entry.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                                }`}>
                                                                {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-500 dark:text-gray-400">No stock history available</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Variants Tab */}
                                    {activeTab === 'variants' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {product.variants && product.variants.length > 0 ? (
                                                <div className="grid gap-3">
                                                    {product.variants.map((variant, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <div className="space-y-1">
                                                                {variant.size && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Size:</span>
                                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{variant.size}</span>
                                                                    </div>
                                                                )}
                                                                {variant.color && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Color:</span>
                                                                        <div className="flex items-center space-x-2">
                                                                            <div
                                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                                style={{ backgroundColor: variant.color.toLowerCase() }}
                                                                            />
                                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{variant.color}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {variant.material && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Material:</span>
                                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{variant.material}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {variant.price && (
                                                                <div className="text-right">
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {formatCurrency(variant.price)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <FiGrid className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-500 dark:text-gray-400">No variants available for this product</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Stock Card */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <FiShoppingCart className="w-5 h-5 mr-2 text-primary-500" />
                                        Stock Management
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.textColor}`}>
                                        {stockStatus.label}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {totalStock}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">units available</span>
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
                                                className={`h-full rounded-full transition-all ${getStockPercentage() <= 10 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                        getStockPercentage() <= 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                            'bg-gradient-to-r from-green-500 to-green-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Show stock breakdown by unit */}
                                    {stockRecords.length > 1 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Stock Breakdown:</p>
                                            <div className="space-y-1">
                                                {stockRecords.map((stock, idx) => {
                                                    const stockUnit = units.find(u => u.id === stock.unit_id)
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                {stockUnit ? stockUnit.name : `Unit ${stock.unit_id}`}
                                                            </span>
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {parseFloat(stock.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {product.minimum_stock_quantity && (
                                        <div className="flex justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <span className="text-gray-500 dark:text-gray-400">Low Stock Threshold</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{product.minimum_stock_quantity}</span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => setShowStockModal(true)}
                                        icon={FiPlus}
                                        className="w-full"
                                        disabled={!stockRecords.length}
                                    >
                                        Add Stock
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Pricing Details Card */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FaRupeeSign className="w-5 h-5 mr-2 text-primary-500" />
                                    Pricing Details
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Selling Price</span>
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(product.selling_price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Purchase Price</span>
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(product.purchase_price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Profit per Unit</span>
                                        <span className="text-base font-semibold text-green-600 dark:text-green-400">
                                            {formatCurrency(parseFloat(product.selling_price) - parseFloat(product.purchase_price))}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
                                        <span className={`text-base font-semibold ${profitMargin > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {profitMargin}%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
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
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                                >
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                                        <FiPackage className="w-4 h-4 mr-1" />
                                        Related Products
                                    </h3>
                                    <div className="space-y-2">
                                        {relatedProducts.map((related) => (
                                            <Link
                                                key={related.id}
                                                to={`/products/${related.id}`}
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FiPackage className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {related.name}
                                                    </p>
                                                    <p className="text-xs text-green-600 dark:text-green-400">
                                                        {formatCurrency(related.selling_price)}
                                                    </p>
                                                </div>
                                                <FiArrowLeft className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-180" />
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
                currentStock={totalStock}
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
                                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Product
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Are you sure you want to delete <span className="font-semibold">"{product.name}"</span>? This action cannot be undone.
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

            {/* QR Code & Barcode Modal - Using the reusable component */}
            {showQrBarcodeModal && (
                <QRBarcodePrintModal
                    isOpen={showQrBarcodeModal}
                    onClose={handleCloseQrBarcode}
                    product={product}
                    isMode="Product" // Specify that this is for a product
                    stock={null} // Pass null since we're using product level
                />
            )}
        </>
    )
}

export default ProductDetails