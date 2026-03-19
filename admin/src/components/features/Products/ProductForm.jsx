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

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  const { brands, fetchBrands } = useBrands()
  const { categories, fetchCategories } = useCategories()
  const { units, fetchUnits } = useUnits()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm()

  useEffect(() => {
    // Fetch dropdown data
    fetchBrands()
    fetchCategories()
    fetchUnits()
  }, [])

  useEffect(() => {
    if (product) {
      // Set form values for editing
      reset({
        name: product.name,
        sku: product.sku,
        brand_id: product.brand_id,
        category_id: product.category_id,
        unit_amount: product.unit_amount,
        unit_id: product.unit_id,
        selling_price: product.selling_price,
        purchase_price: product.purchase_price,
        gst_percentage: product.gst_percentage,
        discount_percentage: product.discount_percentage,
        description: product.description,
        is_active: product.is_active,
      })
    }
  }, [product, reset])

  const onFormSubmit = (data) => {
    const productData = {
      ...data,
      user_id: user.id, // Hidden field - current user ID
      created_by: user.id,
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
      {/* Hidden user_id field */}
      <input type="hidden" {...register('user_id')} value={user.id} />
      
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