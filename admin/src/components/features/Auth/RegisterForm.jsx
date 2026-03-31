import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/authStore'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import { FiUser, FiMail, FiLock, FiPhone, FiBuilding, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi'

const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async (data) => {
    const result = await registerUser(data)
    if (result.success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter your name"
          icon={FiUser}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={FiMail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="Enter phone number"
          icon={FiPhone}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required',
          })}
        />

        <Input
          label="Company Name"
          placeholder="Enter your company name (optional)"
          icon={FiBuilding}
          {...register('company_name')}
        />

        <Input
          label="GST Number"
          placeholder="Enter GST number (optional)"
          {...register('gst_number')}
        />

        <Input
          label="Address"
          placeholder="Enter your address (optional)"
          icon={FiMapPin}
          {...register('address')}
        />

        <Input
          label="City"
          placeholder="Enter city"
          error={errors.city?.message}
          {...register('city', {
            required: 'City is required',
          })}
        />

        <Input
          label="State"
          placeholder="Enter state"
          error={errors.state?.message}
          {...register('state', {
            required: 'State is required',
          })}
        />

        <Input
          label="Country"
          placeholder="Enter country"
          error={errors.country?.message}
          {...register('country', {
            required: 'Country is required',
          })}
        />

        <Input
          label="Pincode"
          placeholder="Enter pincode"
          error={errors.pincode?.message}
          {...register('pincode', {
            required: 'Pincode is required',
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          icon={FiLock}
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          }
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          icon={FiLock}
          error={errors.confirmPassword?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          }
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          })}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...register('terms', {
              required: 'You must accept the terms and conditions',
            })}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            I accept the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Terms and Conditions
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm">{errors.terms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}

export default RegisterForm