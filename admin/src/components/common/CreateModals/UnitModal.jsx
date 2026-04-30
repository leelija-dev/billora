import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave } from 'react-icons/fi'
import { useAuthStore } from '../../../store/authStore'
import Button from '../Button/Button'
import Input from '../Input/Input'

const UnitModal = ({ isOpen, onClose, onCreate, initialData = null }) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    base_unit: initialData?.base_unit || '',
    conversion_factor: initialData?.conversion_factor || '',
    user_id: user?.id || '',
    is_active: initialData?.is_active || true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onCreate(formData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        base_unit: '',
        conversion_factor: '',
        user_id: user?.id || '',
        is_active: true
      })
    } catch (error) {
      console.error('Error creating unit:', error)
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
                  {initialData ? 'Edit Unit' : 'Create New Unit'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {initialData ? 'Update unit information' : 'Add a new measurement unit'}
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
                label="Unit Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter unit name (e.g., Pieces, Kilograms, Liters)"
                required
              />

              <Input
                label="Unit Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter unit code (e.g., pcs, kg, l)"
                required
              />

              <Input
                label="Base Unit"
                name="base_unit"
                value={formData.base_unit}
                onChange={handleChange}
                placeholder="Enter base unit (optional)"
              />

              <Input
                label="Conversion Factor"
                name="conversion_factor"
                value={formData.conversion_factor}
                onChange={handleChange}
                type="number"
                step="0.01"
                placeholder="Enter conversion factor (optional)"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter unit description (optional)"
                />
              </div>

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

export default UnitModal
