// src/components/features/Customers/CustomerForm.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiX, FiAlertCircle } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'
import { useAuthStore } from '../../../store/authStore'
import {
  validatePhone,
  validateEmail,
  validateGSTNumber,
  handlePhoneInput,
  handleAlphanumericInput,
  handleGSTInput,
  validationRules,
} from '../../../utils/validators'

const CustomerForm = ({ isEditForm, initialData, mode, onSubmit, onCancel, isSubmitting }) => {
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
    gst_number: '',
    user_id: currentUserId, // Use user_id to match backend expectation
    admin_id: currentUserId, // Keep for backward compatibility
    created_by: currentUserId,
    ...initialData
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Auto-populate user_id, admin_id and created_by from auth context
  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId,
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
        gst_number: initialData.gst_number || '',
       
        user_id: initialData.user_id || initialData.admin_id || currentUserId,
        admin_id: initialData.admin_id || currentUserId,
        created_by: initialData.created_by || currentUserId,
      })
    }
  }, [initialData, currentUserId])

  // Validation functions based on backend rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Customer name is required'
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters'
        }
        if (value.trim().length > 100) {
          return 'Name cannot exceed 100 characters'
        }
        if (!/^[a-zA-Z\s.-]+$/.test(value)) {
          return 'Name can only contain letters, spaces, dots, and hyphens'
        }
        return ''

      case 'phone':
        if (!value || value.trim() === '') {
          return 'Phone number is required'
        }
        if (!validatePhone(value)) {
          return validationRules.mobile.message
        }
        return ''

      case 'address':
        if (!value || value.trim() === '') {
          return 'Address is required'
        }
        if (value.length > 500) {
          return 'Address cannot exceed 500 characters'
        }
        return ''

      case 'email':
        if (value && !validateEmail(value)) {
          return validationRules.email.message
        }
        return ''

      case 'city':
        if (value && !/^[a-zA-Z\s-]+$/.test(value)) {
          return 'City can only contain letters, spaces, and hyphens'
        }
        return ''

      case 'gst_number':
        if (value && !validateGSTNumber(value)) {
          return validationRules.gstNumber.message
        }
        return ''

      default:
        return ''
    }
  }

  // Real-time input handlers
  const handlePhoneChange = (e) => {
    handlePhoneInput(e)
    const value = e.target.value
    setFormData(prev => ({ ...prev, phone: value }))
    
    const error = validateField('phone', value)
    if (error) {
      setErrors(prev => ({ ...prev, phone: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.phone
        return newErrors
      })
    }
  }

  const handleGSTChange = (e) => {
    handleGSTInput(e)
    const value = e.target.value
    setFormData(prev => ({ ...prev, gst_number: value }))
    
    const error = validateField('gst_number', value)
    if (error) {
      setErrors(prev => ({ ...prev, gst_number: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.gst_number
        return newErrors
      })
    }
  }

  const handleCityChange = (e) => {
    handleAlphanumericInput(e)
    const value = e.target.value
    setFormData(prev => ({ ...prev, city: value }))
    
    const error = validateField('city', value)
    if (error) {
      setErrors(prev => ({ ...prev, city: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.city
        return newErrors
      })
    }
  }

  const handleNameChange = (e) => {
    let value = e.target.value
    // Allow letters, spaces, dots, and hyphens only
    value = value.replace(/[^a-zA-Z\s.-]/g, '')
    e.target.value = value
    setFormData(prev => ({ ...prev, name: value }))
    
    const error = validateField('name', value)
    if (error) {
      setErrors(prev => ({ ...prev, name: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.name
        return newErrors
      })
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, email: value }))
    
    const error = validateField('email', value)
    if (error) {
      setErrors(prev => ({ ...prev, email: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
  }

  const handleAddressChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, address: value }))
    
    const error = validateField('address', value)
    if (error) {
      setErrors(prev => ({ ...prev, address: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.address
        return newErrors
      })
    }
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields based on backend rules
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError
    
    const phoneError = validateField('phone', formData.phone)
    if (phoneError) newErrors.phone = phoneError
    
    const addressError = validateField('address', formData.address)
    if (addressError) newErrors.address = addressError
    
    // Optional fields validation
    if (formData.email && formData.email.trim() !== '') {
      const emailError = validateField('email', formData.email)
      if (emailError) newErrors.email = emailError
    }
    
    if (formData.city && formData.city.trim() !== '') {
      const cityError = validateField('city', formData.city)
      if (cityError) newErrors.city = cityError
    }
    
    if (formData.gst_number && formData.gst_number.trim() !== '') {
      const gstError = validateField('gst_number', formData.gst_number)
      if (gstError) newErrors.gst_number = gstError
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allFields = ['name', 'phone', 'address', 'email', 'city', 'gst_number']
    const touchedObj = {}
    allFields.forEach(field => {
      touchedObj[field] = true
    })
    setTouched(touchedObj)
    
    if (validateForm()) {
      // Clean up data before submitting
      const cleanData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        email: formData.email?.trim() || null,
        city: formData.city?.trim() || null,
        gst_number: formData.gst_number?.trim() || null,
       
        user_id: formData.admin_id, // Backend expects user_id, not admin_id
        created_by: formData.created_by,
      }
      onSubmit(cleanData)
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
          {isEditForm ? 'Edit Customer' : 'Add New Customer'}
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
            {isEditForm ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Personal Information
          </h3>
          
          {/* Name - Required */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              placeholder="Enter customer's full name"
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.name && touched.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && touched.name && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.name}</p>
              </div>
            )}
            {!errors.name && touched.name && formData.name && (
              <p className="text-xs text-green-500 mt-1">✓ Valid name</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Letters, spaces, dots, and hyphens only (2-100 characters)
            </p>
          </div>

          {/* Phone - Required */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="Enter 10-digit mobile number"
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.phone && touched.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && touched.phone && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.phone}</p>
              </div>
            )}
            {!errors.phone && touched.phone && formData.phone && formData.phone.length === 10 && (
              <p className="text-xs text-green-500 mt-1">✓ Valid mobile number</p>
            )}
            {!errors.phone && formData.phone && formData.phone.length > 0 && formData.phone.length !== 10 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Exactly 10 digits required
              </p>
            )}
          </div>

          {/* Email - Nullable (Optional) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              placeholder="customer@example.com"
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && touched.email && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.email}</p>
              </div>
            )}
            {!errors.email && formData.email && validateEmail(formData.email) && (
              <p className="text-xs text-green-500 mt-1">✓ Valid email address</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address & Tax Information
          </h3>

          {/* Address - Required */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Street Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleAddressChange}
              onBlur={() => handleBlur('address')}
              placeholder="Street address"
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.address && touched.address
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.address && touched.address && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.address}</p>
              </div>
            )}
            {!errors.address && touched.address && formData.address && (
              <p className="text-xs text-green-500 mt-1">✓ Valid address</p>
            )}
            {formData.address && formData.address.length > 400 && (
              <p className="text-xs text-orange-500 mt-1">
                ⚠️ {formData.address.length}/500 characters
              </p>
            )}
          </div>

          {/* City - Nullable (Optional) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              onBlur={() => handleBlur('city')}
              placeholder="City"
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.city && touched.city
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.city && touched.city && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.city}</p>
              </div>
            )}
            {!errors.city && formData.city && (
              <p className="text-xs text-green-500 mt-1">✓ Valid city name</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only letters, spaces, and hyphens allowed
            </p>
          </div>

          {/* GST Number - Optional with validation */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GST Number <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleGSTChange}
              onBlur={() => handleBlur('gst_number')}
              placeholder="Enter GST number (e.g., 27ABCDE1234F2Z5)"
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.gst_number && touched.gst_number
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.gst_number && touched.gst_number && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.gst_number}</p>
              </div>
            )}
            {!errors.gst_number && formData.gst_number && validateGSTNumber(formData.gst_number) && (
              <p className="text-xs text-green-500 mt-1">✓ Valid GST number</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: 15 characters (e.g., 27ABCDE1234F2Z5)
            </p>
          </div>

          
        </div>
      </div>

      {/* Required Fields Indicator */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
        <span className="text-red-500">*</span>
        <span>Required fields</span>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                Please fix the following errors:
              </h4>
              <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>
                    {field === 'name' ? 'Name' : 
                     field === 'phone' ? 'Mobile Number' :
                     field === 'address' ? 'Address' :
                     field === 'gst_number' ? 'GST Number' :
                     field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
                {initialData.createdAt ? new Date(initialData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  )
}

export default CustomerForm