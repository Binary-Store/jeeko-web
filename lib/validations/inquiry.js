import { z } from 'zod'

// Phone number regex - supports various international formats
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/

// Schema for form validation (plain string inputs)
export const inquiryFormSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  
  phonenumber: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(150, 'Subject must be less than 150 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
})

// Schema for API validation (same as form for inquiries)
export const inquiryApiSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  
  phonenumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(150, 'Subject must be less than 150 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
})

// For partial updates if needed
export const inquiryUpdateSchema = inquiryFormSchema.partial()

// Legacy export for backward compatibility
export const inquirySchema = inquiryFormSchema
