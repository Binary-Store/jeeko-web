'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  FiMenu,
  FiX,
  FiHome,
  FiFolder,
  FiPackage,
  FiLogOut,
  FiUser,
  FiAlertTriangle
} from 'react-icons/fi'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import logo from "@/public/images/logo.svg"

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <FiHome className="w-5 h-5" />
    },
    {
      href: '/admin/product-category',
      label: 'Product Category',
      icon: <FiFolder className="w-5 h-5" />
    },
    {
      href: '/admin/product',
      label: 'Product',
      icon: <FiPackage className="w-5 h-5" />
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActiveLink = (href) => {
    return pathname === href || (pathname.startsWith(href) && pathname.charAt(href.length) === '/')
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    setIsLogoutDialogOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button - Fixed positioning with higher z-index */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-red-100"
        onClick={toggleMobileMenu}
        aria-label="Toggle sidebar"
      >
        {isMobileMenuOpen ? (
          <FiX className="w-6 h-6 text-gray-800" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Mobile Overlay - FIXED: Added proper positioning and z-index */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
          aria-hidden="true"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
        />
      )}

      {/* Sidebar - UPDATED with higher z-index to be above overlay */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 top-0 left-0 h-screen w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out border-r border-red-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
        `}
        style={{
          zIndex: 50 // Ensure sidebar is above the overlay
        }}
      >
        {/* Mobile Header with Full Width Color Background */}
        <div className="lg:hidden bg-gradient-to-r from-red-50 to-gray-50 shadow-md flex-shrink-0">
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="mb-3">
              <Image
                src={logo}
                alt="Admin Panel Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Desktop Logo Section - Centered */}
        <div className="hidden lg:flex p-8 border-b border-red-100 bg-gradient-to-r from-red-50 to-gray-50 justify-center items-center flex-shrink-0">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">
              <Image
                src={logo}
                alt="Admin Panel Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu - UPDATED with proper flex and overflow */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center justify-between w-full p-3 rounded-xl
                    text-left font-medium transition-all duration-200 ease-in-out
                    ${isActiveLink(item.href)
                      ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-red-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`
                      transition-colors duration-200
                      ${isActiveLink(item.href) 
                        ? 'text-red-600' 
                        : 'text-gray-500 group-hover:text-red-500'
                      }
                    `}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile and Logout Section - UPDATED with flex-shrink-0 */}
        <div className="p-4 border-t border-red-100 bg-gradient-to-r from-gray-50 to-red-50 flex-shrink-0">

          {/* Logout Button with Alert Dialog */}
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="
                  w-full flex items-center justify-center space-x-2 px-4 py-3
                  bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                  text-white font-medium rounded-xl
                  transition-all duration-200 ease-in-out
                  shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                "
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center space-x-2">
                  <FiAlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Confirm Logout</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to logout from the admin panel? You will need to sign in again to access the dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex space-x-2">
                <AlertDialogCancel className="
                  px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                  rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-gray-500 transition-colors duration-200
                ">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="
                    px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent 
                    rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-red-500 transition-colors duration-200
                  "
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
