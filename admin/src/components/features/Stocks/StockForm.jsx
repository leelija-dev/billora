import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import { productsAPI } from '../../../services/productsService'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import SearchSelect from '../../common/SearchSelect/SearchSelect'
import toast from 'react-hot-toast'
import { handleNumberInput, handleDecimalInput } from '../../../utils/validators'

const StockForm = ({ stock, onSubmit, onCancel, isSubmitting, products, units }) => {
  const { user } = useAuthStore()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [optionsList, setOptionsList] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm()

  // Handle product selection
  const handleProductSelect = (productId) => {
    // Convert to number if needed
    const id = parseInt(productId)
    const product = searchResults.length > 0 
      ? searchResults.find(p => p.id === id) 
      : products?.find(p => p.id === id)
    
    if (product) {
      setSelectedProduct(product)
      setValue('product_id', id)

      // Pre-fill other fields except quantity
      setValue('selling_price', product.selling_price || product.price || '')
      setValue('purchase_price', product.purchase_price || product.cost || '')
      setValue('unit_id', product.unit_id || '')
    }
  }

  // Handle product search
  const handleProductSearch = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await productsAPI.search(searchTerm)
      const productsData = response.data?.data?.data || response.data?.data || []
      setSearchResults(productsData)
    } catch (error) {
      console.error('Failed to search products:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Custom render function for product options
  const renderProductOption = (option, index, isHighlighted, isSelected) => {
    const product = products?.find(p => p.id === parseInt(option.value)) || searchResults.find(p => p.id === parseInt(option.value))
    return (
      <div
        key={option.value}
        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
        } ${isHighlighted ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </div>
            )}
            {product && (
              <div className="mt-2 space-y-1">
                {/* Brand & Category */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.brand?.name && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      🏷️ {product.brand.name}
                    </span>
                  )}
                  {product.category?.name && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      📂 {product.category.name}
                    </span>
                  )}
                  {product.unit?.name && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      📦 {product.unit.name} ({product.unit.code})
                    </span>
                  )}
                </div>

                {/* Attributes */}
                {product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.attributes.map((attr, idx) => {
                      if (typeof attr === 'object' && attr !== null) {
                        return Object.entries(attr).map(([key, value]) => (
                          <span key={`${idx}-${key}`} className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {key}: {value}
                          </span>
                        ))
                      }
                      return null
                    })}
                  </div>
                )}

                {/* Variants */}
                {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.variants.slice(0, 3).map((variant, idx) => {
                      const variantValues = []
                      if (variant.size) variantValues.push(`Size: ${variant.size}`)
                      if (variant.color) variantValues.push(`Color: ${variant.color}`)
                      if (variant.material) variantValues.push(`Material: ${variant.material}`)
                      if (variant.gender) variantValues.push(`Gender: ${variant.gender}`)

                      return variantValues.map((val, valIdx) => (
                        <span key={`${idx}-${valIdx}`} className="inline-block px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                          {val}
                        </span>
                      ))
                    })}
                    {product.variants.length > 3 && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        +{product.variants.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Prices */}
                <div className="flex items-center gap-3 mt-1 text-xs">
                  {product.selling_price && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Selling: ₹{product.selling_price}
                    </span>
                  )}
                  {product.purchase_price && (
                    <span className="text-red-600 dark:text-red-400">
                      Purchase: ₹{product.purchase_price}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (stock) {
      console.log('📝 StockForm - Stock prop received:', stock)
      console.log('📝 StockForm - Products available:', products)
      
      // Set form values for editing
      reset({
        product_id: stock.product_id,
        quantity: stock.quantity,
        selling_price: stock.selling_price,
        purchase_price: stock.purchase_price,
        unit_id: stock.unit_id,
        product_package_id: stock.product_package_id,
      })
      
      console.log('📝 StockForm - Form values set after reset:', {
        product_id: stock.product_id,
        quantity: stock.quantity,
        selling_price: stock.selling_price,
        purchase_price: stock.purchase_price,
        unit_id: stock.unit_id,
      })

      // Find and set the selected product for prefilling the SearchSelect
      if (stock.product_id) {
        // Try to find product in products array first
        let product = products?.find(p => p.id === stock.product_id)
        
        // If not found, try to get from stock.product object
        if (!product && stock.product) {
          product = stock.product
        }
        
        // If still not found and we have products, try to fetch it
        if (!product && products && products.length > 0) {
          product = products.find(p => p.id === parseInt(stock.product_id))
        }
        
        if (product) {
          console.log('📝 StockForm - Setting selected product:', product)
          setSelectedProduct(product)
          // Also ensure the product is in the options list for SearchSelect
          // Create an option for this product if it's not already in the list
          const productOption = {
            value: product.id.toString(),
            label: product.name || product.product_name,
            description: `📦 SKU: ${product.sku || product.code || product.product_code || 'N/A'}`,
            subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null
          }
          
          // Add to options list if not already present
          setOptionsList(prev => {
            const exists = prev.some(opt => opt.value === productOption.value)
            if (!exists) {
              return [productOption, ...prev]
            }
            return prev
          })
        } else {
          console.log('📝 StockForm - Product not found for ID:', stock.product_id)
          console.log('📝 StockForm - Available product IDs:', products?.map(p => p.id))
          
          // Try to fetch the product if not found in the list
          const fetchProduct = async () => {
            try {
              const response = await productsAPI.getById(stock.product_id)
              const productData = response.data?.data || response.data
              if (productData) {
                console.log('📝 StockForm - Fetched product:', productData)
                setSelectedProduct(productData)
                const productOption = {
                  value: productData.id.toString(),
                  label: productData.name || productData.product_name,
                  description: `📦 SKU: ${productData.sku || productData.code || 'N/A'}`,
                  subtext: productData.brand?.name ? `🏷️ Brand: ${productData.brand.name}` : null
                }
                setOptionsList(prev => [productOption, ...prev])
              }
            } catch (error) {
              console.error('Failed to fetch product:', error)
            }
          }
          fetchProduct()
        }
      }
    }
  }, [stock, reset, products])

  const onFormSubmit = (data) => {
    const stockData = {
      ...data,
      user_id: user.id,
      created_by: user.id,
    }
    console.log('📝 StockForm - Form data submitted:', data)
    console.log('📝 StockForm - Final stock data:', stockData)
    onSubmit(stockData)
  }

  // Prepare options for SearchSelect - combine products and search results
  const getProductOptions = () => {
    // Use products as the base list
    let productList = products || []
    
    // If we have search results, use them instead (for search functionality)
    if (searchResults.length > 0) {
      productList = searchResults
    }
    
    // Convert to options format
    const options = productList.map(product => ({
      value: product.id.toString(),
      label: product.name || product.product_name,
      description: `📦 SKU: ${product.sku || product.code || product.product_code || 'N/A'}`,
      subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null
    }))
    
    // If we have custom options from editing (selected product not in list), add them
    if (optionsList.length > 0) {
      const allOptions = [...optionsList]
      options.forEach(opt => {
        if (!allOptions.some(existing => existing.value === opt.value)) {
          allOptions.push(opt)
        }
      })
      return allOptions
    }
    
    return options
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hidden user_id field */}
      <input type="hidden" {...register('user_id')} value={user.id} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchSelect
          label="Product"
          options={getProductOptions()}
          value={selectedProduct?.id?.toString() || ''}
          onChange={handleProductSelect}
          placeholder="Search product by name, SKU, brand..."
          required
          renderOption={renderProductOption}
          onSearchChange={handleProductSearch}
          isLoading={isSearching}
          minSearchLength={2}
        />

        <Input
          label="Quantity"
          type="text"
          min="1"
          step="1"
          placeholder="Enter quantity"
          error={errors.quantity?.message}
          {...register('quantity', { 
            required: 'Quantity is required',
            valueAsNumber: true,
            onChange: (e) => handleNumberInput(e)
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Selling Price"
          type="text"
          step="0.01"
          placeholder="Enter selling price"
          error={errors.selling_price?.message}
          {...register('selling_price', { 
            valueAsNumber: true,
            onChange: (e) => handleDecimalInput(e)
          })}
        />

        <Input
          label="Purchase Price"
          type="text"
          step="0.01"
          placeholder="Enter purchase price"
          error={errors.purchase_price?.message}
          {...register('purchase_price', { 
            valueAsNumber: true,
            onChange: (e) => handleDecimalInput(e)
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Unit"
          options={[
            { value: '', label: 'Select Unit' },
            ...(units?.map(unit => ({
              value: unit.id.toString(),
              label: `${unit.name} (${unit.code})`,
            })) || [])
          ]}
          error={errors.unit_id?.message}
          {...register('unit_id', { 
            required: 'Unit is required',
            valueAsNumber: true,
            setValueAs: (value) => value ? parseInt(value) : null
          })}
        />

        <div>
          {/* Product Package field removed */}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit(onFormSubmit)}
          isLoading={isSubmitting}
        >
          {stock ? 'Update Stock' : 'Create Stock'}
        </Button>
      </div>
    </motion.div>
  )
}

export default StockForm