import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, FiChevronDown, FiChevronUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { useCustomerStore } from '../../../store/customerStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'
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

const CustomerModal = ({ isOpen, onClose, onCustomerCreated, initialData = {} }) => {
  const { createCustomer, updateCustomer } = useCustomerStore()
  const { user } = useAuthStore()
  
  const isEditMode = !!initialData?.id
  const isSubmittingRef = useRef(false)
  const hasSubmittedRef = useRef(false)
  const initialDataSetRef = useRef(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    gst_number: '',
    status: 'active'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  // Reset form when modal opens - but only once per open
  useEffect(() => {
    if (isOpen) {
      // Reset the flag when modal opens
      initialDataSetRef.current = false
      
      if (initialData && Object.keys(initialData).length > 0 && !initialDataSetRef.current) {
        // For edit mode or pre-filled new customer data
        const hasPrefillData = initialData.name || initialData.phone || initialData.email || initialData.address
        
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          address: initialData.address || '',
          city: initialData.city || '',
          gst_number: initialData.gst_number || initialData.gst || '',
          status: initialData.status || 'active'
        })
        setFieldErrors({})
        setError('')
        initialDataSetRef.current = true
        
        // Auto-expand more details for edit mode or if we have prefill data beyond just phone
        if (isEditMode || (hasPrefillData && (initialData.name || initialData.address))) {
          setShowMoreDetails(true)
        } else {
          setShowMoreDetails(false)
        }
      } else if ((!initialData || Object.keys(initialData).length === 0) && !initialDataSetRef.current) {
        // Reset form for new customer
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          gst_number: '',
          status: 'active'
        })
        setFieldErrors({})
        setError('')
        setShowMoreDetails(false)
        initialDataSetRef.current = true
      }
      
      // Reset submission refs when modal opens
      hasSubmittedRef.current = false
      isSubmittingRef.current = false
    } else {
      // Reset the flag when modal closes
      initialDataSetRef.current = false
    }
  }, [isOpen, initialData, isEditMode])

  // Helper function to get detailed error messages with examples
  const getDetailedErrorMessage = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          return 'Full name is required. Example: "John Doe" or "Rajesh Kumar"'
        }
        if (value.trim().length < 2) {
          return `Name must be at least 2 characters long. "${value}" is too short. Example: "John" (4 characters)`
        }
        if (value.trim().length > 100) {
          return `Name cannot exceed 100 characters. Current length: ${value.length} characters. Please shorten the name.`
        }
        if (!/^[a-zA-Z\s.-]+$/.test(value)) {
          return 'Name can only contain letters (A-Z, a-z), spaces, dots (.), and hyphens (-). Example: "John D. Smith" or "Raj-Kumar"'
        }
        return ''

      case 'phone':
        if (!value || !value.trim()) {
          return 'Phone number is required. Please enter a 10-digit mobile number. Example: "9876543210"'
        }
        const cleanPhone = value.replace(/\D/g, '')
        if (cleanPhone.length !== 10) {
          return `Phone number must be exactly 10 digits. Current length: ${cleanPhone.length} digits. Example: "9876543210" (10 digits)`
        }
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
          return 'Phone number must start with 6, 7, 8, or 9. Example: "9876543210" starts with 9'
        }
        return ''

      case 'address':
        if (showMoreDetails || isEditMode) {
          if (!value || !value.trim()) {
            return 'Address is required. Please enter a complete address. Example: "123 Main Street, Near Central Park"'
          }
          if (value.length < 5) {
            return `Address must be at least 5 characters. "${value}" is too short. Example: "123 Main St" (12 characters)`
          }
          if (value.length > 500) {
            return `Address cannot exceed 500 characters. Current length: ${value.length} characters. Please shorten the address.`
          }
        }
        return ''

      case 'email':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address. Example: "customer@example.com" or "john.doe@gmail.com"'
        }
        return ''

      case 'city':
        if (value && !/^[a-zA-Z\s-]+$/.test(value)) {
          return 'City name can only contain letters (A-Z, a-z), spaces, and hyphens. Example: "New York", "Los-Angeles", or "Mumbai"'
        }
        if (value && value.length > 100) {
          return `City name cannot exceed 100 characters. Current length: ${value.length}. Please shorten the city name.`
        }
        return ''

      case 'gst_number':
        if (value && !validateGSTNumber(value)) {
          return 'Invalid GST number format. GST number must be 15 characters: 2 digits + 10 alphanumeric + 1 digit + 1 alphanumeric + 1 digit. Example: "22AAAAA0000A1Z"'
        }
        return ''

      default:
        return ''
    }
  }

  // Field validation function with detailed messages
  const validateField = (name, value) => {
    return getDetailedErrorMessage(name, value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value
    let validationError = ''
    
    // Apply field-specific processing
    switch (name) {
      case 'phone':
        // Allow only numbers and limit to 10 digits
        processedValue = value.replace(/\D/g, '').slice(0, 10)
        validationError = validateField(name, processedValue)
        break
        
      case 'name':
        // Allow letters, spaces, dots, and hyphens only
        processedValue = value.replace(/[^a-zA-Z\s.-]/g, '')
        if (processedValue.length > 100) processedValue = processedValue.slice(0, 100)
        validationError = validateField(name, processedValue)
        break
        
      case 'city':
        // Allow only letters, spaces, and hyphens
        processedValue = value.replace(/[^a-zA-Z\s-]/g, '')
        if (processedValue.length > 100) processedValue = processedValue.slice(0, 100)
        validationError = validateField(name, processedValue)
        break
        
      case 'address':
        if (processedValue.length > 500) processedValue = processedValue.slice(0, 500)
        validationError = validateField(name, processedValue)
        break
        
      case 'email':
        if (processedValue.length > 255) processedValue = processedValue.slice(0, 255)
        validationError = validateField(name, processedValue)
        break
        
      case 'gst_number':
        // Convert to uppercase for GST
        processedValue = value.toUpperCase()
        if (processedValue.length > 50) processedValue = processedValue.slice(0, 50)
        validationError = validateField(name, processedValue)
        break
        
      default:
        break
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error for this field if validation passes
    if (!validationError) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } else {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validationError
      }))
    }
    
    // Clear general error when user starts typing
    if (validationError) {
      setError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Phone validation (always required)
    const phoneError = validateField('phone', formData.phone)
    if (phoneError) newErrors.phone = phoneError
    
    // If more details are shown or in edit mode, validate these fields
    if (showMoreDetails || isEditMode) {
      const nameError = validateField('name', formData.name)
      if (nameError) newErrors.name = nameError
      
      const addressError = validateField('address', formData.address)
      if (addressError) newErrors.address = addressError
      
      // Optional fields validation (only if provided)
      if (formData.email) {
        const emailError = validateField('email', formData.email)
        if (emailError) newErrors.email = emailError
      }
      
      if (formData.city) {
        const cityError = validateField('city', formData.city)
        if (cityError) newErrors.city = cityError
      }
      
      if (formData.gst_number) {
        const gstError = validateField('gst_number', formData.gst_number)
        if (gstError) newErrors.gst_number = gstError
      }
    }
    
    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent duplicate submissions
    if (isSubmittingRef.current || hasSubmittedRef.current) {
      console.log('Preventing duplicate submission')
      return
    }
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')

    try {
      const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id || 1
      
      if (isEditMode) {
        // Update existing customer
        const updateData = {
          user_id: userId,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          address: formData.address,
          city: formData.city || null,
          gst_number: formData.gst_number || null,
        }
        
        const result = await updateCustomer(initialData.id, updateData)
        
        if (result.success) {
          hasSubmittedRef.current = true
          toast.success('Customer updated successfully!')
          const updatedCustomer = { ...updateData, id: initialData.id }
          onCustomerCreated(updatedCustomer)
          handleClose()
        } else {
          throw new Error(result.error?.message || 'Failed to update customer')
        }
      } else {
        // Create new customer
        const customerData = {
          user_id: userId,
          name: showMoreDetails ? formData.name : formData.phone,
          email: formData.email || null,
          phone: formData.phone,
          address: showMoreDetails ? formData.address : 'N/A',
          city: formData.city || null,
          gst_number: formData.gst_number || null,
          created_by: userId
        }
        
        const result = await createCustomer(customerData)
        
        if (result.success) {
          hasSubmittedRef.current = true
          toast.success('Customer created successfully!')
          
          let createdCustomer = result.data?.data || result.data
          
          if (createdCustomer && !createdCustomer.id && createdCustomer.data?.id) {
            createdCustomer = createdCustomer.data
          }
          
          console.log('Full customer data from API:', createdCustomer)
          
          if (createdCustomer && createdCustomer.id) {
            onCustomerCreated(createdCustomer)
          } else {
            console.error('No valid customer ID found in response:', result)
            toast.error('Customer created but ID is missing. Please try again.')
            return
          }
          
          handleClose()
        } else {
          throw new Error(result.error?.message || 'Failed to create customer')
        }
      }
    } catch (err) {
      console.error('Customer operation error:', err)
      const errorMessage = err.response?.data?.message || err.message || (isEditMode ? 'Failed to update customer' : 'Failed to create customer')
      setError(errorMessage)
      toast.error(errorMessage)
      isSubmittingRef.current = false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      gst_number: '',
      status: 'active'
    })
    setError('')
    setFieldErrors({})
    setShowMoreDetails(false)
    isSubmittingRef.current = false
    hasSubmittedRef.current = false
    initialDataSetRef.current = false
    onClose()
  }

  // Check if there are any errors
  const hasErrors = Object.keys(fieldErrors).length > 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Customer" : "Add New Customer"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm"
          >
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Only Phone Number Field - Always Visible */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Phone Number *"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter 10-digit mobile number (e.g., 9876543210)"
            icon={FiPhone}
            type="tel"
            required
            error={fieldErrors.phone}
            helperText="Enter a valid 10-digit mobile number starting with 6,7,8, or 9"
          />
        </div>

        {/* Add More Details Button (only for create mode) */}
        {!isEditMode && (
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
        )}

        {/* Collapsible Additional Fields */}
        <AnimatePresence>
          {(showMoreDetails || isEditMode) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name (e.g., John Doe or Rajesh Kumar)"
                  icon={FiUser}
                  required={showMoreDetails || isEditMode}
                  error={fieldErrors.name}
                  helperText="Letters, spaces, dots (.), and hyphens (-) only (2-100 characters)"
                />

                <Input
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address (e.g., 123 Main Street, Near Central Park)"
                  icon={FiMapPin}
                  required={showMoreDetails || isEditMode}
                  error={fieldErrors.address}
                  helperText="Full street address (minimum 5 characters)"
                />

                <Input
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address (e.g., customer@example.com)"
                  icon={FiMail}
                  type="email"
                  error={fieldErrors.email}
                  helperText="Optional but recommended - Enter valid email like name@domain.com"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label="GST Number"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    placeholder="Enter GST number (e.g., 22AAAAA0000A1Z)"
                    icon={FiGlobe}
                    error={fieldErrors.gst_number}
                    helperText="Optional - Format: 15 characters (2 digits + 10 alphanumeric + 1 digit + 1 alphanumeric + 1 digit)"
                  />
                </div>

                {/* Status Field - only for edit mode */}
                {isEditMode && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 h-[42px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active: Customer can make purchases | Inactive: Temporarily disabled | Blocked: Permanently disabled
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    {Object.entries(fieldErrors).map(([field, message]) => (
                      <motion.li 
                        key={field} 
                        className="flex items-start space-x-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <span className="inline-block mr-2">•</span>
                        <span>
                          <strong>{field === 'name' ? 'Name' : 
                                   field === 'phone' ? 'Phone Number' :
                                   field === 'address' ? 'Address' :
                                   field === 'gst_number' ? 'GST Number' :
                                   field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {message}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator when no errors and fields are filled */}
        {!hasErrors && (showMoreDetails || isEditMode) && formData.name && formData.address && formData.phone && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Customer' : 'Create Customer')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CustomerModal