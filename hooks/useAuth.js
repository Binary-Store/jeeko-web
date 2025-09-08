'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const AUTH_KEY = 'admin_authenticated'
const USER_KEY = 'admin_user'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY)
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  // Login mutation - REMOVED router navigation from here
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (
        credentials.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        credentials.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        return { success: true, user: { email: credentials.email, role: 'admin' } }
      } else {
        throw new Error('Invalid credentials')
      }
    },
    onSuccess: (data) => {
      localStorage.setItem(AUTH_KEY, 'true')
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setIsAuthenticated(true)
      queryClient.setQueryData(['auth'], data.user)
      // Removed router navigation from here - let the component handle it
    },
    onError: (error) => {
      console.error('Login failed:', error.message)
    }
  })

  // Logout function
  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_KEY)
    setIsAuthenticated(false)
    queryClient.removeQueries(['auth'])
    router.push('/admin/login')
  }

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    },
    enabled: isAuthenticated,
  })

  return {
    isAuthenticated,
    isLoading,
    user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync, // Added async version
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
