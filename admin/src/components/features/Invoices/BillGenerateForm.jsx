import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiX, FiPlus, FiTrash2, FiUser, FiShoppingCart, FiDollarSign, FiPackage, FiSearch, FiAlertCircle, FiMinus, FiUserPlus } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import EmptyState from '../../common/EmptyState/EmptyState'
import Modal from '../../common/Modal/Modal' // Use your existing Modal component
import { invoiceAPI } from '../../../services/invoiceService'
import { stockAPI } from '../../../services/stockService'
import { packagesAPI } from '../../../services/packagesService'
import usePackageStore from '../../../store/packageStore'
import { useAuthStore } from '../../../store/authStore'
import { useCustomerStore } from '../../../store/customerStore' // Import customer store
import toast from 'react-hot-toast' // Import toast for notifications

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
  const { packages, fetchPackages, loading: packagesLoading } = usePackageStore()
  const { createCustomer, fetchCustomers } = useCustomerStore() // Add customer store methods
  
  // Get current user ID
  const getUserId = () => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        console.log('Parsed auth data for user ID:', parsed)
        return parsed.user?.id || parsed.userId || '1'
      } catch {
        return '1'
      }
    }
    return '1'
  }

  const currentUserId = getUserId()

  const [formData, setFormData] = useState({
    user_id: currentUserId,
    customer_id: '',
    store_id: '',
    paid_amount: 0,
    created_by: currentUserId,
    items: [],
    payment_status: 'paid',
    payment_amount: 0
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
  const [packageSearch, setPackageSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showStoreDropdown, setShowStoreDropdown] = useState(false)
  const [showPackageDropdown, setShowPackageDropdown] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [packageQuantity, setPackageQuantity] = useState(1)
  
  // Add customer modal state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    gst: ''
  })
  const [customerErrors, setCustomerErrors] = useState({})
  
  // Enhanced product search state
  const [filteredProducts, setFilteredProducts] = useState([])

  // Helper function to calculate item total price
  const calculateItemTotal = (price, quantity, gst, discount) => {
    const basePrice = price * quantity
    const discountAmount = basePrice * (discount / 100)
    const gstAmount = (basePrice - discountAmount) * (gst / 100)
    return ((basePrice - discountAmount) + gstAmount) 
  }

  // Check if we have valid cached data
  const isCacheValid = () => {
    return billGenerateCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_EXPIRY
  }

  const fetchInitialData = async () => {
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
      
      let data = {}
      if (response.data) {
        if (response.data.data) {
          data = response.data.data
        } else {
          data = response.data
        }
      }
      
      billGenerateCache = data
      lastFetchTime = Date.now()
      
      const customersList = data.customers || data.bill_customer || data.customer || []
      const storesList = data.stores || data.store || []
      const productsList = data.products || data.product || []
      const unitsList = data.units || data.unit || []
      
      setCustomers(customersList.length > 0 ? customersList : mockCustomers)
      setStores(storesList.length > 0 ? storesList : mockStores)
      setProducts(productsList.length > 0 ? productsList : mockProducts)
      setUnits(unitsList.length > 0 ? unitsList : mockUnits)
      
      if (storesList.length > 0 && !formData.store_id) {
        const firstStoreId = storesList[0].id
        setFormData(prev => ({
          ...prev,
          store_id: firstStoreId
        }))
      }
      
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      setCustomers(mockCustomers)
      setStores(mockStores)
      setProducts(mockProducts)
      setUnits(mockUnits)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
    // Fetch packages for current user
    fetchPackages(currentUserId)
  }, [currentUserId])

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

  // Filter packages based on search
  useEffect(() => {
    if (packageSearch.trim() === '') {
      setFilteredPackages(packages)
    } else {
      const searchLower = packageSearch.toLowerCase()
      const filtered = packages.filter(pkg => 
        pkg.package_name?.toLowerCase().includes(searchLower) ||
        pkg.package_size?.toLowerCase().includes(searchLower) ||
        pkg.package_price?.toString().includes(searchLower)
      )
      setFilteredPackages(filtered)
    }
  }, [packageSearch, packages])

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
        const newQuantity = updatedItems[existingItemIndex].quantity + 1
        const item = updatedItems[existingItemIndex]
        
        updatedItems[existingItemIndex] = {
          ...item,
          quantity: newQuantity,
          item_count: newQuantity,
          total_price: calculateItemTotal(item.price, newQuantity, item.gst, item.discount)
        }
        
        setFormData(prev => ({
          ...prev,
          items: updatedItems
        }))
        
        console.log('🔄 Updated existing product quantity:', updatedItems[existingItemIndex])
      } else {
        // Fetch stock data for this product
        const stockResponse = await stockAPI.getAll(product.name || product.product_name)
        const stockList = stockResponse.data?.data?.data || stockResponse.data?.data || []
        const stockItem = stockList.find(stock => stock.product_id === product.id)
        
        const unit = units.find(u => u.id === product.unit_id)
        
        const sellingPrice = parseFloat(stockItem?.selling_price) || parseFloat(product.selling_price) || parseFloat(product.price) || 0
        const purchasePrice = parseFloat(stockItem?.purchase_price) || parseFloat(product.purchase_price) || parseFloat(product.cost) || 0
        const gst = parseFloat(product.gst_percentage) || parseFloat(stockItem?.gst_percentage) || parseFloat(product.gst) || 0
        const discount = parseFloat(product.discount_percentage) || parseFloat(stockItem?.discount) || parseFloat(product.discount) || 0
        const stockQuantity = stockItem?.quantity || 0
        const stockId = stockItem?.id || null
        
        // Calculate initial total price
        const quantity = 1
        const totalPrice = calculateItemTotal(sellingPrice, quantity, gst, discount)
        
        const newItem = {
          product_id: product.id,
          product_name: product.name || product.product_name,
          product_code: product.sku || product.code || product.product_code,
          quantity: quantity,
          item_count: quantity,
          unit_id: product.unit_id,
          unit_name: unit?.short_name || unit?.name || 'pcs',
          price: sellingPrice,
          purchase_price: purchasePrice,
          gst: gst,
          discount: discount,
          total_price: totalPrice,
          status: 'completed',
          stock_quantity: stockQuantity,
          stock_id: stockId
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
      
      const sellingPrice = parseFloat(product.selling_price) || parseFloat(product.price) || 0
      const purchasePrice = parseFloat(product.purchase_price) || parseFloat(product.cost) || 0
      const gst = parseFloat(product.gst_percentage) || parseFloat(product.gst) || 0
      const discount = parseFloat(product.discount_percentage) || parseFloat(product.discount) || 0
      const quantity = 1
      const totalPrice = calculateItemTotal(sellingPrice, quantity, gst, discount)
      
      const newItem = {
        product_id: product.id,
        product_name: product.name || product.product_name,
        product_code: product.sku || product.code || product.product_code,
        quantity: quantity,
        item_count: quantity,
        unit_id: product.unit_id,
        unit_name: unit?.short_name || unit?.name || 'pcs',
        price: sellingPrice,
        purchase_price: purchasePrice,
        gst: gst,
        discount: discount,
        total_price: totalPrice,
        status: 'completed',
        stock_quantity: 0,
        stock_id: null
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
          return prev
        }
        
        item.quantity = newQuantity
        item.item_count = newQuantity
        
        // Recalculate total price correctly
        item.total_price = calculateItemTotal(item.price, item.quantity, item.gst, item.discount)
      } else if (field === 'price') {
        const numValue = parseFloat(value) || 0
        item.price = numValue
        item.total_price = calculateItemTotal(item.price, item.quantity, item.gst, item.discount)
      } else if (field === 'gst') {
        const numValue = parseFloat(value) || 0
        item.gst = numValue
        item.total_price = calculateItemTotal(item.price, item.quantity, item.gst, item.discount)
      } else if (field === 'discount') {
        const numValue = parseFloat(value) || 0
        item.discount = numValue
        item.total_price = calculateItemTotal(item.price, item.quantity, item.gst, item.discount)
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

  // Validate customer form
  const validateCustomerForm = () => {
    const newErrors = {}
    
    if (!newCustomerData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (newCustomerData.email && !/\S+@\S+\.\S+/.test(newCustomerData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (newCustomerData.phone && !/^[\d\s-()+]+$/.test(newCustomerData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    setCustomerErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle customer creation from modal
  const handleCreateCustomer = async () => {
    if (!validateCustomerForm()) {
      return
    }

    setIsCreatingCustomer(true)
    try {
      const result = await createCustomer({
        ...newCustomerData,
        admin_id: currentUserId,
        created_by: currentUserId
      })
      
      if (result.success) {
        // Refresh customers list
        await fetchCustomers(1, '')
        
        // Fetch updated customers from API
        const response = await invoiceAPI.getBillGenerateData()
        let updatedData = response.data?.data || response.data || {}
        const updatedCustomersList = updatedData.customers || updatedData.bill_customer || updatedData.customer || []
        setCustomers(updatedCustomersList.length > 0 ? updatedCustomersList : mockCustomers)
        
        // Find the newly created customer (by name or phone)
        const newCustomer = updatedCustomersList.find(c => 
          c.name === newCustomerData.name || 
          c.phone === newCustomerData.phone
        )
        
        if (newCustomer) {
          // Auto-select the new customer
          setFormData(prev => ({
            ...prev,
            customer_id: newCustomer.id
          }))
          setCustomerSearch(newCustomer.name || newCustomer.customer_name)
          toast.success('Customer created and selected successfully')
        } else {
          toast.success('Customer created successfully')
        }
        
        // Reset modal and form
        setShowAddCustomerModal(false)
        setNewCustomerData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          gst: ''
        })
        setCustomerErrors({})
      } else {
        toast.error(result.error?.message || 'Failed to create customer')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Failed to create customer')
    } finally {
      setIsCreatingCustomer(false)
    }
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

  // Package selection handlers
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    setPackageSearch(pkg.package_name)
    setShowPackageDropdown(false)
    setPackageQuantity(1)
  }

  const handlePackageSearchChange = (value) => {
    setPackageSearch(value)
    setShowPackageDropdown(true)
  }

  const handleAddPackageToInvoice = () => {
    if (!selectedPackage || packageQuantity <= 0) {
      setError('Please select a package and enter a valid quantity')
      return
    }

    // Convert package to invoice item
    const packageItem = {
      product_id: selectedPackage.id,
      product_name: selectedPackage.package_name,
      product_code: `PKG-${selectedPackage.id}`,
      quantity: packageQuantity,
      item_count: packageQuantity,
      unit_id: null,
      unit_name: selectedPackage.package_size || 'Package',
      price: parseFloat(selectedPackage.package_price) || 0,
      gst: 0, // Packages typically don't have GST
      discount: 0, // Packages typically don't have discount
      total_price: (parseFloat(selectedPackage.package_price) || 0) * packageQuantity,
      status: 'completed',
      stock_quantity: 0,
      stock_id: null,
      is_package: true // Mark as package item
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, packageItem]
    }))
    
    // Reset package selection
    setSelectedPackage(null)
    setPackageSearch('')
    setPackageQuantity(1)
    
    console.log('Added package to invoice:', packageItem)
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
      return
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
    
    if (newDiscount >= 0) {
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

  // Calculate totals correctly - discount first, then GST, then add packages
  const calculateTotals = () => {
    // Separate products and packages
    const productItems = formData.items.filter(item => !item.is_package)
    const packageItems = formData.items.filter(item => item.is_package)
    
    // Calculate product totals with discount and GST
    const productSubtotal = productItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const productDiscount = productItems.reduce((sum, item) => {
      const basePrice = item.price * item.quantity
      return sum + (basePrice * (item.discount / 100))
    }, 0)
    const productGst = productItems.reduce((sum, item) => {
      const basePrice = item.price * item.quantity
      const discountedPrice = basePrice - (basePrice * (item.discount / 100))
      return sum + (discountedPrice * (item.gst / 100))
    }, 0)
    
    // Calculate package totals (no discount or GST for packages)
    const packageTotal = packageItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // Final calculation: (product subtotal - product discount + product GST) + package total
    const subtotal = productSubtotal
    const totalDiscount = productDiscount
    const totalGst = productGst
    const totalAmount = (productSubtotal - productDiscount + productGst) + packageTotal
    
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
    
    const totals = calculateTotals()
    
    // Validate payment amount for semi-paid
    if (formData.payment_status === 'semi_paid') {
      if (!formData.payment_amount || formData.payment_amount <= 0) {
        setError('Please enter a valid payment amount for semi-paid option')
        return
      }
    }
    
    // Separate products and packages
    const productItems = formData.items.filter(item => !item.is_package)
    const packageItems = formData.items.filter(item => item.is_package)

    // Create packages array for API
    const packages = packageItems.map(item => ({
      package_id: item.product_id,
      package_name: item.product_name,
      package_price: item.price,
      package_size: item.unit_name,
      quantity: item.quantity
    }))

    const submissionData = {
      ...formData,
      items: productItems, // Only send product items in items array
      packages: packages, // Send packages in separate packages array
      paid_amount: formData.payment_status === 'paid' ? totals.totalAmount.toString() : 
                  formData.payment_status === 'semi_paid' ? formData.payment_amount.toString() : '0',
      total_amount: totals.totalAmount.toString()
    }
    
    console.log('📤 Submitting invoice:', submissionData)
    console.log('📊 Final Totals:', {
      subtotal: totals.subtotal,
      totalGst: totals.totalGst,
      totalDiscount: totals.totalDiscount,
      totalAmount: totals.totalAmount,
      items: formData.items.length
    })
    
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
      if (!event.target.closest('.package-dropdown')) {
        setShowPackageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totals = calculateTotals()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <>
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
                Some items exceed available stock. Please adjust quantities.
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
                        <div className="px-4 py-3">
                          {customerSearch.trim() !== '' ? (
                            <div className="text-center">
                              <p className="text-gray-500 dark:text-gray-400 mb-2">
                                No customers found matching "{customerSearch}"
                              </p>
                              <button
                                type="button"
                                onClick={() => setShowAddCustomerModal(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                              >
                                <FiUserPlus className="w-4 h-4 mr-2" />
                                Add New Customer "{customerSearch}"
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                              <p className="mb-2">No customers available</p>
                              <button
                                type="button"
                                onClick={() => setShowAddCustomerModal(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                              >
                                <FiUserPlus className="w-4 h-4 mr-2" />
                                Add New Customer
                              </button>
                            </div>
                          )}
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
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  ₹{parseFloat(product.selling_price || product.price || 0).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
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

          {/* Package Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiPackage className="w-4 h-4 mr-2" />
                Add Packages
              </h3>

              <div className="space-y-4">
                {/* Package Searchable Dropdown */}
                <div className="relative package-dropdown">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Packages
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search packages by name, size, price..."
                      value={packageSearch}
                      onChange={(e) => handlePackageSearchChange(e.target.value)}
                      onFocus={() => setShowPackageDropdown(true)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Package Dropdown */}
                  {showPackageDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map(pkg => (
                          <div
                            key={pkg.id}
                            onClick={() => handlePackageSelect(pkg)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {pkg.package_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Size: {pkg.package_size || 'Standard'}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  ¥{parseFloat(pkg.package_price || 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                          No packages found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Package Quantity and Add Button */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{selectedPackage.package_name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Size: {selectedPackage.package_size || 'Standard'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ¥{parseFloat(selectedPackage.package_price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                        <Input
                          type="number"
                          min="1"
                          value={packageQuantity}
                          onChange={(e) => setPackageQuantity(parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddPackageToInvoice}
                        disabled={packageQuantity <= 0}
                      >
                        <FiPlus className="w-4 h-4" />
                        Add to Invoice
                      </Button>
                    </div>
                  </motion.div>
                )}

                {packagesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
                        </div>
                       </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementQuantity(index)}
                            disabled={parseFloat(item.quantity) <= 1}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="text"
                            value={item.quantity.toString()}
                            onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                            className={`w-14 text-sm text-center ${
                              item.stock_quantity > 0 && item.quantity > item.stock_quantity 
                                ? 'border-red-500 bg-red-50' 
                                : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrementQuantity(index)}
                            disabled={item.stock_quantity > 0 && parseFloat(item.quantity) >= item.stock_quantity}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                       </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <Input
                            type="number"
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
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="number"
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
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="number"
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
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                       </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            value={item.total_price.toFixed(2)}
                            readOnly
                            className="w-20 text-sm text-center bg-gray-50 dark:bg-gray-500 font-semibold"
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
              {/* <FiDollarSign className="w-4 h-4 mr-2" /> */}
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
                      max={totals.totalAmount}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Remaining amount: ₹{(totals.totalAmount - (parseFloat(formData.payment_amount) || 0)).toFixed(2)}
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
                        ₹{totals.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Discount:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -₹{totals.totalDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">GST:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        +₹{totals.totalGst.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-500">
                      <span className="text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        ₹{totals.totalAmount.toFixed(2)}
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
                      Full payment of ₹{totals.totalAmount.toFixed(2)}
                    </p>
                  )}
                  {formData.payment_status === 'semi_paid' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Partial payment of ₹{parseFloat(formData.payment_amount || 0).toFixed(2)} / ₹{totals.totalAmount.toFixed(2)}
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
                    ₹{formData.payment_status === 'paid' ? totals.totalAmount.toFixed(2) : 
                       formData.payment_status === 'semi_paid' ? parseFloat(formData.payment_amount || 0).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paid Amount
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.form>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false)
          setNewCustomerData({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            gst: ''
          })
          setCustomerErrors({})
        }}
        title="Add New Customer"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddCustomerModal(false)
                setNewCustomerData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  gst: ''
                })
                setCustomerErrors({})
              }}
              disabled={isCreatingCustomer}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateCustomer}
              loading={isCreatingCustomer}
              icon={FiUserPlus}
            >
              Create Customer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name *"
            name="name"
            value={newCustomerData.name}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, name: e.target.value }))}
            error={customerErrors.name}
            placeholder="Enter customer's full name"
            autoFocus
          />
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={newCustomerData.email}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, email: e.target.value }))}
            error={customerErrors.email}
            placeholder="customer@example.com"
          />
          
          <Input
            label="Phone Number"
            name="phone"
            value={newCustomerData.phone}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, phone: e.target.value }))}
            error={customerErrors.phone}
            placeholder="Phone number"
          />
          
          <Input
            label="Address"
            name="address"
            value={newCustomerData.address}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Street address"
          />
          
          <Input
            label="City"
            name="city"
            value={newCustomerData.city}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="City"
          />
          
          <Input
            label="GST Number"
            name="gst"
            value={newCustomerData.gst}
            onChange={(e) => setNewCustomerData(prev => ({ ...prev, gst: e.target.value }))}
            placeholder="GST number (optional)"
          />
        </div>
      </Modal>
    </>
  )
}

export default BillGenerateForm