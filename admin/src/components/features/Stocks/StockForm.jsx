// components/features/Stocks/StockForm.js
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import SearchSelect from '../../common/SearchSelect/SearchSelect'
import toast from 'react-hot-toast'

const StockForm = ({ stock, onSubmit, onCancel, isSubmitting, products, units }) => {
  const { user } = useAuthStore()
  const [selectedProduct, setSelectedProduct] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm()

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products?.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setValue('product_id', productId)
      
      // Pre-fill other fields except quantity
      setValue('selling_price', product.selling_price || product.price || '')
      setValue('purchase_price', product.purchase_price || product.cost || '')
      setValue('unit_id', product.unit_id || '')
    }
  }

  useEffect(() => {
    if (stock) {
      console.log('📝 StockForm - Stock prop received:', stock)
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
        product_package_id: stock.product_package_id,
      })
    }
  }, [stock, reset])

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
          options={products?.map(product => ({
            value: product.id,
            label: product.name || product.product_name,
            description: `📦 SKU: ${product.sku || product.code || product.product_code || 'N/A'}`,
            subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null
          })) || []}
          value={selectedProduct?.id || ''}
          onChange={handleProductSelect}
          placeholder="Search product by name, SKU, brand..."
          required
        />

        <Input
          label="Quantity"
          type="number"
          min="1"
          step="1"
          placeholder="Enter quantity"
          error={errors.quantity?.message}
          {...register('quantity', { 
            required: 'Quantity is required',
            valueAsNumber: true 
          })}
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
          {...register('unit_id', { 
            required: 'Unit is required',
            valueAsNumber: true 
          })}
          onChange={(e) => {
            setValue('unit_id', e.target.value)
          }}
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
