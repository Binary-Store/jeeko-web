'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { FiUpload, FiX, FiLoader, FiImage, FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { productFormSchema } from '@/lib/validations/product'
import { uploadToS3 } from '@/lib/services/s3Service'
import { useProductCategories } from '@/hooks/useProductCategories'

const ProductForm = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  isEditing = false 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  
  // Fetch categories for dropdown
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useProductCategories()
  const categories = categoriesData?.data || []
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      category: initialData?.categories?.[0]?._id || initialData?.categories?.[0] || '',
      images: initialData?.images || [],
      description: initialData?.description || '',
      specifications: initialData?.specifications?.length > 0 ? initialData.specifications : [''],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications'
  })

  const watchedImages = watch('images')

  // Update image previews when images change
  useEffect(() => {
    if (watchedImages) {
      const newPreviews = watchedImages.map((img, index) => {
        if (img instanceof File) {
          return URL.createObjectURL(img)
        } else if (typeof img === 'object' && img.url) {
          return img.url
        }
        return null
      }).filter(Boolean)
      
      setImagePreviews(newPreviews)
    }
  }, [watchedImages])

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEditing) {
      reset({
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.categories?.[0]?._id || initialData.categories?.[0] || '',
        images: initialData.images || [],
        description: initialData.description || '',
        specifications: initialData.specifications?.length > 0 ? initialData.specifications : [''],
      })
    }
  }, [initialData, isEditing, reset])

  const handleImageAdd = (files) => {
    const currentImages = watch('images') || []
    const remainingSlots = 10 - currentImages.length
    
    if (remainingSlots <= 0) {
      alert('Maximum 10 images allowed')
      return
    }
    
    const newImages = Array.from(files).slice(0, remainingSlots)
    
    // Validate file size and type
    const validImages = newImages.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not a valid image.`)
        return false
      }
      return true
    })
    
    setValue('images', [...currentImages, ...validImages], { 
      shouldValidate: true, 
      shouldDirty: true 
    })
  }

  const handleImageRemove = (index) => {
    const currentImages = watch('images') || []
    const newImages = currentImages.filter((_, i) => i !== index)
    setValue('images', newImages, { shouldValidate: true, shouldDirty: true })
  }

  const handleFormSubmit = async (data) => {
    try {
      setIsUploading(true)
      setFormError('')
      setIsSubmitSuccess(false)
      
      console.log('🔄 Form submit started with data:', data)
      
      // Validate required fields
      if (!data.category) {
        throw new Error('Please select a category')
      }
      
      if (!data.images || data.images.length === 0) {
        throw new Error('Please add at least one product image')
      }
      
      // Upload images if they are Files with progress tracking
      const processedImages = await Promise.all(
        data.images.map(async (img, index) => {
          if (img instanceof File) {
            console.log(`📤 Uploading image ${index + 1}/${data.images.length} to S3...`)
            
            setUploadProgress(prev => ({ ...prev, [index]: 0 }))
            
            try {
              const imageUrl = await uploadToS3(img, (progress) => {
                setUploadProgress(prev => ({ ...prev, [index]: progress }))
              })
              
              setUploadProgress(prev => ({ ...prev, [index]: 100 }))
              
              return { url: imageUrl, alt: data.name }
            } catch (uploadError) {
              console.error(`Failed to upload image ${img.name}:`, uploadError)
              throw new Error(`Failed to upload image: ${img.name}`)
            }
          } else if (typeof img === 'object' && img.url) {
            return img
          }
          return null
        })
      )

      const validImages = processedImages.filter(Boolean)
      
      if (validImages.length === 0) {
        throw new Error('At least one valid image is required')
      }

      // Prepare submission data with enhanced validation
      const submissionData = {
        name: data.name.trim(),
        price: parseFloat(data.price),
        categories: [data.category], // Convert single category to array for API compatibility
        images: validImages,
        description: data.description.trim(),
        specifications: data.specifications
          .map(spec => spec.trim())
          .filter(spec => spec !== '') // Remove empty specifications
      }

      // Validate final data
      if (submissionData.price <= 0) {
        throw new Error('Price must be greater than 0')
      }

      console.log('📤 Final submission data:', JSON.stringify(submissionData, null, 2))
      
      await onSubmit(submissionData)
      
      setIsSubmitSuccess(true)
      
      // Reset form after successful creation (not edit)
      if (!isEditing) {
        reset()
        setImagePreviews([])
      }
      
      console.log('✅ Form submission completed successfully')
      
    } catch (error) {
      console.error('💥 Form submission error:', error)
      setFormError(error.message || 'Unknown error occurred')
      
      // Enhanced error handling
      if (error.response?.data?.error) {
        setFormError(error.response.data.error)
      } else if (error.response?.data?.details) {
        setFormError(error.response.data.details.join(', '))
      }
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  const handleAddSpecification = () => {
    if (fields.length < 20) { // Limit to 20 specifications
      append('')
    } else {
      alert('Maximum 20 specifications allowed')
    }
  }

  const handleRemoveSpecification = (index) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  // Show loading state for categories
  if (categoriesLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading form...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state for categories
  if (categoriesError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FiAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">Error loading categories: {categoriesError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
      {/* Success Message */}
      {isSubmitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
          <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <p className="text-green-800">
            Product {isEditing ? 'updated' : 'created'} successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {formError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`
              block w-full px-4 py-3 border rounded-xl shadow-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-colors duration-200
              ${errors.name 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-white'
              }
            `}
            placeholder="Enter product name"
            maxLength={100}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price * (₹)
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            min="0"
            id="price"
            className={`
              block w-full px-4 py-3 border rounded-xl shadow-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-colors duration-200
              ${errors.price 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-white'
              }
            `}
            placeholder="Enter price in rupees"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`
                  block w-full px-4 py-3 border rounded-xl shadow-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                  transition-colors duration-200
                  ${errors.category 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-white'
                  }
                `}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.category.message}
            </p>
          )}
          {categories.length === 0 && (
            <p className="mt-2 text-sm text-yellow-600">
              No categories available. Please add categories first.
            </p>
          )}
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images * (Max 10, up to 5MB each)
          </label>
          
          <div className="space-y-4">
            <div className={`
              relative border-2 border-dashed rounded-xl p-6 text-center
              transition-colors duration-200
              ${errors.images 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
              }
            `}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageAdd(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <div className="space-y-2">
                <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="text-gray-600">
                  <span className="font-medium text-red-600 hover:text-red-500">
                    Click to upload
                  </span>
                  {' or drag and drop'}
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB each
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading images...</p>
                {Object.entries(uploadProgress).map(([index, progress]) => (
                  <div key={index} className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        unoptimized={true}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        disabled={isUploading}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {errors.images && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.images.message}
            </p>
          )}
          
          <p className="mt-2 text-xs text-gray-500">
            {imagePreviews.length}/10 images added
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={5}
            maxLength={2000}
            className={`
              block w-full px-4 py-3 border rounded-xl shadow-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-colors duration-200 resize-none
              ${errors.description 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-white'
              }
            `}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.description.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {watch('description')?.length || 0}/2000 characters
          </p>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specifications
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  {...register(`specifications.${index}`)}
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={`Specification ${index + 1}`}
                  maxLength={200}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove specification"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSpecification}
              disabled={fields.length >= 20}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Specification ({fields.length}/20)</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isLoading || isUploading}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading || isUploading || (!isDirty && isEditing) || !isValid}
            className="
              flex items-center justify-center px-6 py-3 
              bg-gradient-to-r from-red-500 to-red-600 
              text-white font-medium rounded-xl
              hover:from-red-600 hover:to-red-700 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-lg hover:shadow-xl
            "
          >
            {(isLoading || isUploading) ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {isUploading ? 'Uploading Images...' : (isEditing ? 'Updating...' : 'Creating...')}
              </>
            ) : (
              <>
                <FiImage className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
