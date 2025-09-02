'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/axios'

// Fetch all inquiries
export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/inquiry')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

// Create new inquiry
export const useCreateInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inquiryData) => {
      console.log('Creating inquiry:', inquiryData)
      
      // Send data directly without wrapping in another object
      const response = await apiClient.post('/admin/inquiry', inquiryData)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Inquiry created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
    onError: (error) => {
      console.error('Create inquiry failed:', error)
      throw error // Re-throw to let the form handle the error
    }
  })
}

// Delete inquiry with optimistic updates
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting inquiry with ID:', id)
      const response = await apiClient.delete(`/admin/inquiry/${id}`)
      console.log('Delete API response:', response.data)
      return response.data
    },
    onMutate: async (deletedId) => {
      console.log('Starting optimistic delete for:', deletedId)
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['inquiries'] })

      // Snapshot previous value
      const previousInquiries = queryClient.getQueryData(['inquiries'])

      // Optimistically remove inquiry from cache
      queryClient.setQueryData(['inquiries'], (oldData) => {
        if (!oldData?.data) return oldData
        
        return {
          ...oldData,
          data: oldData.data.filter(inquiry => inquiry._id !== deletedId)
        }
      })

      // Remove individual inquiry from cache
      queryClient.removeQueries({ queryKey: ['inquiry', deletedId] })

      // Return context for rollback
      return { previousInquiries, deletedId }
    },
    onSuccess: (data, deletedId) => {
      console.log('Delete successful for inquiry:', deletedId)
      
      // Ensure inquiry is removed from cache
      queryClient.removeQueries({ queryKey: ['inquiry', deletedId] })
    },
    onError: (error, deletedId, context) => {
      console.error('Delete failed:', error)
      
      // Rollback optimistic update
      if (context?.previousInquiries) {
        queryClient.setQueryData(['inquiries'], context.previousInquiries)
      }
      
      // Show error to user
      const errorMessage = error.response?.data?.error || error.message || 'Delete failed'
      console.error('Delete error:', errorMessage)
    },
    onSettled: (data, error, deletedId) => {
      // Always invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    }
  })
}

// Get single inquiry by ID
export const useInquiry = (id) => {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/inquiry/${id}`)
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

// Update inquiry (bonus hook for future use)
export const useUpdateInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/admin/inquiry/${id}`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      // Update the individual inquiry cache
      queryClient.setQueryData(['inquiry', variables.id], data)
      
      // Update the inquiries list cache
      queryClient.setQueryData(['inquiries'], (oldData) => {
        if (!oldData?.data) return oldData
        
        return {
          ...oldData,
          data: oldData.data.map(inquiry => 
            inquiry._id === variables.id ? data.data : inquiry
          )
        }
      })
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
      queryClient.invalidateQueries({ queryKey: ['inquiry', variables.id] })
    },
    onError: (error) => {
      console.error('Update inquiry failed:', error)
      throw error
    }
  })
}

// Search inquiries (bonus hook for future use)
export const useSearchInquiries = (searchTerm) => {
  return useQuery({
    queryKey: ['inquiries', 'search', searchTerm],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/inquiry/search?q=${encodeURIComponent(searchTerm)}`)
      return response.data
    },
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Bulk delete inquiries (bonus hook for future use)
export const useBulkDeleteInquiries = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inquiryIds) => {
      const promises = inquiryIds.map(id => 
        apiClient.delete(`/admin/inquiry/${id}`)
      )
      const results = await Promise.allSettled(promises)
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    }
  })
}
