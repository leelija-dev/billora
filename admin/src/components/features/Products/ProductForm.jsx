// components/features/Products/ProductForm.js
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import useMedicineTypeStore from '../../../store/medicineTypeStore'
import { productsAPI } from '../../../services/productsService'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  const { fetchMedicineTypes, medicineTypes } = useMedicineTypeStore()
  
  // State for create page data
  const [createPageData, setCreatePageData] = useState({
    brands: [],
    categories: [],
    units: [],
    medicineTypes: [],
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
      medicine_type_id: '',
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
      fetchMedicineTypes(user.id)
    }
  }, [user?.id, fetchMedicineTypes])

  // Update create page data when medicine types are loaded
  useEffect(() => {
    if (medicineTypes && medicineTypes.length > 0) {
      setCreatePageData(prev => ({
        ...prev,
        medicineTypes
      }))
    }
  }, [medicineTypes])

  // Fetch create page data
  const fetchCreatePageData = async () => {
    setLoadingData(true)
    try {
      const response = await productsAPI.getCreatePage(user.id)
      const data = response.data
      
      // Extract input permissions properly
      const inputPermissions = data.inputPermission || []
      
      setCreatePageData({
        brands: data.brand || [],
        categories: data.category || [],
        units: data.unit || [],
        medicineTypes: [], // Will be populated by medicine type store
        inputPermissions: inputPermissions
      })
      
      console.log('Create page data loaded:', data)
      console.log('Input permissions:', inputPermissions)
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
      
      // Set variants in form state
      if (product.variants && Array.isArray(product.variants)) {
        setVariants(product.variants)
        setValue('variants', product.variants)
      } else {
        setVariants([])
        setValue('variants', [])
      }
      
      // Set attributes in form state
      if (product.attributes) {
        let parsedAttributes = product.attributes
        
        // Parse attributes if it's a JSON string
        if (typeof product.attributes === 'string') {
          try {
            parsedAttributes = JSON.parse(product.attributes)
          } catch (error) {
            console.error('Error parsing attributes JSON:', error)
            parsedAttributes = {}
          }
        }
        
        // Handle API response format (array of objects)
        if (Array.isArray(parsedAttributes)) {
          // If it's already an array, merge all objects into one
          const mergedAttributes = {}
          parsedAttributes.forEach(attrObj => {
            if (typeof attrObj === 'object' && attrObj !== null) {
              Object.assign(mergedAttributes, attrObj)
            }
          })
          
          // Convert to array format for form display
          const attrsArray = Object.entries(mergedAttributes).map(([key, value]) => ({
            key,
            value: String(value)
          }))
          setAttributes(attrsArray.length > 0 ? attrsArray : [{ key: '', value: '' }])
          setValue('attributes', mergedAttributes)
        } else if (typeof parsedAttributes === 'object' && parsedAttributes !== null) {
          // Convert to array format for form display
          const attrsArray = Object.entries(parsedAttributes).map(([key, value]) => ({
            key,
            value: String(value)
          }))
          setAttributes(attrsArray.length > 0 ? attrsArray : [{ key: '', value: '' }])
          setValue('attributes', parsedAttributes)
        } else {
          setAttributes([{ key: '', value: '' }])
          setValue('attributes', {})
        }
      } else {
        setAttributes([{ key: '', value: '' }])
        setValue('attributes', {})
      }
      
      // Handle images
      if (product.images && Array.isArray(product.images)) {
        setSelectedImages(product.images)
        setImagePreviews(product.images.map(img => img.url || img))
      }
    }
  }, [product, createPageData.brands, setValue])

  // Check if user has permission for a specific field
  const hasPermission = (fieldSlug) => {
    if (!createPageData.inputPermissions.length) return false
    
    const hasPerm = createPageData.inputPermissions.some(permission => {
      // Access the nested input_permission object's slug
      const permSlug = permission?.input_permission?.slug
      
      // Check both underscore and hyphen versions
      const underscoreVersion = fieldSlug.replace(/-/g, '_')
      const hyphenVersion = fieldSlug.replace(/_/g, '-')
      
      return permSlug === fieldSlug || permSlug === underscoreVersion || permSlug === hyphenVersion
    })
    
    return hasPerm
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
    // Convert attributes to array format expected by backend
    const attributesArray = attributes
      .filter(attr => attr.key.trim() !== '')
      .reduce((acc, attr) => {
        // Group attributes by creating objects with multiple key-value pairs
        if (acc.length === 0) {
          acc.push({})
        }
        acc[0][attr.key.trim()] = attr.value.trim()
        return acc
      }, [])

    // Convert empty/null numeric fields to 0
    const numericFieldsToZero = [
      'current_stock',
      'discount_amount', 
      'discount_percentage',
      'cess_percentage',
      'supplier_id',
      'maximum_stock_quantity',
      'minimum_stock_quantity',
      'mrp',
      'wholesale_price'
    ]

    const processedData = { ...data }
    numericFieldsToZero.forEach(field => {
      processedData[field] = processedData[field] === null || processedData[field] === '' || processedData[field] === undefined ? 0 : processedData[field]
    })

    const productData = {
      ...processedData,
      user_id: user.id,
      created_by: user.id,
      images: selectedImages,
      variants: variants,
      attributes: attributesArray.length > 0 ? attributesArray : [],
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
      <input type="hidden" {...register('user_id')} value={user?.id || ''} />
      <input type="hidden" {...register('created_by')} value={user?.id || ''} />

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
                  alt={`Product ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg"
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
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUpload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
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
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Core product details and identifiers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register('name', { required: 'Product name is required' })}
          />

          <Input
            label="Product Code (SKU)"
            placeholder="Enter product code"
            error={errors.sku?.message}
            {...register('sku', { required: 'Product code is required' })}
          />

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
          />
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set product prices and tax details</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          />

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
          />

          <Input
            label="Selling Price"
            type="number"
            step="0.01"
            placeholder="Enter selling price"
            error={errors.selling_price?.message}
            {...register('selling_price', { valueAsNumber: true })}
          />

          <Input
            label="Purchase Price"
            type="number"
            step="0.01"
            placeholder="Enter purchase price"
            error={errors.purchase_price?.message}
            {...register('purchase_price', { valueAsNumber: true })}
          />

          <Input
            label="GST Percentage"
            type="number"
            step="0.01"
            placeholder="Enter GST percentage"
            error={errors.gst_percentage?.message}
            {...register('gst_percentage', { valueAsNumber: true })}
          />

          <Input
            label="Discount Percentage"
            type="number"
            step="0.01"
            placeholder="Enter discount percentage"
            error={errors.discount_percentage?.message}
            {...register('discount_percentage', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Description</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed product information</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
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
      {renderField('attributes', (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Attributes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add custom key-value pairs for product specifications</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {attributes.filter(attr => attr.key.trim() !== '').length} active
            </span>
          </div>
          
          <div className="space-y-4 mb-6">
            {attributes.map((attr, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                  label="Attribute Key"
                  placeholder="e.g., color, size, material"
                  value={attr.key}
                  onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                />
                <Input
                  label="Attribute Value"
                  placeholder="e.g., red, large, cotton"
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeAttribute(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={addAttribute}
              className="flex items-center space-x-2 text-blue-600"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Attribute</span>
            </Button>
            
            {attributes.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAttributes([{ key: '', value: '' }])}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Stock Information */}
      {(hasPermission('conversion_factor') || hasPermission('minimum_stock_quantity') || 
        hasPermission('maximum_stock_quantity') || hasPermission('current_stock') || 
        hasPermission('warehouse_location')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Stock Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Enter minimum stock"
                error={errors.minimum_stock_quantity?.message}
                {...register('minimum_stock_quantity', { valueAsNumber: true })}
              />
            ))}

            {renderField('maximum_stock_quantity', (
              <Input
                label="Maximum Stock Quantity"
                type="number"
                step="1"
                placeholder="Enter maximum stock"
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
      {(hasPermission('mrp') || hasPermission('wholesale_price') || 
        hasPermission('discount_amount') || hasPermission('cess_percentage')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      {renderField('gst-hsn-code', (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tax Information</h3>
          
          <Input
            label="GST HSN Code"
            type="number"
            placeholder="Enter GST HSN code (numeric only)"
            error={errors.gst_hsn_code?.message}
            {...register('gst_hsn_code', { 
              valueAsNumber: true,
              pattern: /^[0-9]*$/,
              validate: value => !isNaN(value) || 'GST HSN Code must be a number'
            })}
          />
        </div>
      ))}

      {/* Medicine Specific Fields */}
      {(hasPermission('medicine_type_id') || 
        hasPermission('expiry_date') || hasPermission('batch_number') || 
        hasPermission('manufacturer_name') || hasPermission('prescription_required') || 
        hasPermission('schedule_type') || hasPermission('salt_composition') || 
        hasPermission('warranty_months')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Medicine Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('medicine_type_id', (
              <>
                <input
                  type="hidden"
                  {...register('medicine_type_id')}
                />
                <Select
                  label="Medicine Type"
                  options={[
                    { value: '', label: 'Select medicine type' },
                    ...(medicineTypes?.map(type => ({
                      value: type.id,
                      label: type.name
                    })) || [])
                  ]}
                  value={watch('medicine_type_id') || ''}
                  onChange={(e) => {
                    setValue('medicine_type_id', e.target.value, { shouldValidate: true })
                  }}
                  error={errors.medicine_type_id?.message}
                />
              </>
            ))}

            {renderField('expiry-date', (
              <Input
                label="Expiry Date"
                type="date"
                error={errors.expiry_date?.message}
                {...register('expiry_date')}
              />
            ))}

            {renderField('batch-number', (
              <Input
                label="Batch Number"
                placeholder="Enter batch number"
                error={errors.batch_number?.message}
                {...register('batch_number')}
              />
            ))}

            {renderField('manufacturer-name', (
              <Input
                label="Manufacturer Name"
                placeholder="Enter manufacturer name"
                error={errors.manufacturer_name?.message}
                {...register('manufacturer_name')}
              />
            ))}

            {renderField('prescription-required', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('prescription_required')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prescription Required
                </label>
              </div>
            ))}

            {renderField('schedule-type', (
              <Input
                label="Schedule Type"
                placeholder="Enter schedule type"
                error={errors.schedule_type?.message}
                {...register('schedule_type')}
              />
            ))}

            {renderField('salt-composition', (
              <Input
                label="Salt Composition"
                placeholder="Enter salt composition"
                error={errors.salt_composition?.message}
                {...register('salt_composition')}
              />
            ))}

            {renderField('warranty-months', (
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
      {(hasPermission('perishable') || hasPermission('organic-certified') || 
        hasPermission('harvest-date') || hasPermission('storage-instructions')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Agricultural Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('perishable', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('perishable')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Perishable
                </label>
              </div>
            ))}

            {renderField('organic-certified', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('organic_certified')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organic Certified
                </label>
              </div>
            ))}

            {renderField('harvest-date', (
              <Input
                label="Harvest Date"
                type="date"
                placeholder="Enter harvest date"
                error={errors.harvest_date?.message}
                {...register('harvest_date')}
              />
            ))}

            {renderField('storage-instructions', (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Storage Instructions
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Variants</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add size, color, material, and gender variants</p>
            </div>
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
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Description */}
      {renderField('short_description', (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Description</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter short description"
              {...register('short_description')}
            />
          </div>
        </div>
      ))}

      {/* Additional Options */}
      {(hasPermission('is_featured') || hasPermission('is_returnable') || hasPermission('is_refundable')) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderField('is_featured', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('is_featured')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Product
                </label>
              </div>
            ))}

            {renderField('is_returnable', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('is_returnable')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Returnable
                </label>
              </div>
            ))}

            {renderField('is_refundable', (
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 mr-3 w-4 h-4"
                  {...register('is_refundable')}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Refundable
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplier Information */}
      {renderField('supplier_id', (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Supplier Information</h3>
          
          <Input
            label="Supplier ID"
            placeholder="Enter supplier ID"
            error={errors.supplier_id?.message}
            {...register('supplier_id')}
          />
        </div>
      ))}

      {/* Hidden updated_by field */}
      <input type="hidden" {...register('updated_by')} value={user?.id || ''} />

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
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit(onFormSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? (product ? 'Updating...' : 'Creating...') : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductForm