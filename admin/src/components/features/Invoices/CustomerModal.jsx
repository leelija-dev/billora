import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import Select from '../../common/Select/Select'
import { useCustomerStore } from '../../../store/customerStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'
import { handlePhoneInput, handleMaxLength, validationRules } from '../../../utils/validators'

const CustomerModal = ({ isOpen, onClose, onCustomerCreated, initialData = {} }) => {
  const { createCustomer, fetchCustomers } = useCustomerStore()
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    gst: initialData.gst || '',
    status: 'active'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (isOpen && initialData && Object.keys(initialData).length > 0) {
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
    }
  }, [initialData, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Apply validation based on field type and check for errors
    let error = ''
    
    if (name === 'phone') {
      handlePhoneInput(e)
      const phoneValue = e.target.value.replace(/\D/g, '')
      if (phoneValue.length > 0 && phoneValue.length < 10) {
        error = 'Phone number must be exactly 10 digits'
      } else if (phoneValue.length === 10) {
        error = ''
      }
    } else if (name === 'name') {
      handleMaxLength(e, validationRules.productName.maxLength)
      if (e.target.value.trim().length > 0 && e.target.value.trim().length < validationRules.productName.minLength) {
        error = `Name must be at least ${validationRules.productName.minLength} characters`
      }
    } else if (name === 'email') {
      handleMaxLength(e, 255)
      if (e.target.value.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
        error = 'Please enter a valid email address'
      }
    } else if (name === 'address') {
      handleMaxLength(e, 500)
    } else if (name === 'city') {
      handleMaxLength(e, 100)
    } else if (name === 'gst') {
      handleMaxLength(e, 50)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }))
    
    // Update field-specific errors
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }))
    
    // Clear general error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    // Set field errors and return validation result
    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Get current user ID
      const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id || 1
      
      const customerData = {
        ...formData,
        name: formData.phone, // Use phone as name since name field is hidden
        admin_id: userId,
        created_by: userId
      }

      const result = await createCustomer(customerData)
      
      if (result.success) {
        toast.success('Customer created successfully!')
        onCustomerCreated(result.data || customerData)
        handleClose()
      } else {
        throw new Error(result.error?.message || 'Failed to create customer')
      }
    } catch (err) {
      console.error('Customer creation error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create customer'
      setError(errorMessage)
      toast.error(errorMessage)
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
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Customer"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            icon={FiPhone}
            type="tel"
            required
            error={fieldErrors.phone}
          />
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
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer's full name"
                  icon={FiUser}
                  error={fieldErrors.name}
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
              </div>

              <div className="space-y-4">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  icon={FiMapPin}
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
              </div>

              {/* Status Field */}
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
            {isSubmitting ? 'Creating...' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CustomerModal
