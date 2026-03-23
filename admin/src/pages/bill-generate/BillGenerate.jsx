import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiSave, 
  FiSearch,
  FiShoppingCart,
  FiDollarSign,
  FiUser,
  
  FiPackage,
  FiPercent,
  FiX,
  FiArrowLeft,
  FiCheckCircle
} from 'react-icons/fi'
import { useInvoiceStore } from '../../store/invoiceStore'
import apiClient from '../../services/apiClient'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Select from '../../components/common/Select/Select'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'

const BillGenerate = () => {
  const { createInvoice } = useInvoiceStore()
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    user_id: 1, // Will get from auth context
    customer_id: '',
    store_id: '',
    paid_amount: 0,
    created_by: 1, // Will get from auth context
    items: []
  })
  
  // Available data (would come from API)
  const [customers, setCustomers] = useState([])
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState([])
  const [units, setUnits] = useState([])
  
  // Search states
  const [productSearch, setProductSearch] = useState('')
  const [showProductList, setShowProductList] = useState(false)

  useEffect(() => {
    // Fetch initial data
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      // Fetch bill generate data from API
      const response = await apiClient.get('/invoice/')
      const data = response.data?.data || {}
      
      setCustomers(data.customers || [])
      setStores(data.stores || [])
      setProducts(data.products || [])
      setUnits(data.units || [])
      
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      setError('Failed to load initial data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = (product) => {
    const unit = units.find(u => u.id === product.unit_id)
    const newItem = {
      product_id: product.id,
      product_name: product.name || product.product_name,
      product_code: product.code || product.product_code,
      quantity: 1,
      item_count: 1,
      unit_id: product.unit_id,
      unit_name: unit?.short_name || unit?.name || 'pcs',
      price: parseFloat(product.price) || 0,
      gst: parseFloat(product.gst) || 0,
      discount: 0,
      total_price: parseFloat(product.price) || 0,
      status: 'completed'
    }
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
    
    setShowProductList(false)
    setProductSearch('')
  }

  const handleUpdateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      const item = newItems[index]
      
      if (field === 'quantity' || field === 'price' || field === 'gst' || field === 'discount') {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customer_id || !formData.store_id || formData.items.length === 0) {
      setError('Please fill all required fields and add at least one item')
      return
    }
    
    setSubmitting(true)
    try {
      const totals = calculateTotals()
      const submissionData = {
        ...formData,
        paid_amount: totals.totalAmount.toString()
      }
      
      await createInvoice(submissionData)
      // Reset form or redirect
      alert('Bill generated successfully!')
    } catch (error) {
      setError('Failed to generate bill')
    } finally {
      setSubmitting(false)
    }
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={FiArrowLeft}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Generate Bill
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create new invoice with stock management
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer and Store Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Select
            label="Customer"
            options={[
              { value: '', label: 'Select Customer' },
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
            label="Store"
            options={[
              { value: '', label: 'Select Store' },
              ...stores.map(store => ({
                value: store.id,
                label: store.name
              }))
            ]}
            value={formData.store_id}
            onChange={(e) => setFormData(prev => ({ ...prev, store_id: e.target.value }))}
            required
          />
        </motion.div>

        {/* Product Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
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

          {/* Product Dropdown */}
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Stock: {product.stock || 'N/A'}
                          </p>
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
        </motion.div>

        {/* Items Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiShoppingCart className="w-5 h-5 mr-2" />
              Bill Items ({formData.items.length})
            </h3>
            
            {formData.items.length === 0 ? (
              <EmptyState
                icon={FiPackage}
                title="No items added"
                description="Search and add products to create your bill"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Product</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Unit</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">GST %</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Discount %</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.product_code}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                          {item.unit_name}
                        </td>
                        <td className="p-3 text-right">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                            className="w-24 text-right"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={item.gst}
                            onChange={(e) => handleUpdateItem(index, 'gst', e.target.value)}
                            className="w-16 text-right"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => handleUpdateItem(index, 'discount', e.target.value)}
                            className="w-16 text-right"
                          />
                        </td>
                        <td className="p-3 text-right font-semibold text-gray-900 dark:text-white">
                          ₹{item.total_price.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary */}
        {formData.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">GST:</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{totals.totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-green-600 dark:text-green-400">-₹{totals.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end space-x-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={FiSave}
            disabled={submitting || formData.items.length === 0}
            className="shadow-lg shadow-primary-500/30"
          >
            {submitting ? 'Generating...' : 'Generate Bill'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default BillGenerate
