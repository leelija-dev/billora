// components/features/Products/ProductForm.js
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useBrands, useCategories, useUnits } from '../../../hooks/useAPI'
import { useAuthStore } from '../../../store/authStore'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import { BsQrCode } from "react-icons/bs";

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  const { brands, fetchBrands } = useBrands()
  const { categories, fetchCategories } = useCategories()
  const { units, fetchUnits } = useUnits()

  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const [qrCodePreview, setQrCodePreview] = useState(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

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
      image: '',
      qr_code: '',
    }
  })

  useEffect(() => {
    // Fetch dropdown data
    fetchBrands()
    fetchCategories()
    fetchUnits()
  }, [])

  useEffect(() => {
    if (product) {
      console.log(' ProductForm - Product prop changed:', product)
      console.log(' ProductForm - Brands:', brands)
      console.log(' ProductForm - Categories:', categories)
      console.log(' ProductForm - Units:', units)
      
      // Wait for dropdown data to be loaded before setting values
      if (brands && brands.length > 0 && categories && categories.length > 0 && units && units.length > 0) {
        console.log(' ProductForm - Setting form values...')
        
        // Set form values for editing using setValue instead of reset
        setValue('name', product.name || '')
        setValue('sku', product.sku || '')
        setValue('brand_id', product.brand_id || '')
        setValue('category_id', product.category_id || '')
        setValue('unit_amount', product.unit_amount || '')
        setValue('unit_id', product.unit_id || '')
        setValue('selling_price', product.selling_price || '')
        setValue('purchase_price', product.purchase_price || '')
        setValue('gst_percentage', product.gst_percentage || '')
        setValue('discount_percentage', product.discount_percentage || '')
        setValue('description', product.description || '')
        setValue('is_active', product.is_active !== undefined ? product.is_active : true)
        
        console.log(' ProductForm - Form values set successfully')
      } else {
        console.log(' ProductForm - Waiting for dropdown data...')
        // Set text fields immediately, but wait for dropdowns
        setValue('name', product.name || '')
        setValue('sku', product.sku || '')
        setValue('unit_amount', product.unit_amount || '')
        setValue('selling_price', product.selling_price || '')
        setValue('purchase_price', product.purchase_price || '')
        setValue('gst_percentage', product.gst_percentage || '')
        setValue('discount_percentage', product.discount_percentage || '')
        setValue('description', product.description || '')
        setValue('is_active', product.is_active !== undefined ? product.is_active : true)
      }
    }
  }, [product, setValue, brands, categories, units])

  // Generate unique QR code for product
  const generateUniqueQRCode = async () => {
    setIsGeneratingQR(true)
    try {
      // Generate unique QR code based on timestamp, user ID, and random string
      const timestamp = Date.now()
      const userId = user?.id || 'anonymous'
      const randomString = Math.random().toString(36).substring(2, 15)
      const uniqueId = `PROD_${userId}_${timestamp}_${randomString}`
      
      // Generate QR code using a free QR code API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uniqueId)}&format=png`
      
      // Convert QR code URL to blob and create file
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const qrFile = new File([blob], `qr_${uniqueId}.png`, { type: 'image/png' })
      
      // Set QR code data
      setQrCode(uniqueId)
      setQrCodePreview(qrCodeUrl)
      setValue('qr_code', uniqueId)
      
      // Store QR file for upload (similar to image)
      setSelectedImage(prev => prev ? prev : null) // Keep existing image
      
      toast.success('QR code generated successfully!')
    } catch (error) {
      console.error('Failed to generate QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsGeneratingQR(false)
    }
  }

  // Auto-generate QR code when product name and SKU are entered
  useEffect(() => {
    const name = watch('name')
    const sku = watch('sku')
    
    // Only generate QR code for new products (not editing) and when name and SKU are filled
    if (!product && name && sku && !qrCode) {
      generateUniqueQRCode()
    }
  }, [watch('name'), watch('sku'), product, qrCode])

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setValue('image', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setValue('image', '')
  }

  const onFormSubmit = (data) => {
    const productData = {
      ...data,
      user_id: user.id, // Hidden field - current user ID
      created_by: user.id,
      image: selectedImage, // Include the image file
      // Convert is_active boolean to integer (1 or 0) for backend compatibility
      is_active: data.is_active ? 1 : 0,
    }
    onSubmit(productData)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <div className="text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload product image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product QR Code
          </label>
          <div className="space-y-3">
            {/* QR Code Preview and Controls */}
            <div className="flex items-center space-x-3">
              {qrCodePreview ? (
                <div className="relative">
                  <img 
                    src={qrCodePreview} 
                    alt="Product QR Code" 
                    className="w-20 h-20 border-2 border-gray-200 rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <BsQrCode className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <BsQrCode className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <Input
                  placeholder="QR code will be auto-generated"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  {...register('qr_code')}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique QR code for product identification
                </p>
              </div>
            </div>
            
            {/* Regenerate Button */}
            <Button
              type="button"
              variant="outline"
              onClick={generateUniqueQRCode}
              isLoading={isGeneratingQR}
              icon={BsQrCode}
              className="w-full"
            >
              {qrCode ? 'Regenerate QR Code' : 'Generate QR Code'}
            </Button>
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
            ...(brands?.map(brand => ({
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
            ...(categories?.map(category => ({
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
            ...(units?.map(unit => ({
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