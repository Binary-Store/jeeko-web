'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import ProductForm from '@/components/admin/ProductForm'
import { useProduct, useUpdateProduct } from '@/hooks/useProducts'

export default function EditProductPage({ params }) {
    const { id } = use(params)
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false)
    
    const { data: productData, isLoading, error, refetch } = useProduct(id)
    const updateMutation = useUpdateProduct()

    // Handle redirect if product not found (404 error)
    useEffect(() => {
        if (error && error.response?.status === 404) {
            console.log('Product not found, redirecting to product list')
            setIsRedirecting(true)
            
            // Show brief message before redirect
            setTimeout(() => {
                router.push('/admin/product')
            }, 2000)
        }
    }, [error, router])

    // Enhanced submit handler with better error handling
    const handleSubmit = async (data) => {
        try {
            console.log('📝 Submitting update for product:', id)
            console.log('📝 Update data:', data)
            
            await updateMutation.mutateAsync({ id, data })
            console.log('✅ Update successful')
            
            // Small delay to show success state
            setTimeout(() => {
                router.push('/admin/product')
            }, 500)
            
        } catch (error) {
            console.error('❌ Update failed:', error)
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                alert('This product no longer exists. Redirecting to product list.')
                router.push('/admin/product')
            } else if (error.response?.status === 409) {
                // Conflict - product name already exists
                throw new Error('A product with this name already exists')
            } else if (error.response?.status === 400) {
                // Validation error
                const errorDetails = error.response?.data?.details
                if (Array.isArray(errorDetails)) {
                    throw new Error(`Validation failed: ${errorDetails.join(', ')}`)
                } else {
                    throw new Error(error.response?.data?.error || 'Invalid data provided')
                }
            } else {
                // Generic error handling
                const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
                throw new Error(`Failed to update product: ${errorMessage}`)
            }
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        )
    }

    // Redirecting state (when product not found)
    if (isRedirecting) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiAlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Product not found</p>
                    <p className="text-sm text-gray-500">Redirecting to products list...</p>
                    <div className="mt-4">
                        <Link 
                            href="/admin/product"
                            className="text-red-600 hover:text-red-700 underline"
                        >
                            Go now →
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Error state (non-404 errors)
    if (error && error.response?.status !== 404) {
        console.error('❌ Error loading product:', error)
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/product"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Products</span>
                    </Link>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <FiAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Product</h3>
                    <p className="text-red-600 mb-4">
                        {error.response?.status === 500 
                            ? 'Server error occurred. Please try again later.' 
                            : `Error loading product: ${error.message}`
                        }
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/admin/product"
                            className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // No data state
    if (!productData?.data) {
        console.error('❌ No product data received')
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/product"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Products</span>
                    </Link>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <FiAlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-yellow-900 mb-2">Product Not Found</h3>
                    <p className="text-yellow-700 mb-4">
                        The requested product could not be found or has been deleted.
                    </p>
                    <Link
                        href="/admin/product"
                        className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        Go Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    console.log('✅ Product data loaded:', productData.data)

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/product"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Products</span>
                </Link>
            </div>

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-2">
                    Update the details for "{productData.data.name}"
                </p>
            </div>
            
            {/* Success Message */}
            {updateMutation.isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
                    <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <p className="text-green-800">
                        Product updated successfully! Redirecting...
                    </p>
                </div>
            )}
            
            {/* Form */}
            <ProductForm
                initialData={productData.data}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                isEditing={true}
            />
            
            {/* Error Display */}
            {updateMutation.isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                        <h4 className="text-red-900 font-medium mb-1">Update Failed</h4>
                        <p className="text-red-700 text-sm">
                            {updateMutation.error?.message || 
                             updateMutation.error?.response?.data?.error || 
                             'An unknown error occurred while updating the product'}
                        </p>
                        {updateMutation.error?.response?.data?.details && (
                            <ul className="mt-2 text-red-600 text-xs list-disc list-inside">
                                {updateMutation.error.response.data.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Changes are saved automatically to your browser. 
                    Make sure to review all fields before submitting.
                </p>
            </div>
        </div>
    )
}
