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
import { FaQrcode } from 'react-icons/fa'

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
    const [showQrBarcodeModal, setShowQrBarcodeModal] = useState(false)
    const [activeQrTab, setActiveQrTab] = useState('qr')
    const [printSettings, setPrintSettings] = useState({
        pageSize: 'A4',
        copies: 1,
        quantity: 0
    })
    const [isPrinting, setIsPrinting] = useState(false)

    // Update print settings quantity when stock data is available
    useEffect(() => {
        if (stocks?.quantity) {
            setPrintSettings(prev => ({ ...prev, quantity: stocks.quantity }))
        }
    }, [stocks?.quantity])

    // Fetch product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true)
            try {
                await fetchProducts()
                const productData = getProductById(parseInt(id))

                if (!productData) {
                    toast.error('Product not found')
                    navigate('/products')
                    return
                }

                setProduct(productData)

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

                const stocksResponse = await stockAPI.getAll()
                const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
                const productStock = stocksData.find(s => s.product_id === parseInt(id))
                setStocks(productStock || null)

                await fetchStockHistory()

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

            await fetchProducts()
            const updatedProductData = getProductById(parseInt(id))
            setProduct(updatedProductData)

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

            const stocksResponse = await stockAPI.getAll()
            const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
            const updatedStock = stocksData.find(s => s.product_id === parseInt(id))
            setStocks(updatedStock)

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
        try {
            await stockAPI.addStock(stocks.id, stockData.user_id, stockData.quantity)
            toast.success(`Stock added successfully! New stock: ${stockData.new_stock}`)

            const stocksResponse = await stockAPI.getAll()
            const stocksData = stocksResponse.data?.data?.data || stocksResponse.data?.data || []
            const updatedStock = stocksData.find(s => s.product_id === parseInt(id))
            setStocks(updatedStock)

            await fetchStockHistory()

            setShowStockModal(false)
        } catch (error) {
            console.error('Error adding stock:', error)
            toast.error('Failed to add stock')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteProduct(parseInt(id))
            toast.success('Product deleted successfully')
            navigate('/products')
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

    // Improved print function with proper layout and no gaps
    const handlePrintQrBarcode = () => {
        const quantity = printSettings.quantity || stocks?.quantity || 1
        const isQR = activeQrTab === 'qr'
        const imageUrl = isQR ? product.qr_code : product.barcode
        const label = isQR ? 'QR Code' : 'Barcode'
        
        if (!imageUrl) {
            toast.error(`${label} not available for this product`)
            return
        }
        
        setIsPrinting(true)
        
        // Define layout constants
        const isA4 = printSettings.pageSize === 'A4'
        
        // For A4: 3 columns, flexible rows
        // For Thermal: 1 column, each code on its own page/slip
        
        let htmlContent = ''
        
        if (isA4) {
            // A4 layout with 3 columns and proper grid that fills pages completely
            const itemsPerPage = 12 // 3 columns x 4 rows = 12 items per page (optimal for A4)
            const totalPages = Math.ceil(quantity / itemsPerPage)
            
            for (let page = 0; page < totalPages; page++) {
                const startIdx = page * itemsPerPage
                const endIdx = Math.min(startIdx + itemsPerPage, quantity)
                const itemsOnPage = endIdx - startIdx
                
                // Calculate rows needed for this page (ceil(itemsOnPage / 3))
                const rowsNeeded = Math.ceil(itemsOnPage / 3)
                
                htmlContent += `
                    <div class="a4-page">
                        <div class="page-header">
                            <h2>${label}s - ${product.name}</h2>
                            <p class="page-number">Page ${page + 1} of ${totalPages}</p>
                        </div>
                        <div class="qr-grid" style="--rows: ${rowsNeeded};">
                `
                
                for (let i = 0; i < itemsOnPage; i++) {
                    const itemNumber = startIdx + i + 1
                    htmlContent += `
                        <div class="qr-item">
                            <div class="qr-image-wrapper">
                                <img src="${imageUrl}" class="qr-image ${isQR ? 'qr-type' : 'barcode-type'}" />
                            </div>
                            <div class="qr-info">
                                <div class="product-name">${escapeHtml(product.name)}</div>
                                <div class="product-sku">SKU: ${product.sku}</div>
                                <div class="product-number">#${itemNumber}</div>
                            </div>
                        </div>
                    `
                }
                
                // Fill remaining slots on last page with empty divs to maintain grid structure
                if (page === totalPages - 1 && itemsOnPage < itemsPerPage) {
                    const remainingSlots = itemsPerPage - itemsOnPage
                    for (let i = 0; i < remainingSlots; i++) {
                        htmlContent += `<div class="qr-item empty-item"></div>`
                    }
                }
                
                htmlContent += `
                        </div>
                    </div>
                `
            }
        } else {
            // Thermal printer layout (3x5 inch) - each on separate page with no gaps
            for (let i = 0; i < quantity; i++) {
                htmlContent += `
                    <div class="thermal-page">
                        <div class="thermal-content">
                            <div class="thermal-image-wrapper">
                                <img src="${imageUrl}" class="thermal-image ${isQR ? 'qr-type' : 'barcode-type'}" />
                            </div>
                            <div class="thermal-info">
                                <div class="thermal-product-name">${escapeHtml(product.name)}</div>
                                <div class="thermal-sku">SKU: ${product.sku}</div>
                                <div class="thermal-number">#${i + 1} of ${quantity}</div>
                            </div>
                        </div>
                    </div>
                `
            }
        }
        
        const styles = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: white;
                    margin: 0;
                    padding: 0;
                }
                
                /* A4 Styles */
                .a4-page {
                    page-break-after: always;
                    page-break-inside: avoid;
                    min-height: 297mm;
                    padding: 15mm;
                    background: white;
                    position: relative;
                }
                
                .a4-page:last-child {
                    page-break-after: auto;
                }
                
                .page-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e5e7eb;
                }
                
                .page-header h2 {
                    font-size: 18px;
                    color: #1f2937;
                    margin-bottom: 5px;
                }
                
                .page-number {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .qr-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    align-items: start;
                }
                
                .qr-item {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 15px;
                    text-align: center;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .qr-item.empty-item {
                    visibility: hidden;
                    border: 1px dashed #e5e7eb;
                    background: transparent;
                    box-shadow: none;
                }
                
                .qr-image-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 12px;
                }
                
                .qr-image {
                    display: block;
                }
                
                .qr-image.qr-type {
                    width: 120px;
                    height: 120px;
                }
                
                .qr-image.barcode-type {
                    width: 220px;
                    height: 70px;
                }
                
                .qr-info {
                    text-align: center;
                }
                
                .product-name {
                    font-weight: 600;
                    font-size: 13px;
                    color: #1f2937;
                    margin-bottom: 4px;
                    word-break: break-word;
                }
                
                .product-sku {
                    font-size: 10px;
                    color: #6b7280;
                    font-family: monospace;
                    margin-bottom: 4px;
                }
                
                .product-number {
                    font-size: 10px;
                    color: #9ca3af;
                }
                
                /* Thermal Styles (3x5 inch) */
                .thermal-page {
                    page-break-after: always;
                    page-break-inside: avoid;
                    width: 3in;
                    height: 5in;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: white;
                    margin: 0;
                    padding: 0.2in;
                    box-sizing: border-box;
                }
                
                .thermal-page:last-child {
                    page-break-after: auto;
                }
                
                .thermal-content {
                    text-align: center;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: white;
                    padding: 10px;
                }
                
                .thermal-image-wrapper {
                    flex-shrink: 0;
                    margin-bottom: 15px;
                }
                
                .thermal-image {
                    display: block;
                    margin: 0 auto;
                }
                
                .thermal-image.qr-type {
                    width: 1.4in;
                    height: 1.4in;
                }
                
                .thermal-image.barcode-type {
                    width: 2.2in;
                    height: 0.8in;
                }
                
                .thermal-info {
                    flex-shrink: 0;
                }
                
                .thermal-product-name {
                    font-weight: 600;
                    font-size: 11px;
                    color: #1f2937;
                    text-align: center;
                    margin-bottom: 6px;
                    word-break: break-word;
                    max-width: 2.5in;
                }
                
                .thermal-sku {
                    font-size: 9px;
                    color: #6b7280;
                    font-family: monospace;
                    margin-bottom: 6px;
                    text-align: center;
                }
                
                .thermal-number {
                    font-size: 8px;
                    color: #9ca3af;
                    text-align: center;
                }
                
                /* Print-specific overrides */
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* A4 page breaks */
                    .a4-page {
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    
                    /* Thermal page breaks */
                    .thermal-page {
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    
                    /* Ensure images print properly */
                    img {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Remove gaps from empty items */
                    .empty-item {
                        display: block !important;
                        visibility: hidden !important;
                    }
                    
                    /* Prevent orphan rows in A4 */
                    .qr-grid {
                        page-break-inside: avoid;
                    }
                }
                
                /* Small screen adjustments for preview */
                @media screen and (max-width: 768px) {
                    .qr-grid {
                        gap: 12px;
                    }
                    
                    .qr-item {
                        padding: 10px;
                    }
                    
                    .qr-image.qr-type {
                        width: 80px;
                        height: 80px;
                    }
                    
                    .qr-image.barcode-type {
                        width: 160px;
                        height: 50px;
                    }
                }
            </style>
        `
        
        // Escape HTML function to prevent XSS and formatting issues
        function escapeHtml(str) {
            if (!str) return ''
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
        }
        
        const fullHtml = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Print ${label}s - ${escapeHtml(product.name)}</title>
                ${styles}
            </head>
            <body>
                ${htmlContent}
            </body>
        </html>`
        
        // Create iframe for printing
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = 0
        iframe.style.bottom = 0
        iframe.style.width = 0
        iframe.style.height = 0
        iframe.style.border = 'none'
        iframe.style.visibility = 'hidden'
        
        document.body.appendChild(iframe)
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
        iframeDoc.open()
        iframeDoc.write(fullHtml)
        iframeDoc.close()
        
        // Wait for all images to load before printing
        const images = iframeDoc.querySelectorAll('img')
        let imagesLoaded = 0
        
        if (images.length === 0) {
            performPrint()
        } else {
            images.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    imagesLoaded++
                    if (imagesLoaded === images.length) performPrint()
                } else {
                    img.onload = () => {
                        imagesLoaded++
                        if (imagesLoaded === images.length) performPrint()
                    }
                    img.onerror = () => {
                        imagesLoaded++
                        if (imagesLoaded === images.length) performPrint()
                    }
                }
            })
        }
        
        function performPrint() {
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus()
                    iframe.contentWindow.print()
                    toast.success(`Printing ${quantity} ${label.toLowerCase()}(s) on ${printSettings.pageSize === 'A4' ? 'A4' : 'Thermal (3x5")'} paper`)
                } catch (error) {
                    console.error('Print error:', error)
                    toast.error('Failed to print. Please try again.')
                } finally {
                    setTimeout(() => {
                        document.body.removeChild(iframe)
                        setIsPrinting(false)
                    }, 500)
                }
            }, 500)
        }
    }

    const getStockStatus = (quantity) => {
        if (!quantity || quantity === 0) return { label: 'Out of Stock', color: 'red', icon: FiXCircle, bgColor: 'bg-red-100 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400' }
        if (quantity <= (product.lowStockThreshold || 10)) return { label: 'Low Stock', color: 'orange', icon: FiAlertCircle, bgColor: 'bg-orange-100 dark:bg-orange-900/20', textColor: 'text-orange-700 dark:text-orange-400' }
        if (quantity <= (product.lowStockThreshold || 10) * 2) return { label: 'Medium Stock', color: 'yellow', icon: FiActivity, bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-400' }
        return { label: 'In Stock', color: 'green', icon: FiCheckCircle, bgColor: 'bg-green-100 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400' }
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
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stocks?.quantity || 0}</p>
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
                                    <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
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
                                <p className="text-xs text-gray-500 dark:text-gray-400">Profit: {formatCurrency(product.selling_price - product.purchase_price)}</p>
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
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUJBM0FGIi8+CjxwYXRoIGQ9Ik05NSAxMDBWMTA1SDEwMFY5OUg5NVoiIGZpbGw9IiM5QkEzQUYiLz4KPC9zdmc+'
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
                                            {product.attributes && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                        <FiClipboard className="w-4 h-4 mr-2 text-primary-500" />
                                                        Attributes
                                                    </h3>
                                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
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
                                                                    )
                                                                }
                                                            }
                                                            return <p className="text-gray-500 dark:text-gray-400 text-center py-4">No attributes defined</p>
                                                        })()}
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
                                            {stocks?.quantity || 0}
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

                                    {product.lowStockThreshold && (
                                        <div className="flex justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <span className="text-gray-500 dark:text-gray-400">Low Stock Threshold</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{product.lowStockThreshold}</span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => setShowStockModal(true)}
                                        icon={FiPlus}
                                        className="w-full"
                                        disabled={!stocks}
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
                                    <FiDollarSign className="w-5 h-5 mr-2 text-primary-500" />
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
                                            {formatCurrency(product.selling_price - product.purchase_price)}
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

            {/* QR Code & Barcode Modal */}
            <AnimatePresence>
                {showQrBarcodeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseQrBarcode}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    QR Code & Barcode
                                </h3>
                                <Button
                                    variant="outline"
                                    onClick={handleCloseQrBarcode}
                                    icon={FiX}
                                    className="!p-2"
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="p-6">
                                {/* Print Settings */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Print Settings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Page Size
                                            </label>
                                            <select
                                                value={printSettings.pageSize}
                                                onChange={(e) => setPrintSettings(prev => ({ ...prev, pageSize: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="A4">A4 Paper (210×297mm)</option>
                                                <option value="Thermal">Thermal Label (3×5 inch)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Quantity to Print
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={stocks?.quantity || 0}
                                                value={printSettings.quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0
                                                    const maxQuantity = stocks?.quantity || 0
                                                    if (value > maxQuantity) {
                                                        toast.error(`Cannot print more than available stock (${maxQuantity})`)
                                                        return
                                                    }
                                                    setPrintSettings(prev => ({ ...prev, quantity: value }))
                                                }}
                                                placeholder={`Current stock: ${stocks?.quantity || 0}`}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                onClick={handlePrintQrBarcode}
                                                icon={FiPrinter}
                                                className="w-full"
                                                disabled={isPrinting || !printSettings.quantity || (!product.qr_code && activeQrTab === 'qr') || (!product.barcode && activeQrTab === 'barcode')}
                                            >
                                                {isPrinting ? 'Preparing...' : `Print ${activeQrTab === 'qr' ? 'QR Codes' : 'Barcodes'}`}
                                            </Button>
                                        </div>
                                    </div>
                                    {printSettings.pageSize === 'Thermal' && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                            💡 Thermal label size: 3 inches wide × 5 inches tall. Each barcode/QR code prints on a separate label.
                                        </p>
                                    )}
                                    {printSettings.pageSize === 'A4' && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                            💡 A4 sheet layout: 3 columns per page, up to 12 items per page. Pages are automatically filled with no gaps.
                                        </p>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                                    <button
                                        onClick={() => setActiveQrTab('qr')}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeQrTab === 'qr'
                                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        QR Code
                                    </button>
                                    <button
                                        onClick={() => setActiveQrTab('barcode')}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeQrTab === 'barcode'
                                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Barcode
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    {activeQrTab === 'qr' && product.qr_code && (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Scan this QR code to view product details
                                            </p>
                                            <div className="inline-block p-6 bg-white rounded-xl shadow-md">
                                                <img
                                                    src={product.qr_code}
                                                    alt="Product QR Code"
                                                    className="w-64 h-64 object-contain"
                                                    onError={(e) => {
                                                        console.error('Failed to load QR code:', product.qr_code)
                                                        e.target.style.display = 'none'
                                                        const parent = e.target.parentElement
                                                        const errorDiv = document.createElement('div')
                                                        errorDiv.className = 'w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'
                                                        errorDiv.innerHTML = `
                              <div class="text-center">
                                <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p class="text-sm text-gray-500 mt-2">QR Code Unavailable</p>
                              </div>
                            `
                                                        parent.appendChild(errorDiv)
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        const link = document.createElement('a')
                                                        link.href = product.qr_code
                                                        link.download = `${product.name.replace(/[^a-z0-9]/gi, '_')}_qr_code.svg`
                                                        link.click()
                                                    }}
                                                >
                                                    Download QR Code
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {activeQrTab === 'barcode' && product.barcode && (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Product Barcode for scanning
                                            </p>
                                            <div className="inline-block p-6 bg-white rounded-xl shadow-md">
                                                <img
                                                    src={product.barcode}
                                                    alt="Product Barcode"
                                                    className="h-32 object-contain"
                                                    onError={(e) => {
                                                        console.error('Failed to load barcode:', product.barcode)
                                                        e.target.style.display = 'none'
                                                        const parent = e.target.parentElement
                                                        const errorDiv = document.createElement('div')
                                                        errorDiv.className = 'h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'
                                                        errorDiv.innerHTML = `
                                                            <div class="text-center">
                                                                <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"></path>
                                                                </svg>
                                                                <p class="text-sm text-gray-500 mt-2">Barcode Unavailable</p>
                                                            </div>
                                                        `
                                                        parent.appendChild(errorDiv)
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        const link = document.createElement('a')
                                                        link.href = product.barcode
                                                        link.download = `${product.name.replace(/[^a-z0-9]/gi, '_')}_barcode.png`
                                                        link.click()
                                                    }}
                                                >
                                                    Download Barcode
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {!((activeQrTab === 'qr' && product.qr_code) || (activeQrTab === 'barcode' && product.barcode)) && (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FiX className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {activeQrTab === 'qr' ? 'QR Code' : 'Barcode'} not available for this product
                                            </p>
                                        </div>
                                    )}
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