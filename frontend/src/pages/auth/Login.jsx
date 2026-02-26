// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { useAuthStore } from '../../store/authStore'
// import Button from '../../components/common/Button/Button'
// import Input from '../../components/common/Input/Input'

// const Login = () => {
//   const navigate = useNavigate()
//   const { login, isLoading } = useAuthStore()
//   const [showPassword, setShowPassword] = useState(false)
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm()

//   const onSubmit = async (data) => {
//     const result = await login(data)
//     if (result.success) {
//       navigate('/dashboard')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800 p-4">
//       <div className="max-w-md w-full">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
//             <span className="text-white font-bold text-2xl">S</span>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome back
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Sign in to your company account
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <Input
//               label="Email"
//               type="email"
//               placeholder="Enter your email"
//               error={errors.email?.message}
//               {...register('email', {
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: 'Invalid email address',
//                 },
//               })}
//             />

//             <div className="relative">
//               <Input
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Enter your password"
//                 error={errors.password?.message}
//                 {...register('password', {
//                   required: 'Password is required',
//                   minLength: {
//                     value: 6,
//                     message: 'Password must be at least 6 characters',
//                   },
//                 })}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 {showPassword ? 'Hide' : 'Show'}
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
//                 />
//                 <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
//                   Remember me
//                 </span>
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               variant="primary"
//               fullWidth
//               isLoading={isLoading}
//             >
//               Sign In
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
//               >
//                 Register your company
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Quick demo login
  const handleDemoLogin = async () => {
    setIsDemoMode(true)
    // Simulate API call
    setTimeout(() => {
      // Manually set auth state
      useAuthStore.setState({
        user: {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'admin',
        },
        company: {
          id: 1,
          name: 'Demo Company',
          email: 'company@demo.com',
          plan: 'professional',
        },
        tokens: {
          access: 'demo_access_token',
          refresh: 'demo_refresh_token',
        },
        isAuthenticated: true,
      })
      navigate('/dashboard')
    }, 1000)
  }

  // Fill demo credentials
  const fillDemoCredentials = () => {
    setValue('email', 'admin@demo.com')
    setValue('password', 'demo123')
  }

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your company account
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Fill Demo Credentials
          </button>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isDemoMode}
            className="flex-1 px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
          >
            {isDemoMode ? 'Logging in...' : 'Quick Demo Login'}
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>

            {/* Demo credentials hint */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>Demo credentials: admin@demo.com / demo123</p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Register your company
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login