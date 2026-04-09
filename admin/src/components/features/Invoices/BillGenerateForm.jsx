import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiX, FiPlus, FiTrash2, FiUser, FiShoppingCart, FiDollarSign, FiPackage, FiSearch, FiAlertCircle, FiMinus } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import EmptyState from '../../common/EmptyState/EmptyState'
import { invoiceAPI } from '../../../services/invoiceService'
import { stockAPI } from '../../../services/stockService'
import { useAuthStore } from '../../../store/authStore'
// Import mock data as fallback
import { mockCustomers } from '../../../services/mockData/mockCustomers'
import { mockStores } from '../../../services/mockData/mockStores'
import { mockProducts } from '../../../services/mockData/mockProducts'
import { mockUnits } from '../../../services/mockData/mockUnits'

// Cache for bill generate data
let billGenerateCache = null
let lastFetchTime = null
const CACHE_EXPIRY = 30 * 1000 // 30 seconds

const BillGenerateForm = ({ initialData, mode, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  
  // Get current user ID
  const getUserId = () => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        return parsed.user?.id || parsed.userId || '1'
      } catch {
        return '1'
      }
    }
    return '1'
  }

  const currentUserId = getUserId()

  const [formData, setFormData] = useState({
    user_id: currentUserId, // API requires user_id (register user id)
    customer_id: '',
    store_id: '',
    paid_amount: 0,
    created_by: currentUserId,
    items: [],
    payment_status: 'paid', // New field: 'paid', 'semi_paid', 'non_paid'
    payment_amount: 0 // New field: for semi-paid amount
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState([])
  const [units, setUnits] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductList, setShowProductList] = useState(false)
  
  // Search states for customer and store
  const [customerSearch, setCustomerSearch] = useState('')
  const [storeSearch, setStoreSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showStoreDropdown, setShowStoreDropdown] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  
  // Enhanced product search state
  const [filteredProducts, setFilteredProducts] = useState([])

  // Check if we have valid cached data
  const isCacheValid = () => {
    return billGenerateCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_EXPIRY
  }

  const fetchInitialData = async () => {
    // Use cached data if available and valid
    if (isCacheValid()) {
      console.log('Using cached bill generate data')
      const data = billGenerateCache
      
      const customersList = data.customers || data.bill_customer || data.customer || []
      const storesList = data.stores || data.store || []
      const productsList = data.products || data.product || []
      const unitsList = data.units || data.unit || []
      
      setCustomers(customersList.length > 0 ? customersList : mockCustomers)
      setStores(storesList.length > 0 ? storesList : mockStores)
      setProducts(productsList.length > 0 ? productsList : mockProducts)
      setUnits(unitsList.length > 0 ? unitsList : mockUnits)
      
      // Auto-select first store if no store is selected
      if (storesList.length > 0 && !formData.store_id) {
        const firstStoreId = storesList[0].id
        setFormData(prev => ({
          ...prev,
          store_id: firstStoreId
        }))
      }
      
      return
    }

    setLoading(true)
    try {
      const response = await invoiceAPI.getBillGenerateData()
      console.log('Full API response:', response)
      console.log('Response data:', response.data)
      
      // Try different possible response structures
      let data = {}
      if (response.data) {
        if (response.data.data) {
          data = response.data.data
        } else {
          data = response.data
        }
      }
      
      console.log('Final data object:', data)
      
      // Cache the data
      billGenerateCache = data
      lastFetchTime = Date.now()
      
      // Extract customers with possible different field names
      const customersList = data.customers || data.bill_customer || data.customer || []
      const storesList = data.stores || data.store || []
      const productsList = data.products || data.product || []
      const unitsList = data.units || data.unit || []
      
      console.log('Customers raw:', customersList)
      console.log('Stores raw:', storesList)
      console.log('Products raw:', productsList)
      console.log('Units raw:', unitsList)
      
      // Use API data if available, otherwise fall back to mock data
      setCustomers(customersList.length > 0 ? customersList : mockCustomers)
      setStores(storesList.length > 0 ? storesList : mockStores)
      setProducts(productsList.length > 0 ? productsList : mockProducts)
      setUnits(unitsList.length > 0 ? unitsList : mockUnits)
      
      // Auto-select first store if no store is selected
      if (storesList.length > 0 && !formData.store_id) {
        const firstStoreId = storesList[0].id
        console.log('Auto-selecting first store:', firstStoreId)
        setFormData(prev => ({
          ...prev,
          store_id: firstStoreId
        }))
      }
      
      const finalCustomers = customersList.length > 0 ? customersList : mockCustomers
      const finalStores = storesList.length > 0 ? storesList : mockStores
      const finalProducts = productsList.length > 0 ? productsList : mockProducts
      const finalUnits = unitsList.length > 0 ? unitsList : mockUnits
      
      console.log('Final counts - Customers:', finalCustomers.length, 'Stores:', finalStores.length, 'Products:', finalProducts.length, 'Units:', finalUnits.length)
      console.log('Using API data for customers, stores, products and mock data for units')
      
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      console.error('Error details:', error.response)
      
      // Fall back to mock data on error
      setCustomers(mockCustomers)
      setStores(mockStores)
      setProducts(mockProducts)
      setUnits(mockUnits)
      console.log('Using mock data due to API error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  // Filter customers based on search
  useEffect(() => {
    if (customerSearch.trim() === '') {
      setFilteredCustomers(customers)
    } else {
      const searchLower = customerSearch.toLowerCase()
      const filtered = customers.filter(customer => 
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.address?.toLowerCase().includes(searchLower) ||
        customer.gst?.toLowerCase().includes(searchLower)
      )
      setFilteredCustomers(filtered)
    }
  }, [customerSearch, customers])

  // Filter stores based on search
  useEffect(() => {
    if (storeSearch.trim() === '') {
      setFilteredStores(stores)
    } else {
      const searchLower = storeSearch.toLowerCase()
      const filtered = stores.filter(store => 
        store.name?.toLowerCase().includes(searchLower) ||
        store.mobile?.toLowerCase().includes(searchLower) ||
        store.email?.toLowerCase().includes(searchLower) ||
        store.address?.toLowerCase().includes(searchLower) ||
        store.city?.toLowerCase().includes(searchLower) ||
        store.gst?.toLowerCase().includes(searchLower)
      )
      setFilteredStores(filtered)
    }
  }, [storeSearch, stores])

  // Filter products based on search
  useEffect(() => {
    if (productSearch.trim() === '') {
      setFilteredProducts(products)
    } else {
      const searchLower = productSearch.toLowerCase()
      const filtered = products.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.product_name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.code?.toLowerCase().includes(searchLower) ||
        product.product_code?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.name?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower)
      )
      setFilteredProducts(filtered)
    }
  }, [productSearch, products])

  // Initialize search values when data is loaded
  useEffect(() => {
    if (customers.length > 0 && formData.customer_id) {
      const customer = customers.find(c => c.id === formData.customer_id)
      if (customer) {
        setCustomerSearch(customer.name || customer.customer_name)
      }
    }
    if (stores.length > 0 && formData.store_id) {
      const store = stores.find(s => s.id === formData.store_id)
      if (store) {
        setStoreSearch(store.name || store.store_name)
      }
    }
  }, [customers, stores, formData.customer_id, formData.store_id])

  const handleAddItem = async (product) => {
    try {
      // Check if product already exists in items
      const existingItemIndex = formData.items.findIndex(item => item.product_id === product.id)
      
      if (existingItemIndex !== -1) {
        // Product exists, update quantity
        const updatedItems = [...formData.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
          item_count: updatedItems[existingItemIndex].item_count + 1
        }
        
        setFormData(prev => ({
          ...prev,
          items: updatedItems
        }))
        
        console.log('🔄 Updated existing product quantity:', updatedItems[existingItemIndex])
      } else {
        // New product, add to list
        // Fetch stock data for this product to get real price
        const stockResponse = await stockAPI.getAll(product.name || product.product_name)
        console.log('Stock API response:', stockResponse)
        
        // Extract stock data from the nested structure
        const stockList = stockResponse.data?.data?.data || stockResponse.data?.data || []
        console.log('Stock list:', stockList)
        
        const stockItem = stockList.find(stock => stock.product_id === product.id)
        console.log('Found stock item:', stockItem)
        
        const unit = units.find(u => u.id === product.unit_id)
        
        // Use product data for GST and discount, stock data for price if available
        const sellingPrice = stockItem?.selling_price || product.selling_price || product.price || 0
        const purchasePrice = stockItem?.purchase_price || product.purchase_price || product.cost || 0
        const gst = parseFloat(product.gst_percentage) || parseFloat(stockItem?.gst_percentage) || parseFloat(product.gst) || 0
        const discount = parseFloat(product.discount_percentage) || parseFloat(stockItem?.discount) || parseFloat(product.discount) || 0
        const stockQuantity = stockItem?.quantity || 0
        const stockId = stockItem?.id || null
        
        console.log('Product pricing - Selling:', sellingPrice, 'GST:', gst, 'Discount:', discount, 'Stock:', stockQuantity, 'Stock ID:', stockId)
        
        const newItem = {
          product_id: product.id,
          product_name: product.name || product.product_name,
          product_code: product.sku || product.code || product.product_code,
          quantity: 1,
          item_count: 1,
          unit_id: product.unit_id,
          unit_name: unit?.short_name || unit?.name || 'pcs',
          price: parseFloat(sellingPrice) || 0,
          purchase_price: parseFloat(purchasePrice) || 0,
          gst: gst,
          discount: discount,
          total_price: parseFloat(sellingPrice) || 0,
          status: 'completed',
          stock_quantity: stockQuantity,
          stock_id: stockId // Add stock_id field
        }
        
        setFormData(prev => ({
          ...prev,
          items: [...prev.items, newItem]
        }))
        
        setShowProductList(false)
        setProductSearch('')
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      // Fallback to product data if stock fetch fails
      const unit = units.find(u => u.id === product.unit_id)
      
      // Use product data for GST and discount
      const sellingPrice = parseFloat(product.selling_price) || parseFloat(product.price) || 0
      const purchasePrice = parseFloat(product.purchase_price) || parseFloat(product.cost) || 0
      const gst = parseFloat(product.gst_percentage) || parseFloat(product.gst) || 0
      const discount = parseFloat(product.discount_percentage) || parseFloat(product.discount) || 0
      
      const newItem = {
        product_id: product.id,
        product_name: product.name || product.product_name,
        product_code: product.sku || product.code || product.product_code,
        quantity: 1,
        item_count: 1,
        unit_id: product.unit_id,
        unit_name: unit?.short_name || unit?.name || 'pcs',
        price: sellingPrice,
        purchase_price: purchasePrice,
        gst: gst,
        discount: discount,
        total_price: sellingPrice,
        status: 'completed',
        stock_quantity: 0,
        stock_id: null // No stock data available
      }
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }))
      
      setShowProductList(false)
      setProductSearch('')
    }
  }

  const handleUpdateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      const item = newItems[index]
      
      if (field === 'quantity') {
        const newQuantity = parseFloat(value) || 0
        
        // Validate against stock quantity
        if (item.stock_quantity > 0 && newQuantity > item.stock_quantity) {
          console.warn(`Cannot add more than available stock. Available: ${item.stock_quantity}, Requested: ${newQuantity}`)
          // Don't update if it exceeds stock
          return prev
        }
        
        item.quantity = newQuantity
        item.item_count = newQuantity
        
        // Recalculate total price
        const basePrice = item.price * item.quantity
        const gstAmount = basePrice * (item.gst / 100)
        const discountAmount = basePrice * (item.discount / 100)
        item.total_price = basePrice + gstAmount - discountAmount
      } else if (field === 'price' || field === 'gst' || field === 'discount') {
        const numValue = parseFloat(value) || 0
        item[field] = numValue
        
        // Recalculate total price
        const basePrice = item.price * item.quantity
        const gstAmount = basePrice * (item.gst / 100)
        const discountAmount = basePrice * (item.discount / 100)
        item.total_price = basePrice + gstAmount - discountAmount
      } else {
        item[field] = value
      }
      
      return { ...prev, items: newItems }
    })
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // Customer selection handlers
  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer_id: customer.id
    }))
    setCustomerSearch(customer.name || customer.customer_name)
    setShowCustomerDropdown(false)
  }

  const handleCustomerSearchChange = (value) => {
    setCustomerSearch(value)
    setShowCustomerDropdown(true)
  }

  // Store selection handlers
  const handleStoreSelect = (store) => {
    setFormData(prev => ({
      ...prev,
      store_id: store.id
    }))
    setStoreSearch(store.name || store.store_name)
    setShowStoreDropdown(false)
  }

  const handleStoreSearchChange = (value) => {
    setStoreSearch(value)
    setShowStoreDropdown(true)
  }

  // Get display names for selected customer and store
  const getSelectedCustomerName = () => {
    const customer = customers.find(c => c.id === formData.customer_id)
    return customer?.name || customer?.customer_name || customerSearch
  }

  const getSelectedStoreName = () => {
    const store = stores.find(s => s.id === formData.store_id)
    return store?.name || store?.store_name || storeSearch
  }

  // Quantity increment/decrement handlers
  const handleIncrementQuantity = (index) => {
    const item = formData.items[index]
    const maxValue = item.stock_quantity > 0 ? item.stock_quantity : undefined
    const newQuantity = parseFloat(item.quantity) + 1
    
    if (maxValue && newQuantity > maxValue) {
      return // Don't exceed stock limit
    }
    
    handleUpdateItem(index, 'quantity', newQuantity)
  }

  const handleDecrementQuantity = (index) => {
    const item = formData.items[index]
    const newQuantity = parseFloat(item.quantity) - 1
    
    if (newQuantity >= 1) {
      handleUpdateItem(index, 'quantity', newQuantity)
    }
  }

  // GST increment/decrement handlers
  const handleIncrementGst = (index) => {
    const item = formData.items[index]
    const newGst = parseFloat(item.gst) + 1
    
    if (newGst <= 100) {
      handleUpdateItem(index, 'gst', newGst)
    }
  }

  const handleDecrementGst = (index) => {
    const item = formData.items[index]
    const newGst = parseFloat(item.gst) - 1
    
    if (newGst >= 0) {
      handleUpdateItem(index, 'gst', newGst)
    }
  }

  // Discount increment/decrement handlers
  const handleIncrementDiscount = (index) => {
    const item = formData.items[index]
    const newDiscount = parseFloat(item.discount) + 1
    
    if (newDiscount <= 100) {
      handleUpdateItem(index, 'discount', newDiscount)
    }
  }

  const handleDecrementDiscount = (index) => {
    const item = formData.items[index]
    const newDiscount = parseFloat(item.discount) - 1
    
    if (newDiscount >= 0) {
      handleUpdateItem(index, 'discount', newDiscount)
    }
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalGst = formData.items.reduce((sum, item) => {
      const basePrice = item.price * item.quantity
      return sum + (basePrice * (item.gst / 100))
    }, 0)
    const totalDiscount = formData.items.reduce((sum, item) => {
      const basePrice = item.price * item.quantity
      return sum + (basePrice * (item.discount / 100))
    }, 0)
    const totalAmount = formData.items.reduce((sum, item) => sum + item.total_price, 0)
    
    return { subtotal, totalGst, totalDiscount, totalAmount }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.customer_id || !formData.store_id || formData.items.length === 0) {
      setError('Please fill all required fields and add at least one item')
      return
    }
    
    // Check for stock validation
    const stockIssues = formData.items.filter(item => 
      item.stock_quantity > 0 && item.quantity > item.stock_quantity
    )
    
    if (stockIssues.length > 0) {
      setError(`Cannot proceed. ${stockIssues.length} item(s) exceed available stock. Please adjust quantities.`)
      return
    }
    
    // Validate payment amount for semi-paid
    if (formData.payment_status === 'semi_paid') {
      const totals = calculateTotals()
      if (!formData.payment_amount || formData.payment_amount <= 0) {
        setError('Please enter a valid payment amount for semi-paid option')
        return
      }
      if (parseFloat(formData.payment_amount) > totals.totalAmount) {
        setError('Payment amount cannot exceed total invoice amount')
        return
      }
    }
    
    const totals = calculateTotals()
    const submissionData = {
      ...formData,
      paid_amount: formData.payment_status === 'paid' ? totals.totalAmount.toString() : 
                  formData.payment_status === 'semi_paid' ? formData.payment_amount.toString() : '0'
    }
    
    onSubmit(submissionData)
  }

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.customer-dropdown')) {
        setShowCustomerDropdown(false)
      }
      if (!event.target.closest('.store-dropdown')) {
        setShowStoreDropdown(false)
      }
      if (!event.target.closest('.product-dropdown')) {
        setShowProductList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <FiShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generate New Invoice
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create invoice with stock management
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={FiX}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FiSave}
            loading={isSubmitting}
            disabled={formData.items.length === 0}
          >
            Generate Invoice
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
        >
          {error}
        </motion.div>
      )}

      {/* Stock Warning */}
      {formData.items.some(item => item.stock_quantity > 0 && item.quantity > item.stock_quantity) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-700 dark:text-yellow-300"
        >
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            <span>
              Some items exceed available stock. Please adjust quantities or the system will automatically limit them to available stock.
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiUser className="w-4 h-4 mr-2" />
              Customer Information
            </h3>

            <div className="space-y-4">
              {/* Customer Searchable Dropdown */}
              <div className="relative customer-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Customer
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search customer by name, phone, email..."
                    value={customerSearch}
                    onChange={(e) => handleCustomerSearchChange(e.target.value)}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="pr-10"
                    required
                  />
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {/* Customer Dropdown */}
                {showCustomerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => handleCustomerSelect(customer)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {customer.name || customer.customer_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            📞 {customer.phone || 'N/A'} | 📧 {customer.email || 'N/A'}
                          </div>
                          {customer.gst && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              GST: {customer.gst}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        No customers found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Store Searchable Dropdown */}
              <div className="relative store-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Store
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search store by name, phone, email..."
                    value={storeSearch}
                    onChange={(e) => handleStoreSearchChange(e.target.value)}
                    onFocus={() => setShowStoreDropdown(true)}
                    className="pr-10"
                    required
                  />
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {/* Store Dropdown */}
                {showStoreDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStores.length > 0 ? (
                      filteredStores.map(store => (
                        <div
                          key={store.id}
                          onClick={() => handleStoreSelect(store)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {store.name || store.store_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            📞 {store.mobile || store.phone || 'N/A'} | 📧 {store.email || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {store.address}, {store.city}
                          </div>
                          {store.gst && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              GST: {store.gst}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        No stores found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {formData.customer_id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getSelectedCustomerName()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Customer ID: #{formData.customer_id}
                  </p>
                </motion.div>
              )}

              {formData.store_id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 hidden"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stores.find(s => s.id === formData.store_id)?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Store ID: #{formData.store_id}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Product Search */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiPackage className="w-4 h-4 mr-2" />
              Add Products
            </h3>

            <div className="space-y-4">
              <div className="relative product-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products by name, SKU, brand, category..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      setShowProductList(true)
                    }}
                    onFocus={() => setShowProductList(true)}
                    className="pl-10"
                  />
                </div>
                <AnimatePresence>
                {showProductList && productSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-80 overflow-y-auto"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div
                          key={product.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => handleAddItem(product)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white mb-1">
                                {product.name || product.product_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <div>
                                  📦 SKU: {product.sku || product.code || product.product_code || 'N/A'}
                                </div>
                                {product.brand?.name && (
                                  <div>
                                    🏷️ Brand: {product.brand.name}
                                  </div>
                                )}
                                {product.category?.name && (
                                  <div>
                                    📂 Category: {product.category.name}
                                  </div>
                                )}
                                {product.description && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                    📝 {product.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                ₹{parseFloat(product.selling_price || product.price || 0).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                                <div>
                                  💰 Cost: ₹{parseFloat(product.purchase_price || product.cost || 0).toFixed(2)}
                                </div>
                                {product.stocks && product.stocks.length > 0 && (
                                  <div>
                                    📊 Stock: {product.stocks[0].quantity || 'N/A'} {product.unit?.short_name || product.unit?.name || 'pcs'}
                                  </div>
                                )}
                                {product.gst_percentage && (
                                  <div>
                                    📈 GST: {parseFloat(product.gst_percentage).toFixed(1)}%
                                  </div>
                                )}
                                {product.discount_percentage && (
                                  <div>
                                    🎁 Discount: {parseFloat(product.discount_percentage).toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No products found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {formData.items.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Added Items ({formData.items.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Invoice Items ({formData.items.length})
          </h3>
        </div>
        
        {formData.items.length === 0 ? (
          <EmptyState
            icon={FiPackage}
            title="No items added"
            description="Search and add products to create your invoice"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-3">Product</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">Qty</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">Price</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">GST %</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">Discount %</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">Total</th>
                  <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <td className="py-3">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.product_code}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.unit_name}</p>
                        {item.stock_quantity !== undefined && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">Stock: {item.stock_quantity}</p>
                        )}
                        {item.stock_quantity > 0 && (
                          <p className="text-xs text-gray-500">Max: {item.stock_quantity}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleDecrementQuantity(index)}
                          disabled={parseFloat(item.quantity) <= 1}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Decrease quantity"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <Input
                          type="text"
                          min="1"
                          max={item.stock_quantity > 0 ? item.stock_quantity : undefined}
                          value={item.quantity.toString()}
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                          className={`w-14 text-sm text-center ${
                            item.stock_quantity > 0 && item.quantity > item.stock_quantity 
                              ? 'border-red-500 bg-red-50' 
                              : ''
                          }`}
                          title={item.stock_quantity > 0 ? `Max available: ${item.stock_quantity}` : 'No stock limit'}
                        />
                        <button
                          type="button"
                          onClick={() => handleIncrementQuantity(index)}
                          disabled={item.stock_quantity > 0 && parseFloat(item.quantity) >= item.stock_quantity}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Increase quantity"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center">
                        <Input
                          type="text"
                          min="0"
                          step="0.01"
                          value={item.price.toString()}
                          onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                          className="w-20 text-sm text-center"
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleDecrementGst(index)}
                          disabled={parseFloat(item.gst) <= 0}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Decrease GST"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <Input
                          type="text"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.gst.toString()}
                          onChange={(e) => handleUpdateItem(index, 'gst', e.target.value)}
                          className="w-14 text-sm text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleIncrementGst(index)}
                          disabled={parseFloat(item.gst) >= 100}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Increase GST"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleDecrementDiscount(index)}
                          disabled={parseFloat(item.discount) <= 0}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Decrease Discount"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <Input
                          type="text"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.discount.toString()}
                          onChange={(e) => handleUpdateItem(index, 'discount', e.target.value)}
                          className="w-14 text-sm text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleIncrementDiscount(index)}
                          disabled={parseFloat(item.discount) >= 100}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Increase Discount"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center">
                        <Input
                          type="text"
                          value={item.total_price.toFixed(2)}
                          readOnly
                          className="w-20 text-sm text-center bg-gray-50 dark:bg-gray-500"
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Options Section */}
      {formData.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <FiDollarSign className="w-4 h-4 mr-2" />
            Payment Options & Invoice Summary
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Payment Options */}
            <div className="space-y-4">
              <div>
                <Select
                  label="Payment Status"
                  options={[
                    { value: 'paid', label: 'Full Paid' },
                    { value: 'semi_paid', label: 'Semi Paid' },
                    { value: 'non_paid', label: 'Non Paid' }
                  ]}
                  value={formData.payment_status}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    payment_status: e.target.value,
                    payment_amount: e.target.value === 'semi_paid' ? prev.payment_amount : 0
                  }))}
                  required
                />
              </div>

              {formData.payment_status === 'semi_paid' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    label="Payment Amount"
                    type="text"
                    step="0.01"
                    placeholder="Enter payment amount"
                    value={formData.payment_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_amount: e.target.value }))}
                    required
                    max={calculateTotals().totalAmount}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Remaining amount: ₹{(calculateTotals().totalAmount - (parseFloat(formData.payment_amount) || 0)).toFixed(2)}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right Column - Invoice Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Invoice Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{calculateTotals().subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">GST:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{calculateTotals().totalGst.toFixed(2)}
                    </span>
                  </div>
                  {calculateTotals().totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Discount:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -₹{calculateTotals().totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-500">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      ₹{calculateTotals().totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Status: <span className="capitalize">{formData.payment_status.replace('_', ' ')}</span>
                </p>
                {formData.payment_status === 'paid' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Full payment of ₹{calculateTotals().totalAmount.toFixed(2)}
                  </p>
                )}
                {formData.payment_status === 'semi_paid' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Partial payment of ₹{parseFloat(formData.payment_amount || 0).toFixed(2)} / ₹{calculateTotals().totalAmount.toFixed(2)}
                  </p>
                )}
                {formData.payment_status === 'non_paid' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No payment received
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{formData.payment_status === 'paid' ? calculateTotals().totalAmount.toFixed(2) : 
                     formData.payment_status === 'semi_paid' ? parseFloat(formData.payment_amount || 0).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paid Amount: ₹{
                    formData.payment_status === 'paid' ? calculateTotals().totalAmount.toFixed(2) : 
                    formData.payment_status === 'semi_paid' ? parseFloat(formData.payment_amount || 0).toFixed(2) : 
                    '0.00'
                  }
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.payment_status === 'paid' ? 'Paid in Full' : 
                   formData.payment_status === 'semi_paid' ? 'Partial Payment' : 'Unpaid'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.form>
  )
}

export default BillGenerateForm