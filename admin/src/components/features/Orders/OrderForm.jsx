import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useOrderStore } from '../../../store/orderStore'
import { useProductStore } from '../../../store/productStore'
import { useCustomerStore } from '../../../store/customerStore'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

const OrderForm = ({ onClose }) => {
  const { createOrder } = useOrderStore()
  const { products } = useProductStore()
  const { customers } = useCustomerStore()
  const [loading, setLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer: '',
      items: [{ product: '', quantity: 1, price: 0 }],
      shippingAddress: '',
      paymentMethod: 'credit_card',
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchItems = watch('items')

  const calculateTotal = () => {
    return watchItems?.reduce((total, item) => {
      return total + (item.price * item.quantity || 0)
    }, 0) || 0
  }

  const handleProductSelect = (index, productId) => {
    const product = products.find(p => p.id === parseInt(productId))
    if (product) {
      setValue(`items.${index}.price`, product.price)
      setValue(`items.${index}.product`, product)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await createOrder({
        ...data,
        total: calculateTotal(),
        items: data.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
      })
      onClose()
    } catch (error) {
      console.error('Failed to create order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Customer
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700"
          {...register('customer', { required: 'Please select a customer' })}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>
        {errors.customer && (
          <p className="text-sm text-red-600">{errors.customer.message}</p>
        )}
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order Items
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ product: '', quantity: 1, price: 0 })}
            icon={FiPlus}
          >
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <div className="flex-1">
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700"
                onChange={(e) => handleProductSelect(index, e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="1"
                placeholder="Qty"
                {...register(`items.${index}.quantity`, {
                  required: 'Required',
                  min: 1,
                })}
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                {...register(`items.${index}.price`, {
                  required: 'Required',
                  min: 0,
                })}
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="flex justify-end">
        <div className="w-64 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-sm font-medium">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tax (10%):</span>
            <span className="text-sm font-medium">${(calculateTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-base font-semibold">Total:</span>
            <span className="text-base font-bold text-primary-600">
              ${(calculateTotal() * 1.1).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Shipping Address
        </label>
        <textarea
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700"
          placeholder="Enter shipping address"
          {...register('shippingAddress', { required: 'Shipping address is required' })}
        />
        {errors.shippingAddress && (
          <p className="text-sm text-red-600">{errors.shippingAddress.message}</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Payment Method
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700"
          {...register('paymentMethod')}
        >
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Order Notes
        </label>
        <textarea
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700"
          placeholder="Any special instructions..."
          {...register('notes')}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create Order
        </Button>
      </div>
    </form>
  )
}

export default OrderForm