'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/axios'

// Fetch all categories
export const useProductCategories = () => {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/product-category')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Fetch single category
export const useProductCategory = (id) => {
  return useQuery({
    queryKey: ['productCategory', id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/product-category/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create category - simplified without file upload logic
export const useCreateProductCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData) => {
      console.log('Sending to API:', categoryData)
      
      // Ensure image is always a string
      if (categoryData.image instanceof File) {
        throw new Error('File should be uploaded before calling API')
      }

      const response = await apiClient.post('/admin/product-category', {
        name: categoryData.name,
        description: categoryData.description,
        image: categoryData.image || '', // Ensure it's a string
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['productCategories'])
    },
  })
}

// Update category - simplified
export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data: categoryData }) => {
      console.log('Updating category:', id, categoryData)
      
      // Ensure image is always a string
      if (categoryData.image instanceof File) {
        throw new Error('File should be uploaded before calling API')
      }

      const response = await apiClient.put(`/admin/product-category/${id}`, {
        name: categoryData.name,
        description: categoryData.description,
        image: categoryData.image || '',
      })

      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['productCategories'])
      queryClient.invalidateQueries(['productCategory', variables.id])
    },
  })
}

// Delete category
export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      console.log('🗑️ Deleting category with ID:', id)
      const response = await apiClient.delete(`/admin/product-category/${id}`)
      console.log('✅ Delete API response:', response.data)
      return response.data
    },
    onSuccess: (data, deletedId) => {
      console.log('🎉 Delete successful, invalidating queries')
      
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ['productCategories'] })
      
      // Remove the deleted item from cache immediately
      queryClient.setQueryData(['productCategories'], (oldData) => {
        if (!oldData?.data) return oldData
        
        return {
          ...oldData,
          data: oldData.data.filter(category => category._id !== deletedId)
        }
      })
      
      // Also invalidate the specific category query
      queryClient.invalidateQueries({ queryKey: ['productCategory', deletedId] })
    },
    onError: (error, deletedId) => {
      console.error('❌ Delete failed:', error)
      console.error('Failed to delete category ID:', deletedId)
      
      // Optionally refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['productCategories'] })
    }
  })
}