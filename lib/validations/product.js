import { z } from 'zod'

// Form schema for client-side validation (single category)
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .trim(),
  price: z
    .union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => !isNaN(val) && val > 0, 'Price must be a positive number'),
  category: z
    .string()
    .min(1, 'Category is required'),
  images: z
    .array(z.union([
      z.instanceof(File),
      z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().optional()
      })
    ]))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  description: z
    .string()
    .min(1, 'Product description is required')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  specifications: z
    .array(z.string().trim())
    .default([])
})

// API schema for server-side validation (accepts categories array)
export const productApiSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  price: z.number().positive('Price must be positive'),
  categories: z.array(
    z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category ID format')
  ).min(1, 'At least one category is required'),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    alt: z.string().optional()
  })).min(1, 'At least one image required').max(10, 'Maximum 10 images allowed'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').trim(),
  specifications: z.array(z.string()).default([])
})
