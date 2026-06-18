import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiMapPin, FiPhone, FiMail, FiGlobe, FiChevronDown, FiChevronUp, FiUpload, FiAlertCircle, FiCheckCircle, FiImage } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { storeAPI } from '../../../services/storeService'
import toast from 'react-hot-toast'
import { LucideStore } from 'lucide-react'
import { FaQrcode } from 'react-icons/fa'
import {
  handlePhoneInput,
  handleMaxLength,
  validationRules,
  validatePhone,
  validateEmail,
  validateGSTNumber,
  handleGSTInput,
  handleAlphanumericInput
} from '../../../utils/validators'

const StoreModal = ({ isOpen, onClose, onStoreCreated, initialData = {} }) => {
  const isEditMode = !!initialData?.id
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    gst: initialData.gst || '',
    email: initialData.email || '',
    mobile: initialData.mobile || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pincode: initialData.pincode || '',
    status: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showMoreDetails, setShowMoreDetails] = useState(false)
  
  // Image upload states
  const [logoPreview, setLogoPreview] = useState(null)
  const [bankQrPreview, setBankQrPreview] = useState(null)
  const [selectedLogoFile, setSelectedLogoFile] = useState(null)
  const [selectedBankQrFile, setSelectedBankQrFile] = useState(null)
  const [deletedLogo, setDeletedLogo] = useState(null)
  const [deletedBankQr, setDeletedBankQr] = useState(null)

  // Update form data when initialData changes (for editing or prefill)
  useEffect(() => {
    if (isOpen) {
      const hasPrefillData = initialData.name || initialData.mobile || initialData.email || initialData.address
      
      if (initialData && Object.keys(initialData).length > 0) {
        setFormData({
          name: initialData.name || '',
          gst: initialData.gst || '',
          email: initialData.email || '',
          mobile: initialData.mobile || '',
          address: initialData.address || '',
          city: initialData.city || '',
          state: initialData.state || '',
          pincode: initialData.pincode || '',
          status: initialData.status !== undefined ? initialData.status : true
        })
        setFieldErrors({})
        setError('')
        
        // Set logo preview if exists
        const logoUrl = initialData.logo_url || initialData.logo || null
        if (logoUrl) {
          setLogoPreview(logoUrl)
        }
        
        // Set bank QR preview if exists
        const bankQrUrl = initialData.bank_qr_url || initialData.bank_qr || null
        if (bankQrUrl) {
          setBankQrPreview(bankQrUrl)
        }
        
        // Reset deletion tracking
        setDeletedLogo(null)
        setDeletedBankQr(null)
        setSelectedLogoFile(null)
        setSelectedBankQrFile(null)
        
        // Auto-expand more details for edit mode or if we have prefill data
        if (isEditMode || hasPrefillData) {
          setShowMoreDetails(true)
        } else {
          setShowMoreDetails(false)
        }
      } else {
        // Reset form for new store
        setFormData({
          name: '',
          gst: '',
          email: '',
          mobile: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          status: true
        })
        setFieldErrors({})
        setError('')
        setShowMoreDetails(false)
        setLogoPreview(null)
        setBankQrPreview(null)
        setSelectedLogoFile(null)
        setSelectedBankQrFile(null)
        setDeletedLogo(null)
        setDeletedBankQr(null)
      }
    }
  }, [initialData, isOpen, isEditMode])

  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Store name is required. Example: "My Store" or "ABC Mart"'
        } else if (value.trim().length < 2) {
          error = `Store name must be at least 2 characters. "${value}" is too short. Example: "My Store" (8 characters)`
        } else if (value.trim().length > 100) {
          error = `Store name cannot exceed 100 characters. Current length: ${value.length} characters. Please shorten the name.`
        }
        break
        
      case 'mobile':
        if (!value.trim()) {
          error = 'Mobile number is required. Please enter a 10-digit mobile number. Example: "9876543210"'
        } else if (!validatePhone(value)) {
          const cleanPhone = value.replace(/\D/g, '')
          if (cleanPhone.length !== 10) {
            error = `Phone number must be exactly 10 digits. Current length: ${cleanPhone.length} digits. Example: "9876543210"`
          } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            error = 'Phone number must start with 6, 7, 8, or 9. Example: "9876543210" starts with 9'
          } else {
            error = validationRules.mobile.message
          }
        }
        break
        
      case 'email':
        if (value.trim() && !validateEmail(value)) {
          error = 'Please enter a valid email address. Example: "store@example.com" or "contact@mystore.com"'
        }
        break
        
      case 'gst':
        if (value.trim() && !validateGSTNumber(value)) {
          error = 'Invalid GST number format. GST number must be 15 characters: 2 digits + 10 alphanumeric + 1 digit + 1 alphanumeric + 1 digit. Example: "22AAAAA0000A1Z"'
        }
        break
        
      case 'address':
        if (value.trim() && value.trim().length < 5) {
          error = `Address must be at least 5 characters. "${value}" is too short. Example: "123 Main Street" (15 characters)`
        }
        if (value.trim() && value.trim().length > 500) {
          error = `Address cannot exceed 500 characters. Current length: ${value.length} characters. Please shorten the address.`
        }
        break
        
      case 'city':
        if (value.trim() && !validationRules.city.pattern.test(value)) {
          error = 'City name can only contain letters (A-Z, a-z), spaces, and hyphens. Example: "New York", "Los-Angeles", or "Mumbai"'
        }
        if (value.trim() && value.trim().length > 100) {
          error = `City name cannot exceed 100 characters. Current length: ${value.length}. Please shorten the city name.`
        }
        break
        
      case 'state':
        if (value.trim() && !/^[A-Za-z\s\-]{2,50}$/.test(value)) {
          error = 'State name must contain only letters, spaces, and hyphens (2-50 characters). Example: "Maharashtra", "New York", or "California"'
        }
        break
        
      case 'pincode':
        if (value.trim() && !/^\d{6}$/.test(value)) {
          error = `Pincode must be exactly 6 digits. Current length: ${value.length} digits. Example: "400001" or "560001"`
        }
        break
        
      default:
        break
    }
    
    return error
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      // Handle file upload
      handleFileUpload(e)
      return
    }
    
    let processedValue = value
    let error = ''
    
    // Apply field-specific processing and validation
    switch (name) {
      case 'mobile':
        // Allow only numbers and limit to 10 digits
        processedValue = value.replace(/\D/g, '').slice(0, 10)
        error = validateField(name, processedValue)
        break
        
      case 'pincode':
        // Allow only numbers and limit to 6 digits
        processedValue = value.replace(/\D/g, '').slice(0, 6)
        error = validateField(name, processedValue)
        break
        
      case 'name':
        // Limit length
        if (value.length > 100) processedValue = value.slice(0, 100)
        error = validateField(name, processedValue)
        break
        
      case 'city':
        // Allow only alphanumeric, spaces, and hyphens
        processedValue = value.replace(/[^A-Za-z\s\-]/g, '')
        if (processedValue.length > 100) processedValue = processedValue.slice(0, 100)
        error = validateField(name, processedValue)
        break
        
      case 'state':
        // Allow only letters, spaces, and hyphens
        processedValue = value.replace(/[^A-Za-z\s\-]/g, '')
        if (processedValue.length > 50) processedValue = processedValue.slice(0, 50)
        error = validateField(name, processedValue)
        break
        
      case 'address':
        if (value.length > 500) processedValue = value.slice(0, 500)
        error = validateField(name, processedValue)
        break
        
      case 'email':
        if (value.length > 255) processedValue = value.slice(0, 255)
        error = validateField(name, processedValue)
        break
        
      case 'gst':
        // Convert to uppercase for GST
        processedValue = value.toUpperCase()
        if (processedValue.length > 50) processedValue = processedValue.slice(0, 50)
        error = validateField(name, processedValue)
        break
        
      default:
        break
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error for this field if validation passes
    if (!error) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } else {
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
    // Clear general error when user starts typing
    if (error) setError('')
  }

  // Handle file upload with validation
  const handleFileUpload = (e) => {
    const { name, files } = e.target
    const file = files[0]
    if (!file) return

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`${name === 'logo' ? 'Logo' : 'Bank QR'} file size must be less than 2MB`)
      e.target.value = ''
      return
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(`${name === 'logo' ? 'Logo' : 'Bank QR'} must be a valid image (JPG, PNG, GIF, WebP)`)
      e.target.value = ''
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      if (name === 'logo') {
        setLogoPreview(reader.result)
        setSelectedLogoFile(file)
        // Clear deleted logo if a new file is selected
        setDeletedLogo(null)
      } else {
        setBankQrPreview(reader.result)
        setSelectedBankQrFile(file)
        // Clear deleted bank QR if a new file is selected
        setDeletedBankQr(null)
      }
    }
    reader.readAsDataURL(file)
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: file
    }))
  }

  const handleRemoveFile = (type) => {
    if (type === 'logo') {
      // Store the current logo URL to be sent as deleted_logo
      const currentLogoUrl = initialData?.logo_url || initialData?.logo || null
      if (currentLogoUrl) {
        setDeletedLogo(currentLogoUrl)
        console.log('🗑️ Logo marked for deletion:', currentLogoUrl)
      }
      
      setLogoPreview(null)
      setSelectedLogoFile(null)
      setFormData(prev => ({
        ...prev,
        logo: null
      }))
      // Reset file input
      const fileInput = document.querySelector('input[name="logo"]')
      if (fileInput) fileInput.value = ''
    } else {
      // Store the current bank QR URL to be sent as deleted_bank_qr
      const currentBankQrUrl = initialData?.bank_qr_url || initialData?.bank_qr || null
      if (currentBankQrUrl) {
        setDeletedBankQr(currentBankQrUrl)
        console.log('🗑️ Bank QR marked for deletion:', currentBankQrUrl)
      }
      
      setBankQrPreview(null)
      setSelectedBankQrFile(null)
      setFormData(prev => ({
        ...prev,
        bank_qr: null
      }))
      const fileInput = document.querySelector('input[name="bank_qr"]')
      if (fileInput) fileInput.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError
    
    const mobileError = validateField('mobile', formData.mobile)
    if (mobileError) newErrors.mobile = mobileError
    
    // Optional fields validation (only if provided)
    if (formData.email) {
      const emailError = validateField('email', formData.email)
      if (emailError) newErrors.email = emailError
    }
    
    if (formData.gst) {
      const gstError = validateField('gst', formData.gst)
      if (gstError) newErrors.gst = gstError
    }
    
    if (formData.address) {
      const addressError = validateField('address', formData.address)
      if (addressError) newErrors.address = addressError
    }
    
    if (formData.city) {
      const cityError = validateField('city', formData.city)
      if (cityError) newErrors.city = cityError
    }
    
    if (formData.state) {
      const stateError = validateField('state', formData.state)
      if (stateError) newErrors.state = stateError
    }
    
    if (formData.pincode) {
      const pincodeError = validateField('pincode', formData.pincode)
      if (pincodeError) newErrors.pincode = pincodeError
    }
    
    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Get current user ID from auth context or localStorage
      const userId = JSON.parse(localStorage.getItem('user'))?.id || 1
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Append all fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('mobile', formData.mobile || '')
      formDataToSend.append('address', formData.address || '')
      formDataToSend.append('city', formData.city || '')
      formDataToSend.append('state', formData.state || '')
      formDataToSend.append('pincode', formData.pincode || '')
      formDataToSend.append('gst', formData.gst || '')
      formDataToSend.append('user_id', userId)
      formDataToSend.append('created_by', userId)
      formDataToSend.append('status', '1')
      
      // Handle logo
      if (selectedLogoFile) {
        // If a new logo file is selected, append it
        formDataToSend.append('logo', selectedLogoFile)
        console.log('📎 Logo file appended:', selectedLogoFile.name, selectedLogoFile.size, 'bytes')
      } else if (isEditMode && initialData?.logo) {
        // If editing and no new file selected, keep existing logo
        formDataToSend.append('logo', initialData.logo)
      }
      
      // Handle bank_qr
      if (selectedBankQrFile) {
        // If a new bank QR file is selected, append it
        formDataToSend.append('bank_qr', selectedBankQrFile)
        console.log('📎 Bank QR file appended:', selectedBankQrFile.name, selectedBankQrFile.size, 'bytes')
      } else if (isEditMode && initialData?.bank_qr) {
        // If editing and no new file selected, keep existing bank QR
        formDataToSend.append('bank_qr', initialData.bank_qr)
      }
      
      // Handle deleted logo
      if (deletedLogo) {
        formDataToSend.append('deleted_logo', deletedLogo)
        console.log('🗑️ Deleted logo appended:', deletedLogo)
      }
      
      // Handle deleted bank QR
      if (deletedBankQr) {
        formDataToSend.append('deleted_bank_qr', deletedBankQr)
        console.log('🗑️ Deleted bank QR appended:', deletedBankQr)
      }
      
      // Log FormData entries for debugging
      console.log('📝 StoreModal - FormData entries:')
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'logo' && pair[1] instanceof File) {
          console.log(`   ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`)
        } else if (pair[0] === 'bank_qr' && pair[1] instanceof File) {
          console.log(`   ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`)
        } else {
          console.log(`   ${pair[0]}: ${pair[1]}`)
        }
      }

      if (isEditMode) {
        // For edit mode, pass FormData to parent to handle API call
        onStoreCreated({ 
          ...formData, 
          id: initialData.id,
          _formData: formDataToSend,
          _isEdit: true
        })
        toast.success('Store updated successfully!')
        handleClose()
      } else {
        // For create mode, make API call directly with FormData
        const response = await storeAPI.create(formDataToSend)
        
        if (response.data) {
          toast.success('Store created successfully!')
          onStoreCreated(response.data)
          handleClose()
        } else {
          throw new Error('Failed to create store')
        }
      }
    } catch (err) {
      console.error('Store operation error:', err)
      const errorMessage = err.response?.data?.message || err.message || (isEditMode ? 'Failed to update store' : 'Failed to create store')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      gst: '',
      email: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: true
    })
    setError('')
    setFieldErrors({})
    setShowMoreDetails(false)
    setLogoPreview(null)
    setBankQrPreview(null)
    setSelectedLogoFile(null)
    setSelectedBankQrFile(null)
    setDeletedLogo(null)
    setDeletedBankQr(null)
    onClose()
  }

  // Check if there are any errors
  const hasErrors = Object.keys(fieldErrors).length > 0
  
  // Check if required fields are filled (for success indicator)
  const requiredFieldsFilled = formData.name && formData.mobile

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Store" : "Add New Store"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
          >
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Store Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter store name (e.g., My Store or ABC Mart)"
            required
            icon={LucideStore}
            error={fieldErrors.name}
            helperText="Between 2-100 characters"
          />

          <Input
            label="Mobile Number *"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Enter 10-digit mobile number (e.g., 9876543210)"
            required
            icon={FiPhone}
            type="tel"
            error={fieldErrors.mobile}
            helperText="Enter a valid 10-digit mobile number starting with 6,7,8, or 9"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiImage className="inline mr-2" />
            Store Logo
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleInputChange}
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
        </div>

        {/* Bank QR Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <FaQrcode className="inline mr-2" />
            Bank QR Code
          </label>
          <input
            type="file"
            name="bank_qr"
            accept="image/*"
            onChange={handleInputChange}
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
        </div>

        {/* Add More Details Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            icon={showMoreDetails ? FiChevronUp : FiChevronDown}
          >
            {showMoreDetails ? 'Hide' : 'Add'} More Details
          </Button>
        </div>

        {/* Collapsible Additional Fields */}
        <AnimatePresence>
          {showMoreDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address (e.g., store@example.com)"
                  icon={FiMail}
                  type="email"
                  error={fieldErrors.email}
                  helperText="Optional - Enter valid email like name@domain.com"
                />

                <Input
                  label="GST Number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                  placeholder="Enter GST number (e.g., 22AAAAA0000A1Z)"
                  icon={FiGlobe}
                  error={fieldErrors.gst}
                  helperText="Optional - Format: 15 characters (2 digits + 10 alphanumeric + 1 digit + 1 alphanumeric + 1 digit)"
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address (e.g., 123 Main Street, Near Central Park)"
                  icon={FiMapPin}
                  error={fieldErrors.address}
                  helperText="Optional - Full street address (minimum 5 characters)"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city name (e.g., Mumbai, New York)"
                    icon={FiMapPin}
                    error={fieldErrors.city}
                    helperText="Optional - Letters, spaces, and hyphens only"
                  />

                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state name (e.g., Maharashtra, California)"
                    icon={FiMapPin}
                    error={fieldErrors.state}
                    helperText="Optional - Letters, spaces, and hyphens only (2-50 characters)"
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit pincode (e.g., 400001)"
                    icon={FiMapPin}
                    type="text"
                    error={fieldErrors.pincode}
                    helperText="Optional - Must be exactly 6 digits"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden status field */}
        <input
          type="hidden"
          name="status"
          value="true"
        />

        {/* Error Summary - Shows only when there are errors */}
        <AnimatePresence>
          {hasErrors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <div className="flex items-start space-x-2">
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                    {Object.entries(fieldErrors).map(([field, errorMsg]) => (
                      errorMsg && (
                        <motion.li 
                          key={field} 
                          className="flex items-start space-x-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <span className="inline-block mr-2">•</span>
                          <span>
                            <strong>{field === 'name' ? 'Store Name' : 
                                     field === 'mobile' ? 'Mobile Number' :
                                     field === 'gst' ? 'GST Number' :
                                     field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {errorMsg}
                          </span>
                        </motion.li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator when no errors and required fields are filled */}
        <AnimatePresence>
          {!hasErrors && requiredFieldsFilled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
            >
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  All required fields are valid! You can submit the form.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            icon={FiX}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting || hasErrors}
            icon={FiSave}
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Store' : 'Create Store')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default StoreModal