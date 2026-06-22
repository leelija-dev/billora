import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import { productsAPI } from '../../../services/productsService'
import { sellerAPI } from '../../../services/sellerService'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import SearchSelect from '../../common/SearchSelect/SearchSelect'
import toast from 'react-hot-toast'
import { handleNumberInput, handleDecimalInput } from '../../../utils/validators'

const StockForm = ({ stock, onSubmit, onCancel, isSubmitting, products, units }) => {
  const { user } = useAuthStore()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [sellerSearchResults, setSellerSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingSeller, setIsSearchingSeller] = useState(false)
  const [optionsList, setOptionsList] = useState([])
  const [sellerOptionsList, setSellerOptionsList] = useState([])
  const [sellers, setSellers] = useState([])
  const [sellersLoading, setSellersLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm()

  // Fetch sellers on component mount
  useEffect(() => {
    const fetchSellers = async () => {
      setSellersLoading(true)
      try {
        const userId = user?.id || 1
        const response = await sellerAPI.getByUserId(userId, { page: 1, per_page: 100 })
        console.log('📦 Sellers fetched:', response.data)
        
        let sellersData = []
        
        // Handle new paginated response structure
        if (response.data?.sellers?.data) {
          // New structure: { status, message, sellers: { data: [...], total, current_page, ... } }
          sellersData = Array.isArray(response.data.sellers.data) ? response.data.sellers.data : []
        } else if (response.data?.sellers) {
          // Old structure: { status, message, sellers: [...] }
          sellersData = Array.isArray(response.data.sellers) ? response.data.sellers : []
        } else if (response.data?.data?.sellers) {
          sellersData = Array.isArray(response.data.data.sellers) ? response.data.data.sellers : []
        } else if (response.data?.data?.data) {
          sellersData = Array.isArray(response.data.data.data) ? response.data.data.data : []
        } else if (Array.isArray(response.data)) {
          sellersData = response.data
        }
        
        console.log('📊 Sellers extracted:', sellersData.length)
        setSellers(sellersData)
        
        // If editing and has seller_id, pre-select the seller
        if (stock?.seller_id) {
          const seller = sellersData.find(s => s.id === stock.seller_id)
          if (seller) {
            setSelectedSeller(seller)
            // Add to options list for SearchSelect
            const sellerOption = {
              value: seller.id.toString(),
              label: seller.name,
              description: `📧 ${seller.email || 'No email'}`,
              subtext: seller.phone ? `📞 ${seller.phone}` : null
            }
            setSellerOptionsList(prev => {
              const exists = prev.some(opt => opt.value === sellerOption.value)
              if (!exists) {
                return [sellerOption, ...prev]
              }
              return prev
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch sellers:', error)
        toast.error('Failed to load sellers')
      } finally {
        setSellersLoading(false)
      }
    }
    fetchSellers()
  }, [user?.id, stock])

  // Handle product selection
  const handleProductSelect = (productId) => {
    const id = parseInt(productId)
    const product = searchResults.length > 0 
      ? searchResults.find(p => p.id === id) 
      : products?.find(p => p.id === id)
    
    if (product) {
      setSelectedProduct(product)
      setValue('product_id', id)

      setValue('selling_price', product.selling_price || product.price || '')
      setValue('purchase_price', product.purchase_price || product.cost || '')
      setValue('unit_id', product.unit_id || '')
    }
  }

  // Handle seller selection
  const handleSellerSelect = (sellerId) => {
    const id = parseInt(sellerId)
    const seller = sellerSearchResults.length > 0 
      ? sellerSearchResults.find(s => s.id === id) 
      : sellers?.find(s => s.id === id)
    
    if (seller) {
      setSelectedSeller(seller)
      setValue('seller_id', id)
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

  // Handle seller search - search across all pages
  const handleSellerSearch = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSellerSearchResults([])
      return
    }

    setIsSearchingSeller(true)
    try {
      // First, try to search across all sellers using the API with search param
      const userId = user?.id || 1
      const response = await sellerAPI.getByUserId(userId, { 
        page: 1, 
        per_page: 100,
        search: searchTerm 
      })
      
      let searchResults = []
      if (response.data?.sellers?.data) {
        searchResults = Array.isArray(response.data.sellers.data) ? response.data.sellers.data : []
      } else if (response.data?.sellers) {
        searchResults = Array.isArray(response.data.sellers) ? response.data.sellers : []
      }
      
      console.log('🔍 Seller search results:', searchResults.length)
      setSellerSearchResults(searchResults)
    } catch (error) {
      console.error('Failed to search sellers:', error)
      // Fallback to local filtering
      const filtered = sellers.filter(seller => 
        seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.phone?.includes(searchTerm)
      )
      setSellerSearchResults(filtered)
    } finally {
      setIsSearchingSeller(false)
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

  // Custom render function for seller options
  const renderSellerOption = (option, index, isHighlighted, isSelected) => {
    const seller = sellers?.find(s => s.id === parseInt(option.value)) || sellerSearchResults.find(s => s.id === parseInt(option.value))
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
            {seller && (
              <div className="mt-1 space-y-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  {seller.email && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      📧 {seller.email}
                    </span>
                  )}
                  {seller.phone && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      📞 {seller.phone}
                    </span>
                  )}
                  {seller.gst_number && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      GST: {seller.gst_number}
                    </span>
                  )}
                  {parseFloat(seller.due_amount) > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                      Due: ₹{parseFloat(seller.due_amount).toFixed(2)}
                    </span>
                  )}
                </div>
                {(seller.city || seller.state) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {[seller.city, seller.state].filter(Boolean).join(', ')}
                  </div>
                )}
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
      
      // Set form values for editing
      reset({
        product_id: stock.product_id,
        seller_id: stock.seller_id,
        quantity: stock.quantity,
        selling_price: stock.selling_price,
        purchase_price: stock.purchase_price,
        unit_id: stock.unit_id,
        product_package_id: stock.product_package_id,
        invoice_number: stock.invoice_number || '',
        invoice_image: stock.invoice_image || '',
        invoice_date: stock.invoice_date || '',
        paid_amount: stock.paid_amount || '',
        purchase_gst: stock.purchase_gst || '',
        selling_gst: stock.selling_gst || '',
      })

      // Find and set the selected product
      if (stock.product_id) {
        let product = products?.find(p => p.id === stock.product_id)
        if (!product && stock.product) {
          product = stock.product
        }
        if (product) {
          setSelectedProduct(product)
          const productOption = {
            value: product.id.toString(),
            label: product.name || product.product_name,
            description: `📦 SKU: ${product.sku || product.code || 'N/A'}`,
            subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null
          }
          setOptionsList(prev => {
            const exists = prev.some(opt => opt.value === productOption.value)
            if (!exists) {
              return [productOption, ...prev]
            }
            return prev
          })
        }
      }

      // Find and set the selected seller
      if (stock.seller_id) {
        const seller = sellers?.find(s => s.id === stock.seller_id)
        if (seller) {
          setSelectedSeller(seller)
          const sellerOption = {
            value: seller.id.toString(),
            label: seller.name,
            description: `📧 ${seller.email || 'No email'}`,
            subtext: seller.phone ? `📞 ${seller.phone}` : null
          }
          setSellerOptionsList(prev => {
            const exists = prev.some(opt => opt.value === sellerOption.value)
            if (!exists) {
              return [sellerOption, ...prev]
            }
            return prev
          })
        }
      }
    }
  }, [stock, reset, products, sellers])

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
    let productList = products || []
    if (searchResults.length > 0) {
      productList = searchResults
    }
    
    const options = productList.map(product => ({
      value: product.id.toString(),
      label: product.name || product.product_name,
      description: `📦 SKU: ${product.sku || product.code || product.product_code || 'N/A'}`,
      subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null
    }))
    
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

  // Prepare options for Seller SearchSelect
  const getSellerOptions = () => {
    let sellerList = sellers || []
    if (sellerSearchResults.length > 0) {
      sellerList = sellerSearchResults
    }
    
    const options = sellerList.map(seller => ({
      value: seller.id.toString(),
      label: seller.name,
      description: `📧 ${seller.email || 'No email'}`,
      subtext: seller.phone ? `📞 ${seller.phone}` : null
    }))
    
    if (sellerOptionsList.length > 0) {
      const allOptions = [...sellerOptionsList]
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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {stock ? 'Edit Stock Entry' : 'Add New Stock Entry'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Hidden user_id field */}
      <input type="hidden" {...register('user_id')} value={user.id} />
      
      {/* Seller & Invoice Section */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <span className="w-1 h-5 bg-blue-500 rounded mr-2"></span>
          Seller & Invoice Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seller Name - Searchable Dropdown */}
          <SearchSelect
            label="Seller Name"
            options={getSellerOptions()}
            value={selectedSeller?.id?.toString() || ''}
            onChange={handleSellerSelect}
            placeholder="Search seller by name, email, or phone..."
            required
            renderOption={renderSellerOption}
            onSearchChange={handleSellerSearch}
            isLoading={isSearchingSeller || sellersLoading}
            minSearchLength={2}
          />

          {/* Invoice Number */}
          <Input
            label="Invoice Number"
            type="text"
            placeholder="Enter invoice number"
            error={errors.invoice_number?.message}
            {...register('invoice_number', { 
              required: 'Invoice number is required'
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Date */}
          <Input
            label="Invoice Date"
            type="date"
            placeholder="Select invoice date"
            error={errors.invoice_date?.message}
            {...register('invoice_date', { 
              required: 'Invoice date is required'
            })}
          />

          {/* Paid Amount */}
          <Input
            label="Paid Amount"
            type="text"
            step="0.01"
            placeholder="Enter paid amount"
            error={errors.paid_amount?.message}
            {...register('paid_amount', { 
              valueAsNumber: true,
              onChange: (e) => handleDecimalInput(e)
            })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Invoice Image */}
          <Input
            label="Invoice Image"
            type="file"
            accept="image/*,.pdf"
            placeholder="Upload invoice image"
            error={errors.invoice_image?.message}
            {...register('invoice_image')}
          />
          {stock?.invoice_image && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current file: {stock.invoice_image}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <span className="w-1 h-5 bg-green-500 rounded mr-2"></span>
          Product Details
        </h4>
        
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

          <Input
            label="Purchase GST (%)"
            type="text"
            step="0.01"
            placeholder="Enter purchase GST percentage"
            error={errors.purchase_gst?.message}
            {...register('purchase_gst', { 
              valueAsNumber: true,
              onChange: (e) => handleDecimalInput(e)
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
            label="Selling GST (%)"
            type="text"
            step="0.01"
            placeholder="Enter selling GST percentage"
            error={errors.selling_gst?.message}
            {...register('selling_gst', { 
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
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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