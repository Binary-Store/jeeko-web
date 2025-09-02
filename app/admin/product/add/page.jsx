'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import ProductForm from '@/components/admin/ProductForm'
import { useCreateProduct } from '@/hooks/useProducts'

export default function AddProductPage() {
  const router = useRouter()
  const createMutation = useCreateProduct()

  const handleSubmit = async (data) => {
    try {
      console.log('Creating product with data:', data)
      await createMutation.mutateAsync(data)
      console.log('Product created successfully')
      router.push('/admin/product')
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Create a new product with images, categories, and specifications
        </p>
      </div>
      
      {/* Form */}
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        isEditing={false}
      />
      
      {/* Error Display */}
      {createMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">
            Failed to create product: {createMutation.error?.response?.data?.error || createMutation.error?.message || 'Unknown error'}
          </p>
        </div>
      )}
    </div>
  )
}
