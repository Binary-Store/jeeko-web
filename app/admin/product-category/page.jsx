'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiImage, FiSearch, FiAlertTriangle } from 'react-icons/fi'
import { useProductCategories, useDeleteProductCategory } from '@/hooks/useProductCategories'
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

export default function ProductCategoryListPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const router = useRouter()

    const { data: categoriesData, isLoading, error, refetch } = useProductCategories()
    const deleteMutation = useDeleteProductCategory()

    const categories = categoriesData?.data || []

    // Handle card click to navigate to detail page
    const handleCardClick = (categoryId) => {
        router.push(`/admin/product-category/${categoryId}`)
    }

    const handleDeleteClick = (category, e) => {
        e.stopPropagation()
        setDeleteId(category._id)
        setIsDialogOpen(true)
    }

    const handleEditClick = (categoryId, e) => {
        e.stopPropagation()
        router.push(`/admin/product-category/${categoryId}/edit`)
    }

    // Enhanced delete handling following product page pattern
    const handleConfirmDelete = async () => {
        if (!deleteId) return

        const deletingId = deleteId // Store ID before clearing state

        try {
            // 1. Close dialog immediately
            setIsDialogOpen(false)
            
            // 2. Clear delete ID state to prevent stale references
            setDeleteId(null)
            
            // 3. Execute delete mutation (with optimistic updates)
            await deleteMutation.mutateAsync(deletingId)
            
            // 4. Check if user is currently viewing the deleted category's detail page
            const currentPath = window.location.pathname
            if (currentPath === `/admin/product-category/${deletingId}`) {
                // Redirect to categories list if viewing deleted category
                router.push('/admin/product-category')
            }
            
            console.log('✅ Category deleted successfully')
            
        } catch (error) {
            console.error('❌ Failed to delete category:', error)
            
            // Enhanced error handling with specific error messages
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
            
            if (error.response?.status === 404) {
                alert('This category has already been deleted.')
                // Refetch to sync with server state
                refetch()
            } else {
                alert(`Failed to delete category: ${errorMessage}`)
            }
        }
    }

    const fetchMoreData = () => {
        setTimeout(() => {
            setHasMore(false)
        }, 1500)
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedCategory = categories.find(cat => cat._id === deleteId)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">Error loading categories: {error.message}</p>
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
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your product categories ({categories.length} total)
                        </p>
                    </div>
                    <Link
                        href="/admin/product-category/add"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Category</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>

                {/* Categories Grid with Infinite Scroll */}
                {filteredCategories.length > 0 ? (
                    <InfiniteScroll
                        dataLength={filteredCategories.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <FiLoader className="animate-spin h-6 w-6 text-red-600 mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm">Loading more categories...</p>
                                </div>
                            </div>
                        }
                        endMessage={
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">
                                    🎉 You've seen all categories!
                                </p>
                            </div>
                        }
                        scrollThreshold={0.8}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map((category) => (
                                <div 
                                    key={category._id} 
                                    onClick={() => handleCardClick(category._id)}
                                    className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden cursor-pointer hover:shadow-lg hover:border-red-200 transition-all duration-200"
                                >
                                    {/* Category Image */}
                                    <div className="relative w-full h-64 bg-gray-50">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
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
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {category.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </span>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => handleEditClick(category._id, e)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={(e) => handleDeleteClick(category, e)}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Category"
                                                >
                                                    {deleteMutation.isPending && deleteId === category._id ? (
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? `No categories match "${searchTerm}"` : 'Get started by creating your first product category.'}
                        </p>
                        <Link
                            href="/admin/product-category/add"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Add Category</span>
                        </Link>
                    </div>
                )}

                {/* Delete Confirmation AlertDialog */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center space-x-2">
                                <FiAlertTriangle className="w-5 h-5 text-red-500" />
                                <span>Delete Category</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "<strong>{selectedCategory?.name}</strong>"?
                                This action cannot be undone and will permanently remove this category from your system.
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
                                        Delete Category
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
