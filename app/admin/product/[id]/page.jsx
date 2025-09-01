'use client'
import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowLeft, FiLoader, FiEdit, FiTrash2, FiCalendar, FiImage, FiAlertTriangle, FiDollarSign, FiTag, FiList } from 'react-icons/fi'
import { useProduct, useDeleteProduct } from '@/hooks/useProducts'
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

export default function ProductDetailPage({ params }) {
    const { id } = use(params)
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    
    const { data: productData, isLoading, error } = useProduct(id)
    const deleteMutation = useDeleteProduct()

    const handleEdit = () => {
        router.push(`/admin/product/${id}/edit`)
    }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(id)
            setIsDeleteDialogOpen(false)
            router.push('/admin/product')
        } catch (error) {
            console.error('Failed to delete product:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (error || !productData?.data) {
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
                    <p className="text-red-600">
                        {error ? `Error loading product: ${error.message}` : 'Product not found'}
                    </p>
                    <Link
                        href="/admin/product"
                        className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Go Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    const product = productData.data

    return (
        <div className="max-w-7xl mx-auto space-y-8">
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

            {/* Header with Actions */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                        {product.updatedAt !== product.createdAt && (
                            <div className="flex items-center space-x-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
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
                                    <span>Delete Product</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "<strong>{product.name}</strong>"? 
                                    This action cannot be undone and will permanently remove this product from your system.
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
                                            Delete Product
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Images Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <div className="space-y-4 p-6">
                            {/* Main Image */}
                            <div className="relative w-full h-96 lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden">
                                <Image
                                    src={product.images[currentImageIndex].url}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    unoptimized={true}
                                />
                            </div>
                            
                            {/* Image Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex 
                                                    ? 'border-red-500 scale-105' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={`${product.name} - ${index + 1}`}
                                                fill
                                                className="object-contain p-1"
                                                unoptimized={true}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-96 lg:h-[500px] bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <FiImage className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-500">No images available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>
                            <dl className="space-y-6">
                                <div>
                                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Name</dt>
                                    <dd className="mt-2 text-2xl font-bold text-gray-900">{product.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</dt>
                                    <dd className="mt-2 text-gray-700 leading-relaxed text-lg">{product.description}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Specifications */}
                        {product.specifications && product.specifications.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FiList className="w-5 h-5 mr-2" />
                                    Specifications
                                </h3>
                                <ul className="space-y-3">
                                    {product.specifications.map((spec, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                                            <span className="text-gray-700">{spec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price & Categories */}
                        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
                            
                            {/* Price */}
                            <div className="mb-6 p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-center">
                                    <FiDollarSign className="w-6 h-6 text-green-600 mr-1" />
                                    <span className="text-3xl font-bold text-green-600">
                                        {product.price}
                                    </span>
                                </div>
                            </div>

                            {/* Categories */}
                            {product.categoryDetails && product.categoryDetails.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                                        <FiTag className="w-4 h-4 mr-1" />
                                        Categories
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.categoryDetails.map((category) => (
                                            <span
                                                key={category._id}
                                                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                                            >
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
