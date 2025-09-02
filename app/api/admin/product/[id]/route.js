import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { productApiSchema } from '@/lib/validations/product'
import mongoose from 'mongoose'
import Product from '@/lib/models/product'

async function connectDB() {
  try {
    const client = await clientPromise

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      })
    }
    
    return client.db()
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

function isValidObjectId(id) {
  return id && ObjectId.isValid(id) && id.length === 24
}

function errorResponse(message, status = 500, additionalData = {}) {
  console.error(`API Error (${status}):`, message, additionalData)
  return NextResponse.json({ 
    success: false, 
    error: message,
    ...additionalData
  }, { status })
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    console.log('GET request for product ID:', id)
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    
    const products = await db
      .collection('products')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
          }
        },
        { $limit: 1 }
      ])
      .toArray()

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('Product found:', products[0].name)

    return NextResponse.json({
      success: true,
      data: products[0]
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log('PUT request received for product ID:', id)

    if (!isValidObjectId(id)) {
      console.error('Invalid ObjectId format:', id)
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      )
    }

    const validationResult = productApiSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    const { name, price, categories, images, description, specifications } = validationResult.data

    const client = await clientPromise
    const db = client.db()

    const existingProduct = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) })

    if (!existingProduct) {
      console.error('Product not found with ID:', id)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('Product found:', existingProduct.name)

    if (name.trim().toLowerCase() !== existingProduct.name.trim().toLowerCase()) {
      const duplicateProduct = await db
        .collection('products')
        .findOne({ 
          name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
          _id: { $ne: new ObjectId(id) }
        })
      
      if (duplicateProduct) {
        console.error('Duplicate product name:', name)
        return NextResponse.json(
          { success: false, error: 'Product with this name already exists' },
          { status: 409 }
        )
      }
    }

    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      categories: categories.map(catId => new ObjectId(catId)),
      images: images.map(img => ({
        url: img.url,
        alt: img.alt || name.trim()
      })),
      description: description.trim(),
      specifications: specifications
        .map(spec => spec.trim())
        .filter(spec => spec !== ''),
      updatedAt: new Date()
    }

    const updateResult = await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

    if (updateResult.matchedCount === 0) {
      console.error('Product not found during update:', id)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const updatedProducts = await db
      .collection('products')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
          }
        },
        { $limit: 1 }
      ])
      .toArray()

    if (!updatedProducts || updatedProducts.length === 0) {
      console.error('Failed to fetch updated product:', id)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated product' },
        { status: 500 }
      )
    }

    console.log('Product updated successfully:', updatedProducts[0].name)

    return NextResponse.json({
      success: true,
      data: updatedProducts[0]
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in PUT /admin/product/[id]:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    console.log('DELETE request received for product ID:', id)

    if (!isValidObjectId(id)) {
      console.error('Invalid ObjectId format:', id)
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      )
    }

    try {
      await connectDB()
      console.log('Database connected successfully')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }

    try {
      const deletedProduct = await Product.findByIdAndDelete(id)
      
      if (!deletedProduct) {
        console.error('Product not found with ID:', id)
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        )
      }

      console.log('Product deleted successfully:', deletedProduct.name)

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
      }, { status: 200 })

    } catch (deleteError) {
      console.error('Error during delete operation:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete product from database' },
        { status: 500 }
      )
    }

  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in DELETE /admin/product/[id]:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}
