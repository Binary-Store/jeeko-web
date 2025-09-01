'use client'
import { useRouter } from 'next/navigation'
import { useCreateProductCategory } from '@/hooks/useProductCategories'
import ProductCategoryForm from '@/components/admin/ProductCategoryForm'

export default function AddProductCategoryPage() {
  const router = useRouter()
  const createMutation = useCreateProductCategory()

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data)
      router.push('/admin/product-category')
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-600 mt-2">Create a new product category</p>
      </div>
      
      <ProductCategoryForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
      
      {createMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">
            {createMutation.error?.response?.data?.error || 'Failed to create category'}
          </p>
        </div>
      )}
    </div>
  )
}
