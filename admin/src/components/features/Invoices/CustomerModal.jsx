import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { useCustomerStore } from '../../../store/customerStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'
import { handlePhoneInput, handleMaxLength, validationRules } from '../../../utils/validators'

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
    gst: '',
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
          gst: initialData.gst || '',
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
          gst: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    let validationError = ''
    
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '')
      if (phoneValue.length > 0 && phoneValue.length < 10) {
        validationError = 'Phone number must be exactly 10 digits'
      } else if (phoneValue.length === 10) {
        validationError = ''
      }
    } else if (name === 'name') {
      if (value.trim().length > 0 && value.trim().length < validationRules.productName.minLength) {
        validationError = `Name must be at least ${validationRules.productName.minLength} characters`
      }
    } else if (name === 'email') {
      if (value.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        validationError = 'Please enter a valid email address'
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: validationError
    }))
    
    if (validationError) setError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Phone validation (required)
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '')
      if (cleanPhone.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits'
      }
    }

    // If more details are shown or in edit mode, validate these fields
    if (showMoreDetails || isEditMode) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required'
      }

      if (!formData.address?.trim()) {
        newErrors.address = 'Address is required'
      }
    }

    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // In CustomerModal.jsx - Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Prevent duplicate submissions
  if (isSubmittingRef.current || hasSubmittedRef.current) {
    console.log('Preventing duplicate submission')
    return
  }
  
  if (!validateForm()) {
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
      }
      
      const result = await updateCustomer(initialData.id, updateData)
      
      if (result.success) {
        hasSubmittedRef.current = true
        toast.success('Customer updated successfully!')
        // Pass the complete customer object with ID
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
        created_by: userId
      }
      
      const result = await createCustomer(customerData)
      
      if (result.success) {
        hasSubmittedRef.current = true
        toast.success('Customer created successfully!')
        
        // IMPORTANT: Get the complete customer data from the API response
        // The customer store now returns data field with the API response
        let createdCustomer = result.data?.data || result.data
        
        // Ensure we have a complete customer object with ID
        if (createdCustomer && !createdCustomer.id && createdCustomer.data?.id) {
          createdCustomer = createdCustomer.data
        }
        
        console.log('Full customer data from API:', createdCustomer)
        
        // Make sure we pass the complete object with ID
        if (createdCustomer && createdCustomer.id) {
          onCustomerCreated(createdCustomer)
        } else {
          // Log the issue for debugging
          console.error('No valid customer ID found in response:', result)
          console.error('Created customer object:', createdCustomer)
          toast.error('Customer created but ID is missing. Please try again.')
          return // Don't close modal, let user try again
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
      gst: '',
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Customer" : "Add New Customer"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Only Phone Number Field - Always Visible */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Phone Number *"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter 10-digit phone number"
            icon={FiPhone}
            type="tel"
            required
            error={fieldErrors.phone}
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
                  placeholder="Enter customer's full name"
                  icon={FiUser}
                  required={showMoreDetails || isEditMode}
                  error={fieldErrors.name}
                />

                <Input
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  icon={FiMapPin}
                  required={showMoreDetails || isEditMode}
                  error={fieldErrors.address}
                />

                <Input
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  icon={FiMail}
                  type="email"
                  error={fieldErrors.email}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    icon={FiMapPin}
                  />

                  <Input
                    label="GST Number"
                    name="gst"
                    value={formData.gst}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                    icon={FiGlobe}
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
                  </div>
                )}
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
            disabled={isSubmitting}
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