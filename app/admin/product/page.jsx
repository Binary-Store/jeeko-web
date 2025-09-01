'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiImage, FiSearch, FiAlertTriangle, FiDollarSign } from 'react-icons/fi'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import InfiniteScroll from 'react-infinite-scroll-component'
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
import { FaIndianRupeeSign } from 'react-icons/fa6'

export default function ProductListPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const router = useRouter()

    const { data: productsData, isLoading, error, refetch } = useProducts()
    const deleteMutation = useDeleteProduct()

    const products = productsData?.data || []

    // Handle card click to navigate to detail page
    const handleCardClick = (productId) => {
        router.push(`/admin/product/${productId}`)
    }

    const handleDeleteClick = (product, e) => {
        e.stopPropagation()
        setDeleteId(product._id)
        setIsDialogOpen(true)
    }

    const handleEditClick = (productId, e) => {
        e.stopPropagation()
        router.push(`/admin/product/${productId}/edit`)
    }

    // UPDATED: Using new optimized delete logic with automatic cache management
    const handleConfirmDelete = async () => {
        if (!deleteId) return

        const deletingId = deleteId // Store ID before clearing state

        try {
            // 1. Close dialog immediately
            setIsDialogOpen(false)
            
            // 2. Clear delete ID state to prevent stale references
            setDeleteId(null)
            
            // 3. Execute delete mutation (now with optimistic updates)
            await deleteMutation.mutateAsync(deletingId)
            
            // 4. Check if user is currently viewing the deleted product's detail page
            const currentPath = window.location.pathname
            if (currentPath === `/admin/product/${deletingId}`) {
                // Redirect to products list if viewing deleted product
                router.push('/admin/product')
            }
            
            console.log('Product deleted successfully')
            
        } catch (error) {
            console.error('Failed to delete product:', error)
            
            // Enhanced error handling with specific error messages
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
            
            if (error.response?.status === 404) {
                alert('This product has already been deleted.')
                // Refetch to sync with server state
                refetch()
            } else {
                alert(`Failed to delete product: ${errorMessage}`)
            }
        }
    }

    const fetchMoreData = () => {
        setTimeout(() => {
            setHasMore(false)
        }, 1500)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedProduct = products.find(prod => prod._id === deleteId)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">Error loading products: {error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-0 max-w-full">
            <div className="space-y-6 px-4 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your products ({products.length} total)
                        </p>
                    </div>
                    <Link
                        href="/admin/product/add"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>

                {/* Products Grid with Infinite Scroll */}
                {filteredProducts.length > 0 ? (
                    <InfiniteScroll
                        dataLength={filteredProducts.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <FiLoader className="animate-spin h-6 w-6 text-red-600 mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm">Loading more products...</p>
                                </div>
                            </div>
                        }
                        scrollThreshold={0.8}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product._id} 
                                    onClick={() => handleCardClick(product._id)}
                                    className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden cursor-pointer hover:shadow-lg hover:border-red-200 transition-all duration-200"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-full h-64 bg-gray-50">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-4"
                                                unoptimized={true}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <FiImage className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center mb-3">
                                            <FaIndianRupeeSign className="w-4 h-4 text-green-600 mr-1" />
                                            <span className="text-xl font-bold text-green-600">
                                                {product.price}
                                            </span>
                                        </div>

                                        {/* Categories */}
                                        {product.categoryDetails && product.categoryDetails.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.categoryDetails.slice(0, 2).map((category) => (
                                                        <span
                                                            key={category._id}
                                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {category.name}
                                                        </span>
                                                    ))}
                                                    {product.categoryDetails.length > 2 && (
                                                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                            +{product.categoryDetails.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </span>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => handleEditClick(product._id, e)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={(e) => handleDeleteClick(product, e)}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Product"
                                                >
                                                    {deleteMutation.isPending && deleteId === product._id ? (
                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <FiTrash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                ) : (
                    <div className="text-center py-12">
                        <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? `No products match "${searchTerm}"` : 'Get started by creating your first product.'}
                        </p>
                        <Link
                            href="/admin/product/add"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Add Product</span>
                        </Link>
                    </div>
                )}

                {/* Delete Confirmation AlertDialog */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center space-x-2">
                                <FiAlertTriangle className="w-5 h-5 text-red-500" />
                                <span>Delete Product</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "<strong>{selectedProduct?.name}</strong>"?
                                This action cannot be undone and will permanently remove this product from your system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 className="w-4 h-4 mr-2" />
                                        Delete Product
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
