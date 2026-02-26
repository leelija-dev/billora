import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { useProductStore } from '../../../store/productStore'
import { useInventoryStore } from '../../../store/inventoryStore'

const StockModal = ({ isOpen, onClose, type = 'IN' }) => {
  const { products, fetchProducts } = useProductStore()
  const { addStock, removeStock } = useInventoryStore()
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: '',
      quantity: '',
      notes: '',
    },
  })

  const watchProductId = watch('productId')
  const watchQuantity = watch('quantity')

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen, fetchProducts])

  useEffect(() => {
    if (watchProductId) {
      const product = products.find(p => p.id === parseInt(watchProductId))
      setSelectedProduct(product)
    } else {
      setSelectedProduct(null)
    }
  }, [watchProductId, products])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        productId: parseInt(data.productId),
        quantity: parseInt(data.quantity),
        notes: data.notes,
      }

      if (type === 'IN') {
        await addStock(payload)
      } else {
        await removeStock(payload)
      }
      
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to update stock:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNewStockValue = () => {
    if (!selectedProduct || !watchQuantity) return selectedProduct?.stock || 0
    const quantity = parseInt(watchQuantity) || 0
    return type === 'IN' 
      ? selectedProduct.stock + quantity
      : selectedProduct.stock - quantity
  }

  const isValidQuantity = () => {
    if (type === 'OUT' && selectedProduct) {
      return parseInt(watchQuantity) <= selectedProduct.stock
    }
    return true
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      title={type === 'IN' ? 'Add Stock' : 'Remove Stock'}
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            variant={type === 'IN' ? 'primary' : 'danger'}
            onClick={handleSubmit(onSubmit)}
            isLoading={loading}
            disabled={!isValidQuantity()}
          >
            {type === 'IN' ? 'Add Stock' : 'Remove Stock'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Select Product"
          options={[
            { value: '', label: 'Choose a product...' },
            ...products.map(p => ({
              value: p.id.toString(),
              label: `${p.name} (SKU: ${p.sku}) - Stock: ${p.stock}`,
            })),
          ]}
          error={errors.productId?.message}
          {...register('productId', {
            required: 'Please select a product',
          })}
        />

        <Input
          label={`Quantity to ${type === 'IN' ? 'Add' : 'Remove'}`}
          type="number"
          min="1"
          max={type === 'OUT' ? selectedProduct?.stock : undefined}
          placeholder="Enter quantity"
          error={errors.quantity?.message}
          {...register('quantity', {
            required: 'Quantity is required',
            min: {
              value: 1,
              message: 'Quantity must be at least 1',
            },
            validate: value => 
              type === 'OUT' && selectedProduct
                ? parseInt(value) <= selectedProduct.stock || 'Insufficient stock'
                : true,
          })}
        />

        <Input
          label="Notes (Optional)"
          placeholder="Add any notes about this stock movement"
          {...register('notes')}
        />

        {selectedProduct && watchQuantity && (
          <div className={`
            p-4 rounded-lg
            ${type === 'IN' 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : 'bg-yellow-50 dark:bg-yellow-900/20'
            }
          `}>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Stock Summary
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Stock: <span className="font-medium">{selectedProduct.stock}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {type === 'IN' ? 'Stock Added' : 'Stock Removed'}: <span className="font-medium text-green-600">+{watchQuantity || 0}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New Stock: <span className={`font-medium ${
                  type === 'IN' ? 'text-green-600' : 
                  getNewStockValue() < selectedProduct.lowStockThreshold ? 'text-red-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {getNewStockValue()}
                </span>
              </p>
              {type === 'OUT' && getNewStockValue() < selectedProduct.lowStockThreshold && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Warning: Stock will be below low stock threshold after removal
                </p>
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default StockModal