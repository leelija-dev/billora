import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import toast from 'react-hot-toast'
import { FiX, FiPackage, FiMail, FiPhone, FiMapPin, FiSave, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import {
  validatePhone,
  validateEmail,
  validateGSTNumber,
  handlePhoneInput,
  handleGSTInput,
  handleAlphanumericInput,
  validationRules,
  validateFormData
} from '../../../utils/validators' // Adjust path as needed

const StoreForm = ({ 
  store = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isEdit = false 
}) => {
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    setError,
    clearErrors
  } = useForm()

  // Get current user ID from auth store
  const getUserId = () => {
    if (user && user.id) {
      return user.id.toString()
    }
    
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

  // Input handlers for real-time validation using utilities
  const handleMobileInput = (e) => {
    handlePhoneInput(e) // Use the utility function
    const value = e.target.value
    setValue('mobile', value, { shouldValidate: true })
    
    if (value.length === 10 || value.length === 0) {
      clearErrors('mobile')
    } else if (value.length > 0 && value.length !== 10) {
      setError('mobile', {
        type: 'manual',
        message: validationRules.mobile.message
      })
    }
  }

  const handleGSTInputWrapper = (e) => {
    handleGSTInput(e) // Use the utility function
    const value = e.target.value
    setValue('gst', value, { shouldValidate: true })
    
    if (value.length === 0 || validateGSTNumber(value)) {
      clearErrors('gst')
    } else if (value.length > 0 && !validateGSTNumber(value)) {
      setError('gst', {
        type: 'manual',
        message: validationRules.gstNumber.message
      })
    }
  }

  const handleEmailInput = (e) => {
    const value = e.target.value
    setValue('email', value, { shouldValidate: true })
    
    if (value && !validateEmail(value)) {
      setError('email', {
        type: 'manual',
        message: validationRules.email.message
      })
    } else {
      clearErrors('email')
    }
  }

  const handleCityInput = (e) => {
    handleAlphanumericInput(e) // Use utility to prevent invalid characters
    const value = e.target.value
    setValue('city', value, { shouldValidate: true })
    
    if (value && !validationRules.city.pattern.test(value)) {
      setError('city', {
        type: 'manual',
        message: validationRules.city.message
      })
    } else {
      clearErrors('city')
    }
  }

  const handleStateInput = (e) => {
    handleAlphanumericInput(e) // Use utility to prevent invalid characters
    const value = e.target.value
    setValue('state', value, { shouldValidate: true })
    
    if (value && !validationRules.state?.pattern?.test(value)) {
      setError('state', {
        type: 'manual',
        message: validationRules.state?.message || 'State name must contain only letters, spaces, and hyphens'
      })
    } else {
      clearErrors('state')
    }
  }

  const handlePincodeInput = (e) => {
    let value = e.target.value
    // Allow only numbers and limit to 6 digits
    value = value.replace(/\D/g, '').slice(0, 6)
    e.target.value = value
    setValue('pincode', value, { shouldValidate: true })
    
    if (value.length === 0) {
      clearErrors('pincode')
    } else if (value.length !== 6) {
      setError('pincode', {
        type: 'manual',
        message: 'Pincode must be exactly 6 digits'
      })
    } else {
      clearErrors('pincode')
    }
  }

  // Pre-fill form if editing
  useEffect(() => {
    if (store && isEdit) {
      reset({
        name: store.name || '',
        gst: store.gst || '',
        email: store.email || '',
        logo: store.logo || '',
        mobile: store.mobile || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        pincode: store.pincode || '',
        status: store.status === true || store.status === 'active' ? 'active' : 'inactive',
      })
    } else {
      reset({
        name: '',
        gst: '',
        email: '',
        logo: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        status: 'active',
        user_id: currentUserId,
        created_by: currentUserId,
      })
    }
  }, [store, isEdit, reset, currentUserId])

  const onFormSubmit = (data) => {
    // Prepare validation rules for the form
    const formValidationRules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Store name must be between 2 and 100 characters'
      },
      email: {
        required: true,
        pattern: validationRules.email.pattern,
        message: validationRules.email.message
      },
      mobile: {
        pattern: validationRules.mobile.pattern,
        minLength: 10,
        maxLength: 10,
        message: validationRules.mobile.message
      },
      address: {
        required: true,
        minLength: 5,
        message: 'Address must be at least 5 characters'
      },
      city: {
        required: true,
        pattern: validationRules.city.pattern,
        message: validationRules.city.message
      },
      state: {
        required: true,
        pattern: /^[A-Za-z\s\-]{2,50}$/,
        message: 'State name must contain only letters, spaces, and hyphens (2-50 characters)'
      },
      pincode: {
        required: true,
        pattern: /^\d{6}$/,
        message: 'Pincode must be exactly 6 digits'
      },
      gst: {
        pattern: validationRules.gstNumber.pattern,
        message: validationRules.gstNumber.message
      }
    }

    // Use the validateFormData utility
    const validationErrors = validateFormData(data, formValidationRules)
    
    // Check for errors
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message })
      })
      toast.error('Please fix the validation errors before submitting')
      return
    }
    
    const storeData = {
      ...data,
      user_id: currentUserId,
      created_by: currentUserId,
      status: data.status === 'active' ? true : false,
    }
    
    console.log('📝 StoreForm - Form data submitted:', data)
    console.log('📝 StoreForm - Final store data:', storeData)
    onSubmit(storeData)
  }

  const formFields = [
    {
      name: 'name',
      label: 'Store Name',
      type: 'text',
      placeholder: 'Enter store name',
      required: true,
      icon: FiPackage,
      gridCols: 'col-span-2',
      validation: {
        required: 'Store name is required',
        minLength: {
          value: 2,
          message: 'Store name must be at least 2 characters'
        },
        maxLength: {
          value: 100,
          message: 'Store name cannot exceed 100 characters'
        }
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      icon: FiMail,
      gridCols: 'col-span-1',
      onInput: handleEmailInput,
      validation: {
        required: 'Email is required',
        pattern: {
          value: validationRules.email.pattern,
          message: validationRules.email.message
        }
      }
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: 'Enter 10-digit mobile number',
      required: false,
      icon: FiPhone,
      gridCols: 'col-span-1',
      onInput: handleMobileInput,
      validation: {
        validate: (value) => {
          if (!value) return true
          return validatePhone(value) || validationRules.mobile.message
        }
      }
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter store address',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-2',
      validation: {
        required: 'Address is required',
        minLength: {
          value: 5,
          message: 'Address must be at least 5 characters'
        }
      }
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-1',
      onInput: handleCityInput,
      validation: {
        required: 'City is required',
        pattern: {
          value: validationRules.city.pattern,
          message: validationRules.city.message
        }
      }
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter state',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-1',
      onInput: handleStateInput,
      validation: {
        required: 'State is required',
        pattern: {
          value: /^[A-Za-z\s\-]{2,50}$/,
          message: 'State name must contain only letters, spaces, and hyphens (2-50 characters)'
        }
      }
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text',
      placeholder: 'Enter 6-digit pincode',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-1',
      onInput: handlePincodeInput,
      validation: {
        required: 'Pincode is required',
        pattern: {
          value: /^\d{6}$/,
          message: 'Pincode must be exactly 6 digits'
        }
      }
    },
    {
      name: 'gst',
      label: 'GST Number',
      type: 'text',
      placeholder: 'Enter GST number (e.g., 27ABCDE1234F2Z5)',
      required: false,
      icon: FiPackage,
      gridCols: 'col-span-1',
      onInput: handleGSTInputWrapper,
      validation: {
        validate: (value) => {
          if (!value) return true
          return validateGSTNumber(value) || validationRules.gstNumber.message
        }
      }
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Store' : 'Add New Store'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update store information' : 'Enter store details to register new shop'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Cancel"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formFields.map((field) => (
            <div key={field.name} className={field.gridCols}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                  {field.icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    onInput={field.onInput}
                    className={`w-full pl-10 pr-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                      errors[field.name] 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    {...register(field.name, field.validation)}
                  />
                </div>
                {errors[field.name] && (
                  <div className="flex items-center space-x-1 mt-1">
                    <FiAlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-500 text-sm">
                      {errors[field.name].message}
                    </p>
                  </div>
                )}
                {field.name === 'mobile' && !errors[field.name] && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {validationRules.mobile.message}
                  </p>
                )}
                {field.name === 'gst' && !errors[field.name] && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: 15 characters (e.g., 27ABCDE1234F2Z5)
                  </p>
                )}
                {field.name === 'city' && !errors[field.name] && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Only letters, spaces, and hyphens allowed
                  </p>
                )}
                {field.name === 'state' && !errors[field.name] && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Only letters, spaces, and hyphens allowed (2-50 characters)
                  </p>
                )}
                {field.name === 'pincode' && !errors[field.name] && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a valid 6-digit pincode
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Status Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.status 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              </div>
            )}
          </div>

          {/* Logo Upload */}
          <div className="space-y-2 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Store Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('logo')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: Square image, max 2MB (JPG, PNG, GIF)
            </p>
            {errors.logo && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden fields for user_id and created_by */}
        <input type="hidden" {...register('user_id')} value={currentUserId} />
        <input type="hidden" {...register('created_by')} value={currentUserId} />

        {/* Form validation summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Please fix the following errors:
                </h4>
                <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={FiSave}
            className="min-w-[120px]"
          >
            {isEdit ? 'Update Store' : 'Register Store'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default StoreForm