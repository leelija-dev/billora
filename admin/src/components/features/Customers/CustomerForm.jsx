// src/components/features/Customers/CustomerForm.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiX } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'

const CustomerForm = ({ initialData, mode, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    status: 'active',
    notes: '',
    ...initialData
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
        status: initialData.status || 'active',
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (formData.phone && !/^[\d\s-()+]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={FiX}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FiSave}
            loading={isSubmitting}
          >
            {mode === 'add' ? 'Create Customer' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Personal Information
          </h3>
          
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Enter customer's full name"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="customer@example.com"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name (optional)"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address & Status
          </h3>

          <Input
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'blocked', label: 'Blocked' },
            ]}
          />

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Additional notes about the customer..."
            />
          </div>
        </div>
      </div>

      {mode === 'edit' && initialData && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customer ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{initialData.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{initialData.totalOrders || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${(initialData.totalSpent || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customer Since</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(initialData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  )
}

export default CustomerForm