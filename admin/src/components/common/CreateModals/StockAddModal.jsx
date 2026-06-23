// StockAddModal.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave, FiPackage, FiPlus, FiBox, FiInfo } from 'react-icons/fi'
import { useAuthStore } from '../../../store/authStore'
import Button from '../Button/Button'
import Input from '../Input/Input'
import SearchSelect from '../SearchSelect/SearchSelect'
import toast from 'react-hot-toast'

const StockAddModal = ({ 
  isOpen, 
  onClose, 
  onAddStock, 
  product = null, 
  currentStock = 0,
  units = []
}) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    product_id: product?.id || '',
    stock_id: '',
    current_stock: currentStock || 0,
    stock_to_add: '',
    new_stock: currentStock || 0,
    user_id: user?.id || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      const defaultStock = product.stocks && product.stocks.length > 0 ? product.stocks[0] : null
      
      // Get the quantity from the default stock or use the currentStock prop
      const defaultQuantity = defaultStock?.quantity || currentStock || 0
      
      setFormData({
        product_id: product.id || '',
        stock_id: defaultStock?.id || '',
        current_stock: defaultQuantity,
        stock_to_add: '',
        new_stock: defaultQuantity,
        user_id: user?.id || ''
      })
      
      setSelectedStock(defaultStock)
    }
  }, [product, user, currentStock])

  const handleStockSelect = (stockId, stock) => {
    console.log('Stock selected:', stockId, stock)
    
    // Get the stock data from the option
    const selectedStockData = stock?.stockData || stock
    
    // Get the quantity from the selected stock
    const stockQuantity = parseFloat(selectedStockData?.quantity) || 0
    
    setSelectedStock(selectedStockData)
    setFormData(prev => {
      const stockToAdd = parseFloat(prev.stock_to_add) || 0
      const newFormData = {
        ...prev,
        stock_id: stockId,
        current_stock: stockQuantity,
        new_stock: stockQuantity + stockToAdd
      }
      console.log('Updated form data:', newFormData)
      return newFormData
    })
  }

  const handleStockChange = (value) => {
    // Parse the value as a number, default to 0 if invalid
    const stockToAdd = parseFloat(value) || 0
    
    setFormData(prev => {
      const currentStock = parseFloat(prev.current_stock) || 0
      const newTotal = currentStock + stockToAdd
      
      return {
        ...prev,
        stock_to_add: value, // Keep as string for input display
        new_stock: newTotal // Store as number
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const quantityToAdd = parseFloat(formData.stock_to_add)
    
    if (!quantityToAdd || quantityToAdd <= 0) {
      toast.error('Please enter a valid quantity to add')
      return
    }

    if (!formData.stock_id) {
      toast.error('Please select a stock record')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAddStock({
        stock_id: formData.stock_id,
        quantity: quantityToAdd,
        current_stock: parseFloat(formData.current_stock) || 0,
        new_stock: parseFloat(formData.new_stock) || 0,
        user_id: user?.id || null,
        unit_id: selectedStock?.unit_id || null,
        warehouse_id: selectedStock?.warehouse_id || null
      })
      onClose()
      setFormData({
        product_id: '',
        stock_id: '',
        current_stock: 0,
        stock_to_add: '',
        new_stock: 0,
        user_id: user?.id || ''
      })
      setSelectedStock(null)
    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Failed to add stock. Please try again.')
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

  const getStockOptions = () => {
    if (!product || !product.stocks || !Array.isArray(product.stocks)) {
      return []
    }

    return product.stocks.map(stock => {
      const unit = units.find(u => u.id === stock.unit_id)
      const unitName = unit ? unit.name : `Unit ${stock.unit_id}`
      
      let label = `${unitName}`
      
      if (stock.warehouse) {
        label += ` - ${stock.warehouse.name}`
      } else if (stock.warehouse_id) {
        label += ` - Warehouse ${stock.warehouse_id}`
      }
      
      label += ` (${stock.quantity} in stock)`

      // Get price and GST info from product or stock
      const sellingPrice = parseFloat(product?.selling_price || stock?.selling_price || 0)
      const purchasePrice = parseFloat(product?.purchase_price || stock?.purchase_price || 0)
      const sellingGst = parseFloat(product?.selling_gst_percentage || stock?.selling_gst_percentage || 0)
      const purchaseGst = parseFloat(product?.purchase_gst_percentage || stock?.purchase_gst_percentage || 0)
      
      // Calculate GST amounts
      const sellingGstAmount = (sellingPrice * sellingGst) / 100
      const purchaseGstAmount = (purchasePrice * purchaseGst) / 100
      const priceWithSellingGst = sellingPrice + sellingGstAmount
      const priceWithPurchaseGst = purchasePrice + purchaseGstAmount

      return {
        value: stock.id,
        label: label,
        description: `Stock ID: ${stock.id} | Quantity: ${stock.quantity}`,
        subtext: stock.warehouse ? `Warehouse: ${stock.warehouse.name}` : '',
        stockData: stock,
        sellingPrice: sellingPrice,
        purchasePrice: purchasePrice,
        sellingGst: sellingGst,
        purchaseGst: purchaseGst,
        sellingGstAmount: sellingGstAmount,
        purchaseGstAmount: purchaseGstAmount,
        priceWithSellingGst: priceWithSellingGst,
        priceWithPurchaseGst: priceWithPurchaseGst,
        rightContent: (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            stock.quantity <= 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            stock.quantity <= 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {stock.quantity} units
          </span>
        )
      }
    })
  }

  const renderStockOption = (option, index, isHighlighted, isSelected) => {
    return (
      <div
        key={option.value}
        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
        } ${isHighlighted ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiBox className="w-4 h-4 text-gray-400" />
              {option.label}
            </div>
            
            {/* Price and GST Details - Purchase */}
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2 mb-1">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Purchase Price</span>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    ₹{option.purchasePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Purchase GST</span>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {option.purchaseGst.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Selling Price</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ₹{option.sellingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Selling GST</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {option.sellingGst.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {option.stockData?.warehouse && (
                <span>🏠 {option.stockData.warehouse.name}</span>
              )}
              {option.stockData?.warehouse_id && !option.stockData?.warehouse && (
                <span>🏠 Warehouse #{option.stockData.warehouse_id}</span>
              )}
              <span>📦 Stock: {option.stockData?.quantity || 0}</span>
            </div>
          </div>
          <div className="ml-3">
            {option.rightContent}
          </div>
        </div>
      </div>
    )
  }

  const getCurrentStockDisplay = () => {
    // Use selectedStock first, then fallback to formData
    if (selectedStock) {
      const unit = units.find(u => u.id === selectedStock.unit_id)
      const unitName = unit ? unit.name : ''
      const quantity = selectedStock.quantity || formData.current_stock || 0
      return `${quantity} ${unitName}`.trim()
    }
    
    // Fallback to formData.current_stock
    const quantity = formData.current_stock || 0
    return `${quantity}`
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
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <FiPlus className="w-5 h-5 text-blue-500" />
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
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="product_id" value={formData.product_id} />
                <input type="hidden" name="user_id" value={formData.user_id} />

                {/* Stock Selection */}
                {product && product.stocks && product.stocks.length > 0 && (
                  <div className="mb-4">
                    <SearchSelect
                      label="Select Stock Record"
                      options={getStockOptions()}
                      value={formData.stock_id}
                      onChange={handleStockSelect}
                      placeholder="Choose a stock record..."
                      displayKey="label"
                      valueKey="value"
                      required
                      renderOption={renderStockOption}
                    />
                    
                    {/* Selected Stock Price Summary */}
                    {selectedStock && (
                      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 mb-3">
                          <FiInfo className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Price Details
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Purchase Section */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Purchase
                            </p>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
                              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                ₹{parseFloat(product?.purchase_price || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">GST:</span>
                              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                {parseFloat(product?.purchase_gst_percentage || 0).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                              <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                ₹{(parseFloat(product?.purchase_price || 0) + 
                                  (parseFloat(product?.purchase_price || 0) * parseFloat(product?.purchase_gst_percentage || 0)) / 100
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Selling Section */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Selling
                            </p>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                ₹{parseFloat(product?.selling_price || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">GST:</span>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {parseFloat(product?.selling_gst_percentage || 0).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                              <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                ₹{(parseFloat(product?.selling_price || 0) + 
                                  (parseFloat(product?.selling_price || 0) * parseFloat(product?.selling_gst_percentage || 0)) / 100
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Stock Info - Shows the selected stock's quantity */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiBox className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Current Stock:
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedStock ? (
                        <>
                          {selectedStock.quantity} 
                          {units.find(u => u.id === selectedStock.unit_id)?.name && 
                            ` ${units.find(u => u.id === selectedStock.unit_id).name}`
                          }
                        </>
                      ) : (
                        formData.current_stock || 0
                      )}
                    </span>
                  </div>
                  {selectedStock?.warehouse && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Warehouse:
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedStock.warehouse.name}
                      </span>
                    </div>
                  )}
                  {selectedStock?.warehouse_id && !selectedStock?.warehouse && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Warehouse ID:
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedStock.warehouse_id}
                      </span>
                    </div>
                  )}
                </div>

                {/* Only Quantity Input */}
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
                    value={selectedStock ? selectedStock.quantity : formData.current_stock}
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
                    disabled={isSubmitting || !formData.stock_to_add || parseFloat(formData.stock_to_add) <= 0 || !formData.stock_id}
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
    </div>
  )
}

export default StockAddModal