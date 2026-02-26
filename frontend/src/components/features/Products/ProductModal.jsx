import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useProductStore } from '../../../store/productStore'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'

const ProductModal = ({ isOpen, onClose, product, mode = 'add' }) => {
  const { createProduct, updateProduct } = useProductStore()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: product || {
      name: '',
      sku: '',
      description: '',
      price: '',
      cost: '',
      stock: '',
      lowStockThreshold: '5',
      category: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (product) {
      reset(product)
    }
  }, [product, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (mode === 'add') {
        await createProduct(data)
      } else {
        await updateProduct(product.id, data)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Product' : 'Edit Product'}
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={loading}
          >
            {mode === 'add' ? 'Create Product' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register('name', { required: 'Product name is required' })}
          />

          <Input
            label="SKU"
            placeholder="Enter SKU"
            error={errors.sku?.message}
            {...register('sku', { required: 'SKU is required' })}
          />

          <div className="md:col-span-2">
            <Input
              label="Description"
              placeholder="Enter product description"
              error={errors.description?.message}
              {...register('description')}
            />
          </div>

          <Input
            label="Price"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
          />

          <Input
            label="Cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.cost?.message}
            {...register('cost', { 
              required: 'Cost is required',
              min: { value: 0, message: 'Cost must be positive' }
            })}
          />

          <Input
            label="Initial Stock"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be positive' }
            })}
          />

          <Input
            label="Low Stock Threshold"
            type="number"
            placeholder="5"
            error={errors.lowStockThreshold?.message}
            {...register('lowStockThreshold', { 
              required: 'Threshold is required',
              min: { value: 1, message: 'Threshold must be at least 1' }
            })}
          />

          <Select
            label="Category"
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
              { value: 'food', label: 'Food' },
              { value: 'other', label: 'Other' },
            ]}
            error={errors.category?.message}
            {...register('category', { required: 'Category is required' })}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Active Product
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Upload an image
              </label>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ProductModal