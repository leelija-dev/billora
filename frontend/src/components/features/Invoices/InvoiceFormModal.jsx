import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'

const InvoiceFormModal = ({ isOpen, onClose, invoice, mode = 'add', onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: invoice || {
      customer: {
        name: '',
        email: '',
      },
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxRate: 10,
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    if (invoice && isOpen) {
      reset(invoice)
    }

    if (!invoice && isOpen) {
      reset({
        customer: {
          name: '',
          email: '',
        },
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        taxRate: 10,
        notes: '',
      })
    }
  }, [invoice, isOpen, reset])

  const handleFormSubmit = async (data) => {
    const cleanedItems = (data.items || []).map((it) => {
      const quantity = Number(it.quantity || 0)
      const unitPrice = Number(it.unitPrice || 0)
      return {
        ...it,
        quantity,
        unitPrice,
        total: Number((quantity * unitPrice).toFixed(2)),
      }
    })

    const subtotal = cleanedItems.reduce((sum, it) => sum + Number(it.total || 0), 0)
    const taxRate = Number(data.taxRate || 0)
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    const payload = {
      ...data,
      items: cleanedItems,
      subtotal: Number(subtotal.toFixed(2)),
      taxRate,
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: data.status || invoice?.status,
    }

    await onSubmit(payload)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Create Invoice' : 'Edit Invoice'}
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)}>
            {mode === 'add' ? 'Create' : 'Save'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Name"
            placeholder="Enter customer name"
            error={errors.customer?.name?.message}
            {...register('customer.name', { required: 'Customer name is required' })}
          />

          <Input
            label="Customer Email"
            type="email"
            placeholder="Enter customer email"
            error={errors.customer?.email?.message}
            {...register('customer.email', { required: 'Customer email is required' })}
          />

          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.01"
            placeholder="10"
            error={errors.taxRate?.message}
            {...register('taxRate', { min: { value: 0, message: 'Tax rate must be positive' } })}
          />

          <Input
            label="Notes"
            placeholder="Optional notes"
            {...register('notes')}
          />
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Items</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-6">
                  <Input
                    label={index === 0 ? 'Description' : undefined}
                    placeholder="Item description"
                    error={errors.items?.[index]?.description?.message}
                    {...register(`items.${index}.description`, { required: 'Description is required' })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label={index === 0 ? 'Qty' : undefined}
                    type="number"
                    placeholder="1"
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity`, { required: 'Qty is required', min: { value: 1, message: 'Min 1' } })}
                  />
                </div>

                <div className="md:col-span-3">
                  <Input
                    label={index === 0 ? 'Unit Price' : undefined}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.items?.[index]?.unitPrice?.message}
                    {...register(`items.${index}.unitPrice`, { required: 'Unit price is required', min: { value: 0, message: 'Min 0' } })}
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default InvoiceFormModal
