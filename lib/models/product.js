import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one category is required']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: 2000
  },
  specifications: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Index for search optimization
productSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
