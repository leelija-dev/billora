// components/features/Products/ProductForm.js
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'

const ProductForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    maxStock: initialData?.maxStock || '',
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    isActive: initialData?.isActive ?? true,
    description: initialData?.description || '',
    image: initialData?.image || '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter product name"
        />
        
        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          placeholder="Enter SKU"
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          options={[
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
            { value: 'home', label: 'Home & Garden' },
            { value: 'sports', label: 'Sports' },
            { value: 'toys', label: 'Toys' },
          ]}
        />

        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="0.00"
        />

        <Input
          label="Current Stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          required
          placeholder="0"
        />

        <Input
          label="Maximum Stock"
          name="maxStock"
          type="number"
          min="0"
          value={formData.maxStock}
          onChange={handleChange}
          required
          placeholder="100"
        />

        <Input
          label="Low Stock Threshold"
          name="lowStockThreshold"
          type="number"
          min="1"
          value={formData.lowStockThreshold}
          onChange={handleChange}
          required
          placeholder="5"
        />

        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter product description"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Active (product is available for sale)
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm