import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters'],
  },
  phonenumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [150, 'Subject cannot exceed 150 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
})

// Create indexes
inquirySchema.index({ email: 1 })
inquirySchema.index({ createdAt: -1 })

// Prevent re-compilation in Next.js
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)

export default Inquiry
