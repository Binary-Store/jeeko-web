'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiLoader, FiAlertCircle, FiCheckCircle, FiSend, FiUser, FiPhone, FiMail, FiMessageCircle, FiEdit } from 'react-icons/fi'
import { inquiryFormSchema } from '@/lib/validations/inquiry'
import { useCreateInquiry } from '@/hooks/useInquiry'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function InquiriesForm({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  isEditing = false,
  showTitle = true,
  className = ''
}) {
  const [formError, setFormError] = useState('')
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  
  const createMutation = useCreateInquiry()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isDirty, isValid, isSubmitting: formSubmitting },
  } = useForm({
    resolver: zodResolver(inquiryFormSchema),
    mode: 'onChange',
    defaultValues: {
      fullname: initialData?.fullname || '',
      phonenumber: initialData?.phonenumber || '',
      email: initialData?.email || '',
      subject: initialData?.subject || '',
      description: initialData?.description || '',
    }
  })

  // Watch for character counts
  const watchedDescription = watch('description')
  const watchedSubject = watch('subject')

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEditing) {
      reset({
        fullname: initialData.fullname || '',
        phonenumber: initialData.phonenumber || '',
        email: initialData.email || '',
        subject: initialData.subject || '',
        description: initialData.description || '',
      })
    }
  }, [initialData, isEditing, reset])

  // Clear success message after 5 seconds
  useEffect(() => {
    if (isSubmitSuccess) {
      const timer = setTimeout(() => {
        setIsSubmitSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitSuccess])

  const handleFormSubmit = async (data) => {
    try {
      setFormError('')
      setIsSubmitSuccess(false)
      
      console.log('🔄 Form submit started with data:', data)
      
      // Prepare submission data
      const submissionData = {
        fullname: data.fullname.trim(),
        phonenumber: data.phonenumber.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        description: data.description.trim(),
      }

      console.log('📤 Final submission data:', JSON.stringify(submissionData, null, 2))
      
      if (onSubmit) {
        // Custom submit handler
        await onSubmit(submissionData)
      } else {
        // Create new inquiry using the hook
        const result = await createMutation.mutateAsync(submissionData)
        console.log('✅ Mutation result:', result)
      }
      
      setIsSubmitSuccess(true)
      
      // Reset form after successful creation (not edit)
      if (!isEditing) {
        reset()
      }
      
      console.log('✅ Form submission completed successfully')
      
    } catch (error) {
      console.error('💥 Form submission error:', error)
      
      // Enhanced error handling
      let errorMessage = 'Unknown error occurred'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.details) {
        errorMessage = Array.isArray(error.response.data.details) 
          ? error.response.data.details.join(', ')
          : error.response.data.details
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setFormError(errorMessage)
    }
  }

  const isSubmittingForm = isLoading || createMutation.isPending || formSubmitting

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      <div className="p-6 sm:p-8">
        {showTitle && (
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? 'Update Inquiry' : 'Send us a message'}
            </h2>
            <p className="text-gray-600">
              {isEditing ? 'Update your inquiry details below' : 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
            </p>
          </div>
        )}

        {/* Success Message */}
        {isSubmitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
            <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">
                {isEditing ? 'Inquiry Updated Successfully!' : 'Message Sent Successfully!'}
              </p>
              <p className="text-green-700 text-sm mt-1">
                {isEditing 
                  ? 'Your inquiry has been updated successfully.'
                  : 'Thank you for contacting us. We\'ll get back to you soon!'
                }
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
            <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Submission Failed</p>
              <p className="text-red-700 text-sm mt-1">{formError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullname" className="flex items-center text-sm font-medium text-gray-700">
              <FiUser className="w-4 h-4 mr-2 text-gray-500" />
              Full Name *
            </label>
            <Input
              {...register('fullname')}
              type="text"
              id="fullname"
              placeholder="Enter your full name"
              className={`
                w-full transition-all duration-200
                ${errors.fullname 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                }
              `}
              maxLength={100}
              disabled={isSubmittingForm}
            />
            {errors.fullname && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors.fullname.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phonenumber" className="flex items-center text-sm font-medium text-gray-700">
              <FiPhone className="w-4 h-4 mr-2 text-gray-500" />
              Phone Number *
            </label>
            <Input
              {...register('phonenumber')}
              type="tel"
              id="phonenumber"
              placeholder="Enter your phone number"
              className={`
                w-full transition-all duration-200
                ${errors.phonenumber 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                }
              `}
              maxLength={20}
              disabled={isSubmittingForm}
            />
            {errors.phonenumber && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors.phonenumber.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
              <FiMail className="w-4 h-4 mr-2 text-gray-500" />
              Email Address *
            </label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email address"
              className={`
                w-full transition-all duration-200
                ${errors.email 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                }
              `}
              maxLength={100}
              disabled={isSubmittingForm}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="flex items-center text-sm font-medium text-gray-700">
              <FiEdit className="w-4 h-4 mr-2 text-gray-500" />
              Subject *
            </label>
            <Input
              {...register('subject')}
              type="text"
              id="subject"
              placeholder="Enter the subject of your inquiry"
              className={`
                w-full transition-all duration-200
                ${errors.subject 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                }
              `}
              maxLength={150}
              disabled={isSubmittingForm}
            />
            <div className="flex justify-between items-center">
              {errors.subject ? (
                <p className="text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.subject.message}
                </p>
              ) : (
                <div></div>
              )}
              <p className="text-xs text-gray-500">
                {watchedSubject?.length || 0}/150
              </p>
            </div>
          </div>

          {/* Message/Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
              <FiMessageCircle className="w-4 h-4 mr-2 text-gray-500" />
              Message *
            </label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Tell us more about your inquiry. Please provide as much detail as possible so we can assist you better."
              className={`
                w-full min-h-[120px] transition-all duration-200 resize-none
                ${errors.description 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                }
              `}
              rows={5}
              maxLength={1000}
              disabled={isSubmittingForm}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Please provide detailed information to help us assist you better
                </p>
              )}
              <p className="text-xs text-gray-500">
                {watchedDescription?.length || 0}/1000
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmittingForm || (!isDirty && isEditing) || !isValid}
              className={`
                w-full flex items-center justify-center py-3 px-6 text-base font-medium
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                disabled:from-gray-400 disabled:to-gray-500
                disabled:cursor-not-allowed disabled:opacity-75
                text-white rounded-lg shadow-lg hover:shadow-xl
                transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${!isSubmittingForm && isValid && isDirty ? 'hover:scale-[1.02]' : ''}
              `}
            >
              {isSubmittingForm ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  {isEditing ? 'Updating...' : 'Sending Message...'}
                </>
              ) : (
                <>
                  <FiSend className="mr-3 h-5 w-5" />
                  {isEditing ? 'Update Inquiry' : 'Send Message'}
                </>
              )}
            </Button>
          </div>

          {/* Form Helper Text */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our terms of service and privacy policy.
              We'll only use your information to respond to your inquiry.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
