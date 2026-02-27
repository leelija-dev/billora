import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from 'react-icons/fi'

const CustomerModal = ({ isOpen, onClose, customer, mode = 'add', onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: customer || {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      notes: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (customer) {
      reset(customer)
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        taxId: '',
        notes: '',
        status: 'active',
      })
    }
  }, [customer, reset, isOpen])

  const handleFormSubmit = async (data) => {
    await onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
          >
            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <Input
            label="Full Name"
            placeholder="Enter full name"
            icon={FiUser}
            error={errors.name?.message}
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            icon={FiMail}
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            icon={FiPhone}
            error={errors.phone?.message}
            {...register('phone', {
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                message: 'Invalid phone number',
              },
            })}
          />

          <Input
            label="Company"
            placeholder="Enter company name"
            icon={FiBriefcase}
            {...register('company')}
          />

          {/* Address Information */}
          <div className="md:col-span-2">
            <Input
              label="Address"
              placeholder="Enter street address"
              icon={FiMapPin}
              {...register('address')}
            />
          </div>

          <Input
            label="City"
            placeholder="Enter city"
            {...register('city')}
          />

          <Input
            label="State/Province"
            placeholder="Enter state"
            {...register('state')}
          />

          <Input
            label="ZIP/Postal Code"
            placeholder="Enter ZIP code"
            {...register('zipCode')}
          />

          <Input
            label="Country"
            placeholder="Enter country"
            {...register('country')}
          />

          {/* Additional Information */}
          <Input
            label="Tax ID / VAT Number"
            placeholder="Enter tax ID"
            {...register('taxId')}
          />

          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'blocked', label: 'Blocked' },
            ]}
            {...register('status')}
          />

          <div className="md:col-span-2">
            <Input
              label="Notes"
              placeholder="Enter any additional notes..."
              {...register('notes')}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default CustomerModal