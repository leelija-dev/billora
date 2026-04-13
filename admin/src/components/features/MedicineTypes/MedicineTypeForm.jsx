import React, { useState, useEffect } from 'react'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import useMedicineTypeStore from '../../../store/medicineTypeStore'

const MedicineTypeForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
  const { user } = useAuthStore()
  const { error, clearError } = useMedicineTypeStore()
  
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
    user_id: currentUserId,
  })

  const [errors, setErrors] = useState({})

  // Auto-populate user_id from auth context
  useEffect(() => {
    if (!initialData) {
      // For new medicine types, pre-populate with current user
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId,
      }))
    }
  }, [initialData, currentUserId])

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        user_id: initialData.user_id || currentUserId,
      })
    }
  }, [initialData, currentUserId])

  // Clear errors when component unmounts or when initialData changes
  useEffect(() => {
    clearError()
  }, [clearError, initialData])

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
    
    // Clear store error when user starts typing
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medicine type name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Medicine type name must be at least 2 characters'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Medicine type name must not exceed 100 characters'
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
    
    // Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      user_id: formData.user_id,
    }
    
    console.log('Submitting medicine type data:', submitData)
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
      {/* Store Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Input
          label="Medicine Type Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Tablet, Capsule, Syrup, Injection"
          error={errors.name}
          required
          disabled={isSubmitting}
          maxLength={100}
          helperText="Enter the name of the medicine type (e.g., Tablet, Capsule, Syrup)"
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
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Medicine Type' : 'Create Medicine Type')}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

export default MedicineTypeForm
