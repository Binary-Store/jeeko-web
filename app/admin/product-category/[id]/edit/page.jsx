'use client'
import { use } from 'react' // Import React's use hook
import { useRouter } from 'next/navigation'
import { FiLoader, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import ProductCategoryForm from '@/components/admin/ProductCategoryForm'
import { useProductCategory, useUpdateProductCategory } from '@/hooks/useProductCategories'

export default function EditProductCategoryPage({ params }) {
  // Use React.use() to unwrap the params Promise
  const { id } = use(params)
  const router = useRouter()
  
  
  const { data: categoryData, isLoading, error, refetch } = useProductCategory(id)
  const updateMutation = useUpdateProductCategory()

  const handleSubmit = async (data) => {
    try {
      
      const result = await updateMutation.mutateAsync({ id, data })
      
      router.push('/admin/product-category')
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      alert(`Failed to update category: ${errorMessage}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('❌ Error loading category:', error)
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
          <p className="text-red-600">Error loading category: {error.message}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/admin/product-category"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!categoryData?.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Category not found</p>
        <Link
          href="/admin/product-category"
          className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back to Categories
        </Link>
      </div>
    )
  }


  return (
    <div className="space-y-6">
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

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">
          Update the details for "{categoryData.data.name}"
        </p>
      </div>
      
      {/* Form */}
      <ProductCategoryForm
        initialData={categoryData.data}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEditing={true}
      />
      
      {/* Error Display */}
      {updateMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">
            Failed to update category: {updateMutation.error?.response?.data?.error || updateMutation.error?.message || 'Unknown error'}
          </p>
        </div>
      )}
    </div>
  )
}
