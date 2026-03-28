import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiX, FiPlus, FiTrash2, FiUser, FiShoppingCart, FiDollarSign, FiPackage, FiSearch, FiAlertCircle } from 'react-icons/fi'
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

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
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
      
      const finalCustomers = customersList.length > 0 ? customersList : mockCustomers
      const finalStores = storesList.length > 0 ? storesList : mockStores
      const finalProducts = productsList.length > 0 ? productsList : mockProducts
      const finalUnits = unitsList.length > 0 ? unitsList : mockUnits
      
      console.log('Final counts - Customers:', finalCustomers.length, 'Stores:', finalStores.length, 'Products:', finalProducts.length, 'Units:', finalUnits.length)
      console.log('Using API data for customers, stores, products and mock data for units')
      
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      console.error('Error details:', error.response)
      
      // Use mock data as fallback when API fails
      console.log('API failed, using mock data fallback')
      setCustomers(mockCustomers)
      setStores(mockStores)
      setProducts(mockProducts)
      setUnits(mockUnits)
      
      console.log('Mock data counts - Customers:', mockCustomers.length, 'Stores:', mockStores.length, 'Products:', mockProducts.length, 'Units:', mockUnits.length)
      
      setError(`API failed, using mock data. Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (product) => {
    try {
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

  const filteredProducts = products.filter(product => 
    (product.name && product.name.toLowerCase().includes(productSearch.toLowerCase())) ||
    (product.product_name && product.product_name.toLowerCase().includes(productSearch.toLowerCase())) ||
    (product.code && product.code.toLowerCase().includes(productSearch.toLowerCase())) ||
    (product.product_code && product.product_code.toLowerCase().includes(productSearch.toLowerCase()))
  )

  const totals = calculateTotals()

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
              <Select
                label="Select Customer"
                options={[
                  { value: '', label: 'Choose a customer...' },
                  ...customers.map(customer => ({
                    value: customer.id,
                    label: customer.name
                  }))
                ]}
                value={formData.customer_id}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
                required
              />

              <Select
                label="Select Store"
                options={[
                  { value: '', label: 'Choose a store...' },
                  ...stores.map(store => ({
                    value: store.id,
                    label: store.name
                  }))
                ]}
                value={formData.store_id}
                onChange={(e) => setFormData(prev => ({ ...prev, store_id: e.target.value }))}
                required
              />

              {formData.customer_id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 hidden"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {customers.find(c => c.id === formData.customer_id)?.name}
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
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products by name or code..."
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
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => handleAddItem(product)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {product.name || product.product_name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {product.code || product.product_code}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ₹{parseFloat(product.price || 0).toFixed(2)}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <p>Stock: {product.stock || 'N/A'}</p>
                                {product.gst && (
                                  <p>GST: {parseFloat(product.gst).toFixed(1)}%</p>
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
          <>
            {/* Items Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-3">
              <div className="col-span-4 text-xs font-medium text-gray-500 dark:text-gray-400">Product</div>
              <div className="col-span-1 text-xs font-medium text-gray-500 dark:text-gray-400">Qty</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Price</div>
              <div className="col-span-1 text-xs font-medium text-gray-500 dark:text-gray-400">GST %</div>
              <div className="col-span-1 text-xs font-medium text-gray-500 dark:text-gray-400">Discount %</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white dark:bg-gray-600 p-3 rounded-lg"
                >
                  <div className="md:col-span-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.product_code}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{item.unit_name}</p>
                      {item.stock_quantity !== undefined && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">Stock: {item.stock_quantity}</p>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      type="number"
                      min="1"
                      max={item.stock_quantity > 0 ? item.stock_quantity : undefined}
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                      className={`w-full text-sm ${
                        item.stock_quantity > 0 && item.quantity > item.stock_quantity 
                          ? 'border-red-500 bg-red-50' 
                          : ''
                      }`}
                      title={item.stock_quantity > 0 ? `Max available: ${item.stock_quantity}` : 'No stock limit'}
                    />
                    {item.stock_quantity > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Max: {item.stock_quantity}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.gst}
                      onChange={(e) => handleUpdateItem(index, 'gst', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => handleUpdateItem(index, 'discount', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      type="number"
                      value={item.total_price.toFixed(2)}
                      readOnly
                      className="w-full text-sm bg-gray-50 dark:bg-gray-500"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
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
                    type="number"
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
