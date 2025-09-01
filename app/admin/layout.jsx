'use client'
import { usePathname } from 'next/navigation'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import Sidebar from '@/components/admin/Sidebar'
import { QueryProvider } from '@/provider/QueryClientProvider'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  
  // Don't protect the login page
  const { isAuthenticated, isLoading } = useProtectedRoute({ skip: isLoginPage })

  // If it's the login page, render without protection
  if (isLoginPage) {
    return (
      <QueryProvider>
        {children}
      </QueryProvider>
    )
  }

  // Loading state for protected pages
  if (isLoading) {
    return (
      <QueryProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </QueryProvider>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  // Render protected admin layout
  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryProvider>
  )
}
