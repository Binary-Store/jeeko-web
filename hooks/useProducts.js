import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/axios'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/product')
      return response.data
    },
    staleTime: 5 * 60 * 1000, 
    retry: 3,
  })
}

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/product/${id}`)
      return response.data
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.response?.status === 404) return false
      return failureCount < 3
    },
  })
}

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData) => {
      console.log('Creating product:', productData)
      
      // Ensure images are URLs
      productData.images.forEach(img => {
        if (img instanceof File) {
          throw new Error('Images should be uploaded before calling API')
        }
      })

      const response = await apiClient.post('/admin/product', {
        name: productData.name,
        price: productData.price,
        categories: productData.categories,
        images: productData.images || [],
        description: productData.description,
        specifications: productData.specifications || []
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      console.error('Create product failed:', error)
    }
  })
}

// Update product with optimistic updates
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data: productData }) => {
      console.log('Updating product:', id, productData)
      
      // Ensure images are URLs
      productData.images.forEach(img => {
        if (img instanceof File) {
          throw new Error('Images should be uploaded before calling API')
        }
      })

      const response = await apiClient.put(`/admin/product/${id}`, {
        name: productData.name,
        price: productData.price,
        categories: productData.categories,
        images: productData.images || [],
        description: productData.description,
        specifications: productData.specifications || []
      })

      return response.data
    },
    onMutate: async ({ id, data: productData }) => {
      console.log('Starting optimistic update for:', id)
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] })
      await queryClient.cancelQueries({ queryKey: ['product', id] })

      // Snapshot previous values
      const previousProducts = queryClient.getQueryData(['products'])
      const previousProduct = queryClient.getQueryData(['product', id])

      // Optimistically update individual product cache
      queryClient.setQueryData(['product', id], (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: { ...old.data, ...productData }
        }
      })

      // Optimistically update products list cache
      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map(product => 
            product._id === id 
              ? { ...product, ...productData }
              : product
          )
        }
      })

      // Return context for rollback
      return { previousProducts, previousProduct, id }
    },
    onSuccess: (data, variables) => {
      console.log('Update successful:', data)
      
      // Update cache with server response
      queryClient.setQueryData(['product', variables.id], data)
      
      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map(product => 
            product._id === variables.id ? data.data : product
          )
        }
      })

      // Invalidate queries for consistency
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
    onError: (error, variables, context) => {
      console.error('Update failed:', error)
      
      // Rollback optimistic updates
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts)
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', context.id], context.previousProduct)
      }
      
      // Show error to user
      const errorMessage = error.response?.data?.error || error.message || 'Update failed'
      console.error('Update error:', errorMessage)
    },
    onSettled: (data, error, variables) => {
      // Always invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    }
  })
}

// Delete product with optimistic updates
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting product with ID:', id)
      const response = await apiClient.delete(`/admin/product/${id}`)
      console.log('Delete API response:', response.data)
      return response.data
    },
    onMutate: async (deletedId) => {
      console.log('Starting optimistic delete for:', deletedId)
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] })

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(['products'])

      // Optimistically remove product from cache
      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData?.data) return oldData
        
        return {
          ...oldData,
          data: oldData.data.filter(product => product._id !== deletedId)
        }
      })

      // Remove individual product from cache
      queryClient.removeQueries({ queryKey: ['product', deletedId] })

      // Return context for rollback
      return { previousProducts, deletedId }
    },
    onSuccess: (data, deletedId) => {
      console.log('Delee sutccessful for product:', deletedId)
      
      // Ensure product is removed from cache
      queryClient.removeQueries({ queryKey: ['product', deletedId] })
    },
    onError: (error, deletedId, context) => {
      console.error('Delete failed:', error)
      
      // Rollback optimistic update
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts)
      }
      
      // Show error to user
      const errorMessage = error.response?.data?.error || error.message || 'Delete failed'
      console.error('Delete error:', errorMessage)
    },
    onSettled: (data, error, deletedId) => {
      // Always invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}

// Batch operations
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productIds) => {
      const promises = productIds.map(id => 
        apiClient.delete(`/admin/product/${id}`)
      )
      const results = await Promise.allSettled(promises)
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}

// Search products
export const useSearchProducts = (searchTerm) => {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/product/search?q=${encodeURIComponent(searchTerm)}`)
      return response.data
    },
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get products by category
export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/product/category/${categoryId}`)
      return response.data
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  })
}
