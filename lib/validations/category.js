import { z } from 'zod'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  image: z
    .any()
    .refine((files) => {
      // If it's an edit form and no new file is selected, allow empty
      if (!files || files.length === 0) return true
      return files[0]?.size <= MAX_FILE_SIZE
    }, 'Max file size is 5MB')
    .refine((files) => {
      // If it's an edit form and no new file is selected, allow empty
      if (!files || files.length === 0) return true
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type)
    }, 'Only .jpg, .jpeg, .png and .webp formats are supported')
})

export const categoryUpdateSchema = categorySchema.partial()
