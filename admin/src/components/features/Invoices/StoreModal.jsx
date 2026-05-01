import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave,  FiMapPin, FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import { storeAPI } from '../../../services/storeService'
import toast from 'react-hot-toast'
import { LucideStore } from 'lucide-react'

const StoreModal = ({ isOpen, onClose, onStoreCreated, initialData = {} }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Store name is required')
      return
    }
    
    if (!formData.mobile.trim()) {
      setError('Mobile number is required')
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

      const response = await storeAPI.create(storeData)
      
      if (response.data) {
        toast.success('Store created successfully!')
        onStoreCreated(response.data)
        handleClose()
      } else {
        throw new Error('Failed to create store')
      }
    } catch (err) {
      console.error('Store creation error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create store'
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
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Store"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Store Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter store name"
            required
            icon={LucideStore}
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
          />
        </div>

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
            {isSubmitting ? 'Creating...' : 'Create Store'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default StoreModal
