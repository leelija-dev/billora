import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiMapPin, FiPhone, FiMail, FiGlobe, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { storeAPI } from '../../../services/storeService'
import toast from 'react-hot-toast'
import { LucideStore } from 'lucide-react'
import { handlePhoneInput, handleMaxLength, validationRules } from '../../../utils/validators'

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
      }
    }
  }, [initialData, isOpen, isEditMode])

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }))
    } else {
      // Apply validation based on field type and check for errors
      let error = ''
      
      if (name === 'mobile') {
        handlePhoneInput(e)
        const phoneValue = e.target.value.replace(/\D/g, '')
        if (phoneValue.length > 0 && phoneValue.length < 10) {
          error = 'Mobile number must be exactly 10 digits'
        } else if (phoneValue.length === 10) {
          error = ''
        }
      } else if (name === 'name') {
        handleMaxLength(e, validationRules.productName.maxLength)
        if (e.target.value.trim().length > 0 && e.target.value.trim().length < validationRules.productName.minLength) {
          error = `Store name must be at least ${validationRules.productName.minLength} characters`
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
      } else if (name === 'state') {
        handleMaxLength(e, 100)
      } else if (name === 'pincode') {
        handleMaxLength(e, 6)
        // Only allow numbers for pincode
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
        if (e.target.value.length > 0 && e.target.value.length < 6) {
          error = 'Pincode must be exactly 6 digits'
        } else if (e.target.value.length === 6) {
          error = ''
        }
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
    }
    // Clear general error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required'
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits'
    }
    
    // Set field errors and check if form is valid
    setFieldErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Get current user ID from auth context or localStorage
      const userId = JSON.parse(localStorage.getItem('user'))?.id || 1
      
      const storeData = {
        ...formData,
        user_id: userId,
        created_by: userId,
        status: true
      }

      if (isEditMode) {
        // For edit mode, pass data to parent to handle API call
        onStoreCreated({ ...storeData, id: initialData.id })
      } else {
        // For create mode, make API call directly
        const response = await storeAPI.create(storeData)
        
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
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Store" : "Add New Store"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Store Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter store name"
            required
            icon={LucideStore}
            error={fieldErrors.name}
          />

          <Input
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
            required
            icon={FiPhone}
            type="tel"
            error={fieldErrors.mobile}
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
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  icon={FiMail}
                  type="email"
                  error={fieldErrors.email}
                />

                <Input
                  label="GST Number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                  placeholder="Enter GST number"
                  icon={FiGlobe}
                  error={fieldErrors.gst}
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter store address"
                  icon={FiMapPin}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    icon={FiMapPin}
                  />

                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    icon={FiMapPin}
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    icon={FiMapPin}
                    type="text"
                    error={fieldErrors.pincode}
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
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Store' : 'Create Store')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default StoreModal
