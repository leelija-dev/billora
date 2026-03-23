import React, { useState, useEffect } from 'react'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import { motion } from 'framer-motion'

const UnitForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    user_id: '', // This should come from auth context
    created_by: '', // This should come from auth context
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        user_id: initialData.user_id || '',
        created_by: initialData.created_by || '',
      })
    }
  }, [initialData])

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
    
    if (!formData.code.trim()) {
      newErrors.code = 'Unit code is required'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Unit name is required'
    }
    
    if (!formData.user_id.trim()) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Unit Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g., kg, pcs, ltr"
          error={errors.code}
          required
          disabled={isSubmitting}
        />
        
        <Input
          label="Unit Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Kilogram, Pieces, Liter"
          error={errors.name}
          required
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="User ID"
        name="user_id"
        value={formData.user_id}
        onChange={handleChange}
        placeholder="Enter user ID"
        error={errors.user_id}
        required
        disabled={isSubmitting}
        type="number"
      />

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
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Unit' : 'Create Unit')}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

export default UnitForm
