import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { productCategoryApiSchema } from '@/lib/validations/productCategory'
import mongoose from 'mongoose'
import Category from '@/lib/models/ProductCategory'

// Connect to database helper
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

// Helper functions
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

// GET - Fetch single category
export async function GET(request, { params }) {
  try {
    const { id } = params
    console.log('GET request for category ID:', id)
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const category = await db
      .collection('categories')
      .findOne({ _id: new ObjectId(id) })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Category found:', category.name)

    return NextResponse.json({
      success: true,
      data: category,
    })

  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT - Update category
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log('PUT request received for category ID:', id)

    if (!isValidObjectId(id)) {
      console.error('Invalid ObjectId format:', id)
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      )
    }

    const validationResult = productCategoryApiSchema.safeParse(body)
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

    const { name, description, image } = validationResult.data

    const client = await clientPromise
    const db = client.db()

    // First verify the document exists
    const existingCategory = await db
      .collection('categories')
      .findOne({ _id: new ObjectId(id) })

    if (!existingCategory) {
      console.error('Category not found with ID:', id)
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Category found:', existingCategory.name)

    // Check for duplicates
    if (name.trim().toLowerCase() !== existingCategory.name.trim().toLowerCase()) {
      const duplicateCategory = await db
        .collection('categories')
        .findOne({ 
          name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
          _id: { $ne: new ObjectId(id) }
        })
      
      if (duplicateCategory) {
        console.error('Duplicate category name:', name)
        return NextResponse.json(
          { success: false, error: 'Category with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update the document
    const updateData = {
      name: name.trim(),
      description: description.trim(),
      image: image,
      updatedAt: new Date(),
    }

    const updateResult = await db
      .collection('categories')
      .updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updateData }
      )

    if (updateResult.matchedCount === 0) {
      console.error('Category not found during update:', id)
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Fetch the updated document
    const updatedCategory = await db
      .collection('categories')
      .findOne({ _id: new ObjectId(id) })

    if (!updatedCategory) {
      console.error('Failed to fetch updated category:', id)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated category' },
        { status: 500 }
      )
    }

    console.log('Category updated successfully:', updatedCategory.name)

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in PUT /admin/category/[id]:', error)
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

// DELETE - Delete category
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    console.log('DELETE request received for category ID:', id)

    if (!isValidObjectId(id)) {
      console.error('Invalid ObjectId format:', id)
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
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
      const deletedCategory = await Category.findByIdAndDelete(id)
      
      if (!deletedCategory) {
        console.error('Category not found with ID:', id)
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }

      console.log('Category deleted successfully:', deletedCategory.name)

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully',
        data: deletedCategory
      }, { status: 200 })

    } catch (deleteError) {
      console.error('Error during delete operation:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete category from database' },
        { status: 500 }
      )
    }

  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in DELETE /admin/category/[id]:', error)
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
