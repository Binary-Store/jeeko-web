'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { FiUpload, FiX, FiLoader, FiImage } from 'react-icons/fi'
import { productCategoryFormSchema } from '@/lib/validations/productCategory'
import { uploadToS3 } from '@/lib/services/s3Service'

const ProductCategoryForm = ({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  isEditing = false 
}) => {
  const [imagePreview, setImagePreview] = useState(initialData?.image || null)
  const [isUploading, setIsUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productCategoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
    }
  })

  const watchedImage = watch('image')

  // Update image preview when image changes
  useEffect(() => {
    if (watchedImage instanceof File) {
      const objectUrl = URL.createObjectURL(watchedImage)
      setImagePreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else if (typeof watchedImage === 'string' && watchedImage) {
      setImagePreview(watchedImage)
    } else {
      setImagePreview(null)
    }
  }, [watchedImage])

  const handleImageChange = (file) => {
    if (file) {
      setValue('image', file, { shouldValidate: true, shouldDirty: true })
    }
  }

  const removeImage = () => {
    setValue('image', '', { shouldValidate: true, shouldDirty: true })
    setImagePreview(null)
  }

  // Handle form submission with file upload
  const handleFormSubmit = async (data) => {
    try {
      setIsUploading(true)
      console.log('🔄 Form submit started with data:', data)
      
      // Step 1: Handle image upload if needed
      let imageUrl = data.image
      
      if (data.image instanceof File) {
        console.log('📤 Uploading image file to S3...')
        try {
          imageUrl = await uploadToS3(data.image)
          console.log('✅ Image uploaded successfully, URL:', imageUrl)
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError)
          alert('Failed to upload image: ' + uploadError.message)
          return
        }
      }

      // Step 2: Validate the image URL
      if (!imageUrl || typeof imageUrl !== 'string') {
        console.error('❌ Invalid image URL:', imageUrl)
        alert('Image upload failed - no valid URL received')
        return
      }

      // Step 3: Prepare clean data object
      const submissionData = {
        name: data.name?.trim(),
        description: data.description?.trim(),
        image: imageUrl
      }

      console.log('📤 Final submission data:', JSON.stringify(submissionData, null, 2))
      
      // Step 4: Submit to parent component
      await onSubmit(submissionData)
      
    } catch (error) {
      console.error('💥 Form submission error:', error)
      alert('Failed to save category: ' + (error.message || 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
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
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className={`
              block w-full px-4 py-3 border rounded-xl shadow-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-colors duration-200 resize-none
              ${errors.description 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-white'
              }
            `}
            placeholder="Enter category description"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Upload - FIXED IMAGE PREVIEW */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image *
          </label>
          
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <div className="space-y-4">
                <div className={`
                  relative border-2 border-dashed rounded-xl p-6 text-center
                  transition-colors duration-200
                  ${errors.image 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                  }
                `}>
                  <input
                    ref={ref}
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageChange(file)
                        onChange(file)
                      }
                    }}
                    onBlur={onBlur}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>

                {/* FIXED: Image Preview - Updated container and styling */}
                {imagePreview && (
                  <div className="relative">
                    <div className="relative w-full h-64 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Category preview"
                        fill
                        className="object-contain p-4" // Changed from object-cover to object-contain with padding
                        unoptimized={true}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Preview of your uploaded image
                    </p>
                  </div>
                )}
              </div>
            )}
          />
          
          {errors.image && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading || isUploading || (!isDirty && isEditing)}
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
                {isUploading ? 'Uploading Image...' : (isEditing ? 'Updating...' : 'Creating...')}
              </>
            ) : (
              <>
                <FiImage className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Category' : 'Create Category'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductCategoryForm
