'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/lib/validations/auth'
import { FiEye, FiEyeOff, FiMail, FiLock, FiLoader } from 'react-icons/fi'
import logo from '@/public/images/logo.svg'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginLoading, loginError, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-100">
              <Image
                src={logo}
                alt="Admin Panel Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                    transition-colors duration-200
                    ${errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }
                  `}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                    transition-colors duration-200
                    ${errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }
                  `}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">❌</span>
                  <p className="text-sm text-red-600">
                    {loginError.message || 'Invalid email or password. Please try again.'}
                  </p>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginLoading || isSubmitting}
              className="
                w-full flex items-center justify-center px-4 py-3 
                bg-gradient-to-r from-red-500 to-red-600 
                text-white font-medium rounded-xl
                hover:from-red-600 hover:to-red-700 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg hover:shadow-xl
                transform hover:scale-[1.02] active:scale-[0.98]
              "
            >
              {loginLoading || isSubmitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  <FiLock className="mr-2 h-4 w-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="
              inline-flex items-center text-sm text-gray-600 hover:text-red-600 
              transition-colors duration-200 font-medium
            "
          >
            <span className="mr-1">←</span>
            Back to Website
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Secured admin access • Built with Next.js
          </p>
        </div>
      </div>
    </div>
  )
}
