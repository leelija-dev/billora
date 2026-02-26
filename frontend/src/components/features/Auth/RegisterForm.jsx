import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/authStore'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { FiUser, FiMail, FiLock, FiPhone, FiBuilding, FiEye, FiEyeOff } from 'react-icons/fi'

const RegisterForm = ({ onSuccess }) => {
  const { register: registerCompany, isLoading } = useAuthStore()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm()

  const password = watch('password', '')

  const onNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['companyName', 'companyEmail', 'phone', 'companySize']
      : ['fullName', 'email', 'password', 'confirmPassword', 'terms']
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      if (step === 1) {
        setStep(2)
      }
    }
  }

  const onSubmit = async (data) => {
    if (step === 1) {
      await onNext()
    } else {
      const result = await registerCompany(data)
      if (result.success && onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= 1 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                1
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Company</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${
              step >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= 2 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                2
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {step === 1 ? (
        /* Company Information Step */
        <div className="space-y-4">
          <Input
            label="Company Name"
            placeholder="Enter your company name"
            icon={FiBuilding}
            error={errors.companyName?.message}
            {...register('companyName', {
              required: 'Company name is required',
              minLength: {
                value: 2,
                message: 'Company name must be at least 2 characters',
              },
            })}
          />

          <Input
            label="Company Email"
            type="email"
            placeholder="Enter company email"
            icon={FiMail}
            error={errors.companyEmail?.message}
            {...register('companyEmail', {
              required: 'Company email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            icon={FiPhone}
            error={errors.phone?.message}
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                message: 'Invalid phone number',
              },
            })}
          />

          <Select
            label="Company Size"
            options={[
              { value: '1-10', label: '1-10 employees' },
              { value: '11-50', label: '11-50 employees' },
              { value: '51-200', label: '51-200 employees' },
              { value: '201-500', label: '201-500 employees' },
              { value: '501+', label: '501+ employees' },
            ]}
            error={errors.companySize?.message}
            {...register('companySize', {
              required: 'Please select company size',
            })}
          />

          <Select
            label="Industry"
            options={[
              { value: 'technology', label: 'Technology' },
              { value: 'retail', label: 'Retail' },
              { value: 'manufacturing', label: 'Manufacturing' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'education', label: 'Education' },
              { value: 'other', label: 'Other' },
            ]}
            {...register('industry')}
          />
        </div>
      ) : (
        /* Admin Account Step */
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            icon={FiUser}
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

          <Input
            label="Email Address"
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
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase and number',
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

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.terms.message}</p>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex space-x-4">
        {step === 2 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            fullWidth
            size="lg"
          >
            Back
          </Button>
        )}
        <Button
          type={step === 2 ? 'submit' : 'button'}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          size="lg"
          onClick={step === 1 ? onNext : undefined}
        >
          {step === 1 ? 'Continue' : 'Create Account'}
        </Button>
      </div>

      {/* Social Registration */}
      {step === 2 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            GitHub
          </button>
        </div>
      )}
    </form>
  )
}

export default RegisterForm