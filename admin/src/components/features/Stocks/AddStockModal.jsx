import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import toast from 'react-hot-toast'

const AddStockModal = ({ isOpen, onClose, stock, onAddStock, isSubmitting }) => {
  const [addQuantity, setAddQuantity] = useState(0)
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: '',
    },
  })

  const watchQuantity = watch('quantity')

  useEffect(() => {
    if (watchQuantity) {
      setAddQuantity(parseInt(watchQuantity) || 0)
    } else {
      setAddQuantity(0)
    }
  }, [watchQuantity])

  const onSubmit = async (data) => {
    try {
      const quantity = parseInt(data.quantity)
      if (quantity <= 0) {
        toast.error('Quantity must be greater than 0')
        return
      }
      
      await onAddStock(stock.id, quantity)
      reset()
      setAddQuantity(0)
      onClose()
    } catch (error) {
      console.error('Failed to add stock:', error)
    }
  }

  const handleClose = () => {
    reset()
    setAddQuantity(0)
    onClose()
  }

  const currentStock = parseInt(stock?.quantity) || 0
  const newStockValue = currentStock + addQuantity

  // Don't render if stock is not available
  if (!stock) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Stock Quantity"
      size="sm"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Add Stock
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Stock Information
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Product: <span className="font-medium">{stock?.product_name || 'Unknown Product'}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Stock: <span className="font-medium">{stock?.quantity || 0}</span>
            </p>
          </div>
        </div>

        <Input
          label="Quantity to Add"
          type="number"
          min="1"
          step="1"
          placeholder="Enter quantity to add"
          error={errors.quantity?.message}
          {...register('quantity', {
            required: 'Quantity is required',
            min: {
              value: 1,
              message: 'Quantity must be at least 1',
            },
            validate: value => {
              const num = parseInt(value)
              return num > 0 || 'Quantity must be greater than 0'
            }
          })}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Stock Summary
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Stock: <span className="font-medium">{currentStock}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stock Added: <span className="font-medium text-green-600">+{addQuantity}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New Stock: <span className="font-medium text-green-600">{newStockValue}</span>
            </p>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default AddStockModal
