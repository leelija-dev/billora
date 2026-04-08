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
        if (key !== 'images' && key !== 'variants') {
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

  // Form submission
  const onFormSubmit = (data) => {
    let processedAttributes = null;
    
    // Handle attributes field - convert to JSON if provided
    if (data.attributes && data.attributes.trim()) {
      try {
        // Try to parse as JSON
        processedAttributes = JSON.parse(data.attributes.trim());
      } catch (error) {
        // If not valid JSON, show error and stop submission
        toast.error('Attributes must be in valid JSON format');
        return;
      }
    }

    const productData = {
      ...data,
      user_id: user.id,
      created_by: user.id,
      images: selectedImages,
      variants: variants,
      // Set processed attributes (will be null if empty)
      attributes: processedAttributes,
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Images</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Product image ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-primary-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            <div className="text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Selling Price"
          type="number"
          step="0.01"
          placeholder="Enter selling price"
          error={errors.selling_price?.message}
          {...register('selling_price', { 
            valueAsNumber: true 
          })}
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
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="GST Percentage"
          type="number"
          step="0.01"
          placeholder="Enter GST percentage"
          error={errors.gst_percentage?.message}
          {...register('gst_percentage', { 
            valueAsNumber: true 
          })}
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
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Enter product description"
          {...register('description')}
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            {...register('is_active')}
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Active
          </span>
        </label>
      </div>

      {/* Dynamic Fields Based on Permissions */}
      
      {/* Product Attributes */}
      {hasPermission('attributes') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Attributes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('attributes', (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attributes (JSON Format)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder='Enter attributes in JSON format: {"color": "red", "size": "large"}'
                  {...register('attributes')}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Example: {"{\"color\": \"red\", \"size\": \"large\", \"material\": \"cotton\"}"}
                </p>
              </div>
            ))}
          </div>
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
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </motion.div>
  )
}

export default ProductForm