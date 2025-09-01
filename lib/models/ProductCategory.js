import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
}, {
  timestamps: true,
})

// Create indexes
categorySchema.index({ name: 1 })

// Prevent re-compilation in Next.js
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category
