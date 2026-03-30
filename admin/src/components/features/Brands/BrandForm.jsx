import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiX } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import { useAuthStore } from '../../../store/authStore'

const BrandForm = ({ initialData, mode, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuthStore()
  
  // Get current user ID from auth store
  const getUserId = () => {
    // First try to get user from auth store (most reliable)
    if (user && user.id) {
      return user.id.toString()
    }
    
    // Fallback to localStorage if auth store is not available
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        const userId = parsed.state?.user?.id || parsed.user?.id
        return userId ? userId.toString() : '1'
      } catch (error) {
        console.error('Error parsing auth storage:', error)
        return '1'
      }
    }
    
    // Last fallback - try old auth key
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        return parsed.user?.id || parsed.userId || '1'
      } catch {
        return '1'
      }
    }
    
    console.warn('No user found in auth store or localStorage, using fallback')
    return '1'
  }

  const currentUserId = getUserId()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: 1,
    user_id: currentUserId,
    created_by: currentUserId,
    ...initialData
  })

  const [errors, setErrors] = useState({})

  // Auto-populate user_id and created_by from auth context
  useEffect(() => {
    if (!initialData) {
      // For new brands, pre-populate with current user
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId,
        created_by: currentUserId,
        is_active: 1 // Set to active by default
      }))
    }
  }, [initialData, currentUserId])

  useEffect(() => {
    if (initialData) {
      // Convert is_active to number (0 or 1) for consistent handling
      const isActive = (initialData.is_active === 1 || initialData.is_active === true) ? 1 : 0
      
      const formData = {
        name: initialData.name || '',
        description: initialData.description || '',
        is_active: isActive,
        user_id: initialData.user_id || currentUserId,
        created_by: initialData.created_by || currentUserId,
      }
      console.log('Setting form data for edit:', formData)
      setFormData(formData)
    }
  }, [initialData, currentUserId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Special handling for different input types
    if (name === 'is_active') {
      // For Select component - convert string "true"/"false" to number 1/0
      setFormData(prev => ({
        ...prev,
        is_active: value === 'true' ? 1 : 0
      }))
    } else if (type === 'checkbox') {
      // For checkbox inputs
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }))
    } else {
      // For text inputs, textarea, etc.
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.user_id || formData.user_id === '') {
      newErrors.user_id = 'User ID is required'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Submit the form data (is_active is already a number)
    onSubmit(formData)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === 'add' ? 'Add New Brand' : 'Edit Brand'}
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
            {mode === 'add' ? 'Create Brand' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand Information
          </h3>
          
          <Input
            label="Brand Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="e.g., Tata, Samsung, Apple"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status & Settings
          </h3>

          <Select
            label="Status"
            name="is_active"
            value={(() => {
              // Convert number (1 or 0) to string ("true" or "false") for Select component
              const stringValue = formData.is_active === 1 ? "true" : "false"
              return stringValue
            })()}
            onChange={handleChange}
            error={errors.is_active}
            required
            disabled={isSubmitting}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description for this brand"
          error={errors.description}
          disabled={isSubmitting}
          textarea
          rows={3}
        />
      </div>

      {/* Hidden fields for user_id and created_by */}
      <input type="hidden" name="user_id" value={formData.user_id} />
      <input type="hidden" name="created_by" value={formData.created_by} />

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Brand' : 'Create Brand')}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

export default BrandForm
