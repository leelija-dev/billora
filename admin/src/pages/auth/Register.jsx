import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  const [step, setStep] = useState(1)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async (data) => {
    if (step === 1) {
      const isValid = await trigger(['name', 'email', 'phone', 'city', 'state', 'country', 'pincode'])
      if (isValid) setStep(2)
    } else {
      // Prepare data for API
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        company_name: data.company_name || '',
        gst_number: data.gst_number || '',
        address: data.address || '',
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        created_by: null
      }
      
      const result = await registerUser(userData)
      if (result.success) {
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register Your Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full">
              <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Personal Info</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${
                step >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Account Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Full name is required',
                  })}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
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
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                />

                <Input
                  label="Company Name (Optional)"
                  placeholder="Enter company name"
                  error={errors.company_name?.message}
                  {...register('company_name')}
                />

                <Input
                  label="GST Number (Optional)"
                  placeholder="Enter GST number"
                  error={errors.gst_number?.message}
                  {...register('gst_number')}
                />

                <Input
                  label="Address (Optional)"
                  placeholder="Enter address"
                  error={errors.address?.message}
                  {...register('address')}
                />

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                />
              </>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <div className="flex space-x-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  fullWidth
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                {step === 1 ? 'Continue' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register