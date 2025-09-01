import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { productApiSchema } from '@/lib/validations/product'

// GET - Fetch all products
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const products = await db
      .collection('products')
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const body = await request.json()
    console.log('POST request received for product creation:', body)

    // Validate request body
    const validationResult = productApiSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { name, price, categories, images, description, specifications } = validationResult.data

    const client = await clientPromise
    const db = client.db()

    // Check for duplicate name
    const duplicateProduct = await db
      .collection('products')
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    
    if (duplicateProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this name already exists' },
        { status: 409 }
      )
    }

    // Convert category IDs to ObjectId
    const categoryObjectIds = categories.map(id => new ObjectId(id))

    // Prepare product data
    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      categories: categoryObjectIds,
      images: images.map(img => ({
        url: img.url,
        alt: img.alt || name
      })),
      description: description.trim(),
      specifications: specifications.map(spec => spec.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('Creating product with data:', productData)

    const result = await db
      .collection('products')
      .insertOne(productData)

    const newProduct = await db
      .collection('products')
      .findOne({ _id: result.insertedId })

    console.log('Product created successfully')

    return NextResponse.json({
      success: true,
      data: newProduct,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
