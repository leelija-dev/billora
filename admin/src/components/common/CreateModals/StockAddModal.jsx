import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave, FiPackage, FiPlus } from 'react-icons/fi'
import { useAuthStore } from '../../../store/authStore'
import Button from '../Button/Button'
import Input from '../Input/Input'

const StockAddModal = ({ isOpen, onClose, onAddStock, product = null, currentStock = 0 }) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    product_id: product?.id || '',
    current_stock: currentStock || 0,
    stock_to_add: '',
    new_stock: currentStock || 0,
    selling_price: product?.selling_price || '',
    purchase_price: product?.purchase_price || '',
    user_id: user?.id || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when product or currentStock changes
  useEffect(() => {
    if (product) {
      console.log('StockAddModal - Updating form data:', { 
        productId: product.id, 
        currentStock, 
        productName: product.name 
      });
      setFormData({
        product_id: product.id || '',
        current_stock: currentStock || 0,
        stock_to_add: '',
        new_stock: currentStock || 0,
        selling_price: product.selling_price || '',
        purchase_price: product.purchase_price || '',
        user_id: user?.id || ''
      })
    }
  }, [product, currentStock, user])

  // Update new stock when stock_to_add changes
  const handleStockChange = (value) => {
    const stockToAdd = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      stock_to_add: value,
      new_stock: (prev.current_stock || 0) + stockToAdd
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.stock_to_add || parseFloat(formData.stock_to_add) <= 0) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAddStock({
        product_id: formData.product_id,
        quantity: parseFloat(formData.stock_to_add),
        current_stock: formData.current_stock,
        new_stock: formData.new_stock,
        selling_price: parseFloat(formData.selling_price) || 0,
        purchase_price: parseFloat(formData.purchase_price) || 0,
        user_id: user?.id || null
      })
      onClose()
      // Reset form
      setFormData({
        product_id: '',
        current_stock: 0,
        stock_to_add: '',
        new_stock: 0,
        selling_price: '',
        purchase_price: '',
        user_id: user?.id || ''
      })
    } catch (error) {
      console.error('Error adding stock:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'stock_to_add') {
      handleStockChange(value)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Add Stock
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add inventory stock for {product?.name}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                onClick={onClose}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Product Info */}
            {product && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Current Stock: {formData.current_stock}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden fields */}
              <input type="hidden" name="product_id" value={formData.product_id} />
              <input type="hidden" name="user_id" value={formData.user_id} />

              <Input
                label="Stock to Add"
                name="stock_to_add"
                type="number"
                step="1"
                min="1"
                value={formData.stock_to_add}
                onChange={handleChange}
                placeholder="Enter quantity to add"
                required
                icon={FiPlus}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Current Stock"
                  name="current_stock"
                  type="number"
                  value={formData.current_stock}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Input
                  label="New Total Stock"
                  name="new_stock"
                  type="number"
                  value={formData.new_stock}
                  disabled
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Selling Price"
                    name="selling_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.selling_price}
                    onChange={handleChange}
                    placeholder="Enter selling price"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-9 text-gray-500 font-medium">₹</span>
                </div>
                <div className="relative">
                  <Input
                    label="Purchase Price"
                    name="purchase_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchase_price}
                    onChange={handleChange}
                    placeholder="Enter purchase price"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-9 text-gray-500 font-medium">₹</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !formData.stock_to_add || parseFloat(formData.stock_to_add) <= 0}
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StockAddModal
