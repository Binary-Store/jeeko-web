import { z } from 'zod'

// Schema for form validation (allows File objects)
export const productCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  image: z
    .union([
      z.string().url('Please provide a valid image URL'),
      z.instanceof(File, { message: 'Please select a valid image file' }),
      z.string().min(0) // Allow empty string
    ])
    .refine((val) => {
      if (val instanceof File) {
        return val.type.startsWith('image/') && val.size <= 5 * 1024 * 1024 // 5MB
      }
      return true
    }, 'Image must be less than 5MB and be a valid image file'),
})

// Schema for API validation (only accepts strings)
export const productCategoryApiSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  image: z
    .string()
    .min(1, 'Image URL is required')
})

// Legacy export for backward compatibility
export const productCategorySchema = productCategoryFormSchema
