import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../store/authStore'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import toast from 'react-hot-toast'
import { FiX, FiPackage, FiMail, FiPhone, FiMapPin, FiSave, FiArrowLeft } from 'react-icons/fi'

const StoreForm = ({ 
  store = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isEdit = false 
}) => {
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm()

  // Get current user ID from auth store
  const getUserId = () => {
    // First try to get user from auth store (most reliable)
    if (user && user.id) {
      return user.id.toString()
    }
    
    // Fallback to localStorage if auth store is not available
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
    
    // Last fallback - try old auth key
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

  // Pre-fill form if editing
  useEffect(() => {
    if (store && isEdit) {
      reset({
        name: store.name || '',
        gst: store.gst || '',
        email: store.email || '',
        logo: store.logo || '',
        mobile: store.mobile || '',
        address: store.address || '',
        city: store.city || '',
        status: store.status === true || store.status === 'active' ? 'active' : 'inactive',
      })
    } else {
      // For new store, set default values
      reset({
        name: '',
        gst: '',
        email: '',
        logo: '',
        mobile: '',
        address: '',
        city: '',
        status: 'active',
        user_id: currentUserId,
        created_by: currentUserId,
      })
    }
  }, [store, isEdit, reset, currentUserId])

  const onFormSubmit = (data) => {
    const storeData = {
      ...data,
      user_id: currentUserId,
      created_by: currentUserId,
      // Convert status to boolean or string as needed by your backend
      status: data.status === 'active' ? true : false,
    }
    console.log('📝 StoreForm - Form data submitted:', data)
    console.log('📝 StoreForm - Final store data:', storeData)
    onSubmit(storeData)
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
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      icon: FiMail,
      gridCols: 'col-span-1',
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: 'Enter mobile number',
      required: false,
      icon: FiPhone,
      gridCols: 'col-span-1',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter store address',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-2',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      required: true,
      icon: FiMapPin,
      gridCols: 'col-span-1',
    },
    {
      name: 'gst',
      label: 'GST Number',
      type: 'text',
      placeholder: 'Enter GST number',
      required: false,
      icon: FiPackage,
      gridCols: 'col-span-1',
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
              <Input
                name={field.name}
                label={field.label}
                type={field.type}
                value={watch(field.name)}
                onChange={(e) => setValue(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                error={errors[field.name]?.message}
                icon={field.icon}
                disabled={isSubmitting}
              />
            </div>
          ))}

          {/* Status Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">
              Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 h-[42px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div className="space-y-2 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Store Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('logo')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: Square image, max 2MB
            </p>
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>
        </div>

        {/* Hidden fields for user_id and created_by */}
        <input type="hidden" {...register('user_id')} value={currentUserId} />
        <input type="hidden" {...register('created_by')} value={currentUserId} />

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