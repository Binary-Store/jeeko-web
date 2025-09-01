'use client'
import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowLeft, FiLoader, FiEdit, FiTrash2, FiCalendar, FiImage, FiAlertTriangle } from 'react-icons/fi'
import { useProductCategory, useDeleteProductCategory } from '@/hooks/useProductCategories'
import { useRouter } from 'next/navigation'
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

export default function ProductCategoryDetailPage({ params }) {
    const { id } = use(params)
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    
    const { data: categoryData, isLoading, error } = useProductCategory(id)
    const deleteMutation = useDeleteProductCategory()

    const handleEdit = () => {
        router.push(`/admin/product-category/${id}/edit`)
    }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(id)
            setIsDeleteDialogOpen(false)
            router.push('/admin/product-category')
        } catch (error) {
            console.error('Failed to delete category:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading category details...</p>
                </div>
            </div>
        )
    }

    if (error || !categoryData?.data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/product-category"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Categories</span>
                    </Link>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600">
                        {error ? `Error loading category: ${error.message}` : 'Category not found'}
                    </p>
                    <Link
                        href="/admin/product-category"
                        className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Go Back to Categories
                    </Link>
                </div>
            </div>
        )
    }

    const category = categoryData.data

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/product-category"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Categories</span>
                </Link>
            </div>

            {/* Header with Actions */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                        </div>
                        {category.updatedAt !== category.createdAt && (
                            <div className="flex items-center space-x-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                    </button>

                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <button
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                            >
                                <FiTrash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center space-x-2">
                                    <FiAlertTriangle className="w-5 h-5 text-red-500" />
                                    <span>Delete Category</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "<strong>{category.name}</strong>"? 
                                    This action cannot be undone and will permanently remove this category from your system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDelete}
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

            {/* Main Content - Updated Design */}
            <div className="space-y-8">
                {/* Hero Image Section - Full Width */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                    {category.image ? (
                        <div className="relative w-full h-96 lg:h-[500px] bg-gray-50">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-contain" // Changed from object-cover to object-contain
                                unoptimized={true}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-96 lg:h-[500px] bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <FiImage className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-500">No image available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Information</h2>
                            <dl className="space-y-6">
                                <div>
                                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Category Name</dt>
                                    <dd className="mt-2 text-2xl font-bold text-gray-900">{category.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</dt>
                                    <dd className="mt-2 text-gray-700 leading-relaxed text-lg">{category.description}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
