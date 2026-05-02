import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave, FiUser, FiMapPin, FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { useCustomerStore } from '../../../store/customerStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const CustomerModal = ({ isOpen, onClose, onCustomerCreated, initialData = {} }) => {
  const { createCustomer, fetchCustomers } = useCustomerStore()
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    gst: initialData.gst || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s-()+]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required')
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
      gst: ''
    })
    setError('')
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
          />
        </div>

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
