// components/features/Products/ProductForm.js
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import { productsAPI } from '../../../services/productsService'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi'

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  
  // State for create page data
  const [createPageData, setCreatePageData] = useState({
    brands: [],
    categories: [],
    units: [],
    inputPermissions: []
  })
  const [loadingData, setLoadingData] = useState(false)
  
  // State for images and variants
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [variants, setVariants] = useState([])
  
  // State for dynamic attributes
  const [attributes, setAttributes] = useState([
    { key: '', value: '' }
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      user_id: user?.id || '',
      name: '',
      sku: '',
      brand_id: '',
      category_id: '',
      unit_amount: '',
      unit_id: '',
      selling_price: '',
      purchase_price: '',
      gst_percentage: '',
      discount_percentage: '',
      description: '',
      is_active: true,
      created_by: user?.id || '',
      // Additional fields
      conversion_factor: '',
      minimum_stock_quantity: '',
      maximum_stock_quantity: '',
      current_stock: '',
      mrp: '',
      wholesale_price: '',
      gst_hsn_code: '',
      discount_amount: '',
      cess_percentage: '',
      attributes: '',
      medicine_type: '',
      other_medicine_type: '',
      expiry_date: '',
      batch_number: '',
      manufacturer_name: '',
      prescription_required: false,
      schedule_type: '',
      salt_composition: '',
      perishable: false,
      organic_certified: false,
      harvest_date: '',
      storage_instructions: '',
      short_description: '',
      is_featured: false,
      is_returnable: false,
      is_refundable: false,
      warranty_months: '',
      warehouse_location: '',
      supplier_id: '',
      updated_by: user?.id || '',
    }
  })

  // Fetch create page data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCreatePageData()
    }
  }, [user?.id])

  // Fetch create page data
  const fetchCreatePageData = async () => {
    setLoadingData(true)
    try {
      const response = await productsAPI.getCreatePage(user.id)
      const data = response.data
      
      setCreatePageData({
        brands: data.brand || [],
        categories: data.category || [],
        units: data.unit || [],
        inputPermissions: data.inputPermission || []
      })
      
      console.log('Create page data loaded:', data)
    } catch (error) {
      console.error('Failed to fetch create page data:', error)
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  // Set form values when editing
  useEffect(() => {
    if (product && createPageData.brands.length > 0) {
      // Set all form values for editing
      Object.keys(product).forEach(key => {
        if (key !== 'images' && key !== 'variants' && key !== 'attributes') {
          setValue(key, product[key] || '')
        }
      })
      
      // Handle images
      if (product.images && Array.isArray(product.images)) {
        setSelectedImages(product.images)
        setImagePreviews(product.images.map(img => img.url || img))
      }
      
      // Handle variants
      if (product.variants && Array.isArray(product.variants)) {
        setVariants(product.variants)
      }
      
      // Handle attributes
      if (product.attributes && typeof product.attributes === 'object') {
        const attrsArray = Object.entries(product.attributes).map(([key, value]) => ({
          key,
          value: String(value)
        }))
        setAttributes(attrsArray.length > 0 ? attrsArray : [{ key: '', value: '' }])
      }
    }
  }, [product, createPageData.brands, setValue])

  // Check if user has permission for a specific field
  const hasPermission = (fieldSlug) => {
    return createPageData.inputPermissions.some(permission => 
      permission.input_permission?.slug === fieldSlug
    )
  }

  // Dynamic field rendering based on permissions
  const renderField = (fieldSlug, component) => {
    if (!hasPermission(fieldSlug)) return null
    return component
  }

  // Image handling functions
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file size and type
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Image ${file.name} size must be less than 10MB`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} must be an image`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const newImages = [...selectedImages, ...validFiles]
    setSelectedImages(newImages)

    // Create previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Variant handling
  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', material: '', gender: '' }])
  }

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  // Attribute handling functions
  const addAttribute = () => {
    setAttributes(prev => [...prev, { key: '', value: '' }])
  }

  const updateAttribute = (index, field, value) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    ))
  }

  const removeAttribute = (index) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  // Form submission
  const onFormSubmit = (data) => {
    // Convert attributes array to JSON object
    const attributesObject = attributes
      .filter(attr => attr.key.trim() !== '')
      .reduce((acc, attr) => {
        acc[attr.key.trim()] = attr.value.trim()
        return acc
      }, {})

    const productData = {
      ...data,
      user_id: user.id,
      created_by: user.id,
      images: selectedImages,
      variants: variants,
      // Set attributes as JSON object (will be empty if no attributes)
      attributes: Object.keys(attributesObject).length > 0 ? attributesObject : null,
      // Convert boolean fields to integers for backend
      is_active: data.is_active ? 1 : 0,
      prescription_required: data.prescription_required ? 1 : 0,
      perishable: data.perishable ? 1 : 0,
      organic_certified: data.organic_certified ? 1 : 0,
      is_featured: data.is_featured ? 1 : 0,
      is_returnable: data.is_returnable ? 1 : 0,
      is_refundable: data.is_refundable ? 1 : 0,
    }
    onSubmit(productData)
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading form data...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hidden user_id and created_by fields */}
      <input type="hidden" {...register('user_id')} value={user.id} />
      <input type="hidden" {...register('created_by')} value={user.id} />

      {/* Image Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Images</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload high-quality product images</p>
          </div>
          {imagePreviews.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {imagePreviews.length} images
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-500">
                <img 
                  src={preview} 
                  alt={`Product image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg group-hover:scale-110"
                title="Remove image"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all duration-200">
                <FiUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-all duration-200" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200">
                Upload Images
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Basic Product Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Core product details and identifiers</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name?.message}
              {...register('name', { required: 'Product name is required' })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              label="Product Code (SKU)"
              placeholder="Enter product code"
              error={errors.sku?.message}
              {...register('sku', { required: 'Product code is required' })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-6">
            <Select
              label="Brand"
              options={[
                { value: '', label: 'Select Brand' },
                ...(createPageData.brands?.map(brand => ({
                  value: brand.id,
                  label: brand.name,
                })) || [])
              ]}
              error={errors.brand_id?.message}
              {...register('brand_id', { required: 'Brand is required' })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Select
              label="Category"
              options={[
                { value: '', label: 'Select Category' },
                ...(createPageData.categories?.map(category => ({
                  value: category.id,
                  label: category.name,
                })) || [])
              ]}
              error={errors.category_id?.message}
              {...register('category_id', { required: 'Category is required' })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set product prices and tax details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Input
              label="Unit Amount"
              type="number"
              step="0.01"
              placeholder="Enter unit amount"
              error={errors.unit_amount?.message}
              {...register('unit_amount', { 
                required: 'Unit amount is required',
                valueAsNumber: true 
              })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              label="Selling Price"
              type="number"
              step="0.01"
              placeholder="Enter selling price"
              error={errors.selling_price?.message}
              {...register('selling_price', { 
                valueAsNumber: true 
              })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              label="GST Percentage"
              type="number"
              step="0.01"
              placeholder="Enter GST percentage"
              error={errors.gst_percentage?.message}
              {...register('gst_percentage', { 
                valueAsNumber: true 
              })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-6">
            <Select
              label="Unit"
              options={[
                { value: '', label: 'Select Unit' },
                ...(createPageData.units?.map(unit => ({
                  value: unit.id,
                  label: `${unit.name} (${unit.code})`,
                })) || [])
              ]}
              error={errors.unit_id?.message}
              {...register('unit_id', { required: 'Unit is required' })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              label="Purchase Price"
              type="number"
              step="0.01"
              placeholder="Enter purchase price"
              error={errors.purchase_price?.message}
              {...register('purchase_price', { 
                valueAsNumber: true 
              })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              label="Discount Percentage"
              type="number"
              step="0.01"
              placeholder="Enter discount percentage"
              error={errors.discount_percentage?.message}
              {...register('discount_percentage', { 
                valueAsNumber: true 
              })}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Description</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed product information</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
              placeholder="Enter detailed product description..."
              {...register('description')}
            />
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-3 w-4 h-4"
              {...register('is_active')}
            />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Product
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enable this product for sales and display
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Attributes */}
      {hasPermission('attributes') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Attributes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add custom key-value pairs for product specifications</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {attributes.filter(attr => attr.key.trim() !== '').length} active
              </span>
            </div>
          </div>
          
          {/* Display existing attributes */}
          <div className="space-y-4 mb-6">
            {attributes.map((attr, index) => (
              <div key={index} className="relative group">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      label="Attribute Key"
                      placeholder="e.g., color, size, material"
                      value={attr.key}
                      onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Attribute Value"
                      placeholder="e.g., red, large, cotton"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end h-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAttribute(index)}
                      className="text-red-500 min-h-[42px] hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group-hover:opacity-100 opacity-60"
                      title="Remove attribute"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < attributes.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent transform translate-y-2"></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Add new attribute button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={addAttribute}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-blue-200 dark:border-blue-700"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Attribute</span>
            </Button>
            
            {attributes.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAttributes([{ key: '', value: '' }])}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* JSON Preview */}
          {attributes.some(attr => attr.key.trim() !== '') && (
            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  JSON Output Preview
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                  {Object.keys(attributes.filter(attr => attr.key.trim() !== '').reduce((acc, attr) => {
                    acc[attr.key.trim()] = attr.value.trim()
                    return acc
                  }, {})).length} properties
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                  {JSON.stringify(
                    attributes
                      .filter(attr => attr.key.trim() !== '')
                      .reduce((acc, attr) => {
                        acc[attr.key.trim()] = attr.value.trim()
                        return acc
                      }, {}),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stock Information */}
      {(hasPermission('conversion_factor') || hasPermission('minimum_stock_quantity') || hasPermission('maximum_stock_quantity') || hasPermission('current_stock') || hasPermission('warehouse_location')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Stock Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('conversion_factor', (
              <Input
                label="Conversion Factor"
                type="number"
                step="0.01"
                placeholder="Enter conversion factor"
                error={errors.conversion_factor?.message}
                {...register('conversion_factor', { valueAsNumber: true })}
              />
            ))}

            {renderField('minimum_stock_quantity', (
              <Input
                label="Minimum Stock Quantity"
                type="number"
                step="1"
                placeholder="Enter minimum stock quantity"
                error={errors.minimum_stock_quantity?.message}
                {...register('minimum_stock_quantity', { valueAsNumber: true })}
              />
            ))}

            {renderField('maximum_stock_quantity', (
              <Input
                label="Maximum Stock Quantity"
                type="number"
                step="1"
                placeholder="Enter maximum stock quantity"
                error={errors.maximum_stock_quantity?.message}
                {...register('maximum_stock_quantity', { valueAsNumber: true })}
              />
            ))}

            {renderField('current_stock', (
              <Input
                label="Current Stock"
                type="number"
                step="1"
                placeholder="Enter current stock"
                error={errors.current_stock?.message}
                {...register('current_stock', { valueAsNumber: true })}
              />
            ))}

            {renderField('warehouse_location', (
              <Input
                label="Warehouse Location"
                placeholder="Enter warehouse location"
                error={errors.warehouse_location?.message}
                {...register('warehouse_location')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Additional Pricing */}
      {(hasPermission('mrp') || hasPermission('wholesale_price') || hasPermission('discount_amount') || hasPermission('cess_percentage')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('mrp', (
              <Input
                label="MRP (Maximum Retail Price)"
                type="number"
                step="0.01"
                placeholder="Enter MRP"
                error={errors.mrp?.message}
                {...register('mrp', { valueAsNumber: true })}
              />
            ))}

            {renderField('wholesale_price', (
              <Input
                label="Wholesale Price"
                type="number"
                step="0.01"
                placeholder="Enter wholesale price"
                error={errors.wholesale_price?.message}
                {...register('wholesale_price', { valueAsNumber: true })}
              />
            ))}

            {renderField('discount_amount', (
              <Input
                label="Discount Amount"
                type="number"
                step="0.01"
                placeholder="Enter discount amount"
                error={errors.discount_amount?.message}
                {...register('discount_amount', { valueAsNumber: true })}
              />
            ))}

            {renderField('cess_percentage', (
              <Input
                label="CESS Percentage"
                type="number"
                step="0.01"
                placeholder="Enter CESS percentage"
                error={errors.cess_percentage?.message}
                {...register('cess_percentage', { valueAsNumber: true })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tax Information */}
      {hasPermission('gst-hsn-code') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tax Information</h3>
          
          <Input
            label="GST HSN Code"
            placeholder="Enter GST HSN code"
            error={errors.gst_hsn_code?.message}
            {...register('gst_hsn_code')}
          />
        </div>
      )}

      {/* Medicine Specific Fields */}
      {(hasPermission('medicine-type') || hasPermission('other-medicine-type') || hasPermission('expiry-date') || hasPermission('batch-number') || hasPermission('manufacturer-name') || hasPermission('prescription-required') || hasPermission('schedule-type') || hasPermission('salt-composition')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Medicine Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('medicine_type', (
              <Input
                label="Medicine Type"
                placeholder="Enter medicine type"
                error={errors.medicine_type?.message}
                {...register('medicine_type')}
              />
            ))}

            {renderField('other_medicine_type', (
              <Input
                label="Other Medicine Type"
                placeholder="Enter other medicine type"
                error={errors.other_medicine_type?.message}
                {...register('other_medicine_type')}
              />
            ))}

            {renderField('expiry_date', (
              <Input
                label="Expiry Date"
                type="date"
                error={errors.expiry_date?.message}
                {...register('expiry_date')}
              />
            ))}

            {renderField('batch_number', (
              <Input
                label="Batch Number"
                placeholder="Enter batch number"
                error={errors.batch_number?.message}
                {...register('batch_number')}
              />
            ))}

            {renderField('manufacturer_name', (
              <Input
                label="Manufacturer Name"
                placeholder="Enter manufacturer name"
                error={errors.manufacturer_name?.message}
                {...register('manufacturer_name')}
              />
            ))}

            {renderField('prescription_required', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('prescription_required')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Prescription Required
                </label>
              </div>
            ))}

            {renderField('schedule_type', (
              <Input
                label="Schedule Type"
                placeholder="Enter schedule type"
                error={errors.schedule_type?.message}
                {...register('schedule_type')}
              />
            ))}

            {renderField('salt_composition', (
              <Input
                label="Salt Composition"
                placeholder="Enter salt composition"
                error={errors.salt_composition?.message}
                {...register('salt_composition')}
              />
            ))}

            {renderField('warranty_months', (
              <Input
                label="Warranty Months"
                type="number"
                placeholder="Enter warranty months"
                error={errors.warranty_months?.message}
                {...register('warranty_months', { valueAsNumber: true })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Agricultural/Perishable Fields */}
      {(hasPermission('perishable') || hasPermission('organic-certified') || hasPermission('harvest-date') || hasPermission('storage-instructions')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Agricultural Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('perishable', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('perishable')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Perishable
                </label>
              </div>
            ))}

            {renderField('organic_certified', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('organic_certified')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Organic Certified
                </label>
              </div>
            ))}

            {renderField('harvest_date', (
              <Input
                label="Harvest Date"
                type="date"
                error={errors.harvest_date?.message}
                {...register('harvest_date')}
              />
            ))}

            {renderField('storage_instructions', (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Storage Instructions
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter storage instructions"
                  {...register('storage_instructions')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants Section */}
      {(hasPermission('size') || hasPermission('color') || hasPermission('material') || hasPermission('gender')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Variants</h3>
            <Button
              type="button"
              variant="outline"
              onClick={addVariant}
              className="flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {renderField('size', (
                  <Input
                    label="Size"
                    placeholder="Enter size"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  />
                ))}
                
                {renderField('color', (
                  <Input
                    label="Color"
                    placeholder="Enter color"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                  />
                ))}
                
                {renderField('material', (
                  <Input
                    label="Material"
                    placeholder="Enter material"
                    value={variant.material}
                    onChange={(e) => updateVariant(index, 'material', e.target.value)}
                  />
                ))}
                
                {renderField('gender', (
                  <Select
                    label="Gender"
                    options={[
                      { value: '', label: 'Select Gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'unisex', label: 'Unisex' },
                    ]}
                    value={variant.gender}
                    onChange={(e) => updateVariant(index, 'gender', e.target.value)}
                  />
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Description */}
      {hasPermission('short_description') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Description</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter short description"
              {...register('short_description')}
            />
          </div>
        </div>
      )}

      {/* Additional Options */}
      {(hasPermission('is_featured') || hasPermission('is_returnable') || hasPermission('is_refundable')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField('is_featured', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('is_featured')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Featured Product
                </label>
              </div>
            ))}

            {renderField('is_returnable', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('is_returnable')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Returnable
                </label>
              </div>
            ))}

            {renderField('is_refundable', (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  {...register('is_refundable')}
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Refundable
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Save?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review your product details before submitting</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit(onFormSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {product ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {product ? 'Update Product' : 'Create Product'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductForm
