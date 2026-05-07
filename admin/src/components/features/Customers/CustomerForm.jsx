// src/components/features/Customers/CustomerForm.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiX } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import { useAuthStore } from '../../../store/authStore'

const CustomerForm = ({ initialData, mode, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  
  // Get current user ID
  const getUserId = () => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        return parsed.user?.id || parsed.userId || '1'
      } catch {
        return '1'
      }
    }
    return '1'
  }

  const currentUserId = getUserId()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    admin_id: currentUserId, // API requires admin_id (register user id)
    created_by: currentUserId,
    status: 'active',
    ...initialData
  })

  const [errors, setErrors] = useState({})

  // Auto-populate admin_id and created_by from auth context
  useEffect(() => {
    if (!initialData) {
      // For new customers, pre-populate with current user
      setFormData(prev => ({
        ...prev,
        admin_id: currentUserId,
        created_by: currentUserId,
      }))
    }
  }, [initialData, currentUserId])

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        status: initialData.status || 'active',
        admin_id: initialData.admin_id || currentUserId,
        created_by: initialData.created_by || currentUserId,
      })
    }
  }, [initialData, currentUserId])

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

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="col-span-2"
          />

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
                ₹{(initialData.totalSpent || 0).toFixed(2)}
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