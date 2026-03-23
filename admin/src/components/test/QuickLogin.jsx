import React, { useState } from 'react'
import { authService } from '../../services'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import { useForm } from 'react-hook-form'

const QuickLogin = () => {
  const { login, isLoading } = useAuthStore()
  const [showLogin, setShowLogin] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      setShowLogin(false)
      window.location.reload() // Reload to update auth state
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showLogin ? (
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
        >
          🔐 Quick Login
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-6 w-80">
          <h3 className="text-lg font-semibold mb-4">Quick Login for Testing</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
              })}
            />
            
            <div className="flex space-x-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogin(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default QuickLogin
