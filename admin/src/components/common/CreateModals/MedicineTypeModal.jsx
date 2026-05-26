import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave } from 'react-icons/fi'
import { useAuthStore } from '../../../store/authStore'
import Button from '../Button/Button'
import Input from '../Input/Input'

const MedicineTypeModal = ({ isOpen, onClose, onCreate, initialData = null, initialName = '' }) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    name: initialData?.name || initialName || '',
    user_id: user?.id || '',
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens with new initialName (for new items)
  useEffect(() => {
    if (isOpen && initialName && !initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialName
      }))
    }
  }, [isOpen, initialName, initialData])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        user_id: user?.id || '',
        is_active: true
      })
    }
  }, [isOpen, user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onCreate(formData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        user_id: user?.id || '',
        is_active: true
      })
    } catch (error) {
      console.error('Error creating medicine type:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {initialData ? 'Edit Medicine Type' : 'Create New Medicine Type'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {initialData ? 'Update medicine type information' : 'Add a new medicine type'}
                </p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                onClick={onClose}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden fields */}
              <input type="hidden" name="user_id" value={formData.user_id} />
              <input type="hidden" name="is_active" value={formData.is_active ? 1 : 0} />

              <Input
                label="Medicine Type Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter medicine type name (e.g., Tablet, Capsule, Syrup)"
                required
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {initialData ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MedicineTypeModal