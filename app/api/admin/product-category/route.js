import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { productCategoryApiSchema } from '@/lib/validations/productCategory' // ← FIXED: Use API schema

// GET - Fetch all categories
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const categories = await db
      .collection('categories')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - Create new category (with debugging)
export async function POST(request) {
  console.log('API POST route called')
  
  try {
    // Step 1: Parse request body
    console.log('Parsing request body...')
    const body = await request.json()
    console.log('Request body received:', JSON.stringify(body, null, 2))

    // Step 2: Validate environment variables
    console.log('Checking environment variables...')
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found!')
      return NextResponse.json(
        { success: false, error: 'Database configuration missing' },
        { status: 500 }
      )
    }
    console.log('MONGODB_URI found:', process.env.MONGODB_URI.substring(0, 20) + '...')

    console.log('Validating data with Zod...')
    const validationResult = productCategoryApiSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }
    console.log('Validation passed')

    const { name, description, image } = validationResult.data

    // Step 4: Connect to MongoDB
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db()
    console.log('MongoDB connected successfully')

    // Step 5: Check for existing category
    console.log('Checking for existing category...')
    const existingCategory = await db
      .collection('categories')
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    
    if (existingCategory) {
      console.log('Category already exists:', name)
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    // Step 6: Create new category
    console.log('Creating new category...')
    const newCategory = {
      name,
      description,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db
      .collection('categories')
      .insertOne(newCategory)

    console.log('Category created successfully:', result.insertedId)

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        ...newCategory,
      },
    })

  } catch (error) {
    // CRITICAL: Log full error details
    console.error('API Route Error - Full Details:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error cause:', error.cause)
    console.error('Full error object:', error)

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
