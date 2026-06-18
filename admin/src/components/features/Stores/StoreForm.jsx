import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import toast from 'react-hot-toast'
import { 
  FiX, FiPackage, FiMail, FiPhone, FiMapPin, FiSave, 
  FiArrowLeft, FiAlertCircle, FiImage
} from 'react-icons/fi'
import {
  validatePhone,
  validateEmail,
  validateGSTNumber,
  handlePhoneInput,
  handleGSTInput,
  handleAlphanumericInput,
  validationRules,
  validateFormData
} from '../../../utils/validators'
import { FaQrcode } from 'react-icons/fa'

const StoreForm = ({ 
  store = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isEdit = false 
}) => {
  const { user } = useAuthStore()
  const [logoPreview, setLogoPreview] = useState(null)
  const [bankQrPreview, setBankQrPreview] = useState(null)
  const [selectedLogoFile, setSelectedLogoFile] = useState(null)
  const [selectedBankQrFile, setSelectedBankQrFile] = useState(null)
  // Track which images have been deleted
  const [deletedLogo, setDeletedLogo] = useState(null)
  const [deletedBankQr, setDeletedBankQr] = useState(null)

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
    handlePhoneInput(e)
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
    handleGSTInput(e)
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
    handleAlphanumericInput(e)
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
    handleAlphanumericInput(e)
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

  // Handle file upload with validation
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`${type === 'logo' ? 'Logo' : 'Bank QR'} file size must be less than 2MB`)
      e.target.value = ''
      return
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(`${type === 'logo' ? 'Logo' : 'Bank QR'} must be a valid image (JPG, PNG, GIF, WebP)`)
      e.target.value = ''
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoPreview(reader.result)
        setSelectedLogoFile(file)
        setValue('logo', file)
        // Clear deleted logo if a new file is selected
        setDeletedLogo(null)
      } else {
        setBankQrPreview(reader.result)
        setSelectedBankQrFile(file)
        setValue('bank_qr', file)
        // Clear deleted bank QR if a new file is selected
        setDeletedBankQr(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = (type) => {
    if (type === 'logo') {
      // Store the current logo URL to be sent as deleted_logo
      const currentLogoUrl = store?.logo_url || store?.logo || null
      if (currentLogoUrl) {
        setDeletedLogo(currentLogoUrl)
        console.log('🗑️ Logo marked for deletion:', currentLogoUrl)
      }
      
      setLogoPreview(null)
      setSelectedLogoFile(null)
      setValue('logo', null)
      // Reset file input
      const fileInput = document.querySelector('input[name="logo"]')
      if (fileInput) fileInput.value = ''
    } else {
      // Store the current bank QR URL to be sent as deleted_bank_qr
      const currentBankQrUrl = store?.bank_qr_url || store?.bank_qr || null
      if (currentBankQrUrl) {
        setDeletedBankQr(currentBankQrUrl)
        console.log('🗑️ Bank QR marked for deletion:', currentBankQrUrl)
      }
      
      setBankQrPreview(null)
      setSelectedBankQrFile(null)
      setValue('bank_qr', null)
      const fileInput = document.querySelector('input[name="bank_qr"]')
      if (fileInput) fileInput.value = ''
    }
  }

  // Pre-fill form if editing
  useEffect(() => {
    if (store && isEdit) {
      console.log('📝 StoreForm - Editing store:', store);
      
      reset({
        name: store.name || '',
        gst: store.gst || '',
        email: store.email || '',
        logo: store.logo || '',
        bank_qr: store.bank_qr || '',
        mobile: store.mobile || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        pincode: store.pincode || '',
        status: store.status === true || store.status === 'active' ? 'active' : 'inactive',
      })
      
      // Set logo preview if exists - check both logo_url and logo
      const logoUrl = store.logo_url || store.logo || null;
      if (logoUrl) {
        console.log('📸 Setting logo preview:', logoUrl);
        setLogoPreview(logoUrl);
      }
      
      // Set bank QR preview if exists - check both bank_qr_url and bank_qr
      const bankQrUrl = store.bank_qr_url || store.bank_qr || null;
      if (bankQrUrl) {
        console.log('📸 Setting bank QR preview:', bankQrUrl);
        setBankQrPreview(bankQrUrl);
      }
      
      // Reset deletion tracking
      setDeletedLogo(null)
      setDeletedBankQr(null)
    } else {
      reset({
        name: '',
        gst: '',
        email: '',
        logo: '',
        bank_qr: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        status: 'active',
        user_id: currentUserId,
        created_by: currentUserId,
      })
      setLogoPreview(null)
      setBankQrPreview(null)
      setSelectedLogoFile(null)
      setSelectedBankQrFile(null)
      setDeletedLogo(null)
      setDeletedBankQr(null)
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
    
    // Create FormData for file upload
    const formData = new FormData()
    
    // Append all fields
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('mobile', data.mobile || '')
    formData.append('address', data.address)
    formData.append('city', data.city)
    formData.append('state', data.state)
    formData.append('pincode', data.pincode)
    formData.append('gst', data.gst || '')
    formData.append('user_id', currentUserId)
    formData.append('created_by', currentUserId)
    formData.append('status', data.status === 'active' ? '1' : '0')
    
    // Handle logo
    if (selectedLogoFile) {
      // If a new logo file is selected, append it
      formData.append('logo', selectedLogoFile)
      console.log('📎 Logo file appended:', selectedLogoFile.name, selectedLogoFile.size, 'bytes')
    } else if (isEdit && store?.logo) {
      // If editing and no new file selected, keep existing logo
      formData.append('logo', store.logo)
    }
    
    // Handle bank_qr
    if (selectedBankQrFile) {
      // If a new bank QR file is selected, append it
      formData.append('bank_qr', selectedBankQrFile)
      console.log('📎 Bank QR file appended:', selectedBankQrFile.name, selectedBankQrFile.size, 'bytes')
    } else if (isEdit && store?.bank_qr) {
      // If editing and no new file selected, keep existing bank QR
      formData.append('bank_qr', store.bank_qr)
    }
    
    // Handle deleted logo
    if (deletedLogo) {
      formData.append('deleted_logo', deletedLogo)
      console.log('🗑️ Deleted logo appended:', deletedLogo)
    }
    
    // Handle deleted bank QR
    if (deletedBankQr) {
      formData.append('deleted_bank_qr', deletedBankQr)
      console.log('🗑️ Deleted bank QR appended:', deletedBankQr)
    }
    
    console.log('📝 StoreForm - Form data submitted:', data)
    console.log('📝 StoreForm - FormData entries:')
    for (let pair of formData.entries()) {
      if (pair[0] === 'logo' && pair[1] instanceof File) {
        console.log(`   ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`)
      } else if (pair[0] === 'bank_qr' && pair[1] instanceof File) {
        console.log(`   ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`)
      } else {
        console.log(`   ${pair[0]}: ${pair[1]}`)
      }
    }
    
    // Pass FormData to onSubmit
    onSubmit(formData)
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
              <FiImage className="inline mr-2" />
              Store Logo
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: Square image, max 2MB (JPG, PNG, GIF, WebP)
            </p>
            
            {/* Logo Preview */}
            {logoPreview && (
              <div className="mt-2 flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedLogoFile ? selectedLogoFile.name : 'Current logo'}
                  </p>
                  {selectedLogoFile && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedLogoFile.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('logo')}
                    className="mt-1 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                  >
                    <FiX className="mr-1" /> Remove Logo
                  </button>
                </div>
              </div>
            )}
            
            {errors.logo && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
              </div>
            )}
          </div>

          {/* Bank QR Upload */}
          <div className="space-y-2 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaQrcode className="inline mr-2" />
              Bank QR Code
            </label>
            <input
              type="file"
              name="bank_qr"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'bank_qr')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload bank QR code image, max 2MB (JPG, PNG, GIF, WebP)
            </p>
            
            {/* Bank QR Preview */}
            {bankQrPreview && (
              <div className="mt-2 flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <img 
                  src={bankQrPreview} 
                  alt="Bank QR preview" 
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedBankQrFile ? selectedBankQrFile.name : 'Current bank QR'}
                  </p>
                  {selectedBankQrFile && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedBankQrFile.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('bank_qr')}
                    className="mt-1 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                  >
                    <FiX className="mr-1" /> Remove Bank QR
                  </button>
                </div>
              </div>
            )}
            
            {errors.bank_qr && (
              <div className="flex items-center space-x-1 mt-1">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.bank_qr.message}</p>
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