import React, { useState, useEffect } from 'react'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'

const PackageForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
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
    package_name: '',
    package_price: '',
    package_size: '',
    user_id: '',
  })

  const [errors, setErrors] = useState({})

  // Auto-populate user_id from auth context
  useEffect(() => {
    if (!initialData) {
      // For new packages, pre-populate with current user
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId,
      }))
    }
  }, [initialData, currentUserId])

  useEffect(() => {
    if (initialData) {
      setFormData({
        package_name: initialData.package_name || '',
        package_price: initialData.package_price || '',
        package_size: initialData.package_size || '',
        user_id: initialData.user_id || currentUserId,
      })
    }
  }, [initialData, currentUserId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
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
    
    if (!formData.package_name.trim()) {
      newErrors.package_name = 'Package name is required'
    }
    
    if (!formData.package_price.trim()) {
      newErrors.package_price = 'Package price is required'
    } else if (isNaN(formData.package_price) || parseFloat(formData.package_price) < 0) {
      newErrors.package_price = 'Package price must be a valid positive number'
    }
    
    // user_id might be a number, so check differently
    if (!formData.user_id || formData.user_id === '') {
      newErrors.user_id = 'User ID is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Convert package_price to number for API
    const submitData = {
      ...formData,
      package_price: parseFloat(formData.package_price),
    }
    
    onSubmit(submitData)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Package Name"
          name="package_name"
          value={formData.package_name}
          onChange={handleChange}
          placeholder="e.g., Small Box, Large Package"
          error={errors.package_name}
          required
          disabled={isSubmitting}
        />
        
        <Input
          label="Package Price"
          name="package_price"
          value={formData.package_price}
          onChange={handleChange}
          placeholder="e.g., 10.99"
          type="number"
          step="0.01"
          min="0"
          error={errors.package_price}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Input
          label="Package Size (Optional)"
          name="package_size"
          value={formData.package_size}
          onChange={handleChange}
          placeholder="e.g., 10x15x5 cm, Small, Medium, Large"
          error={errors.package_size}
          disabled={isSubmitting}
        />
      </div>

      {/* Hidden field for user_id */}
      <input type="hidden" name="user_id" value={formData.user_id} />

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
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Package' : 'Create Package')}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

export default PackageForm
