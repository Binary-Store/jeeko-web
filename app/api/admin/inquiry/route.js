import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { inquiryApiSchema } from '@/lib/validations/inquiry'

// GET - Fetch all inquiries
export async function GET() {
  console.log('🚀 GET /admin/inquiry called')
  try {
    const client = await clientPromise
    const db = client.db()
    console.log('✅ Connected to database:', db.databaseName || 'default')
    
    const inquiries = await db
      .collection('inquiries')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    console.log('✅ Found inquiries:', inquiries.length)

    return NextResponse.json({
      success: true,
      data: inquiries,
    })
  } catch (error) {
    console.error('❌ Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

// POST - Create new inquiry
export async function POST(request) {
  console.log('🚀 POST /admin/inquiry called')
  
  try {
    const body = await request.json()
    console.log('📥 Request body received:', body)

    // Validate request body
    const validationResult = inquiryApiSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed')
    const { fullname, phonenumber, email, subject, description } = validationResult.data

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db()
    console.log('✅ Connected to database:', db.databaseName || 'default')

    // Check for duplicate inquiry (optional - you can comment this out for testing)
    console.log('🔍 Checking for duplicate inquiries...')
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const duplicateInquiry = await db
      .collection('inquiries')
      .findOne({ 
        email: email.toLowerCase(),
        subject: { $regex: new RegExp(`^${subject}$`, 'i') },
        createdAt: { $gte: oneDayAgo }
      })
    
    if (duplicateInquiry) {
      console.log('⚠️ Duplicate inquiry found')
      return NextResponse.json(
        { success: false, error: 'Similar inquiry already submitted recently. Please wait 24 hours before submitting again.' },
        { status: 409 }
      )
    }

    // Prepare inquiry data
    const inquiryData = {
      fullname: fullname.trim(),
      phonenumber: phonenumber.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      description: description.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('💾 Inserting inquiry data:', {
      ...inquiryData,
      phonenumber: '***' // Don't log sensitive data
    })

    // Insert into database
    const result = await db
      .collection('inquiries')
      .insertOne(inquiryData)

    console.log('✅ Insert result:', result)
    console.log('🆔 Inserted ID:', result.insertedId)

    // Verify insertion by fetching the document
    const newInquiry = await db
      .collection('inquiries')
      .findOne({ _id: result.insertedId })

    console.log('📄 Fetched new inquiry:', newInquiry ? 'Found' : 'Not found')

    if (!newInquiry) {
      console.error('❌ Failed to fetch inserted inquiry')
      return NextResponse.json(
        { success: false, error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }

    console.log('🎉 Inquiry created successfully with ID:', result.insertedId)

    return NextResponse.json({
      success: true,
      data: newInquiry,
      message: 'Inquiry submitted successfully. We will get back to you soon.'
    }, { status: 201 })

  } catch (error) {
    console.error('💥 Error creating inquiry:', error)
    console.error('💥 Error name:', error.name)
    console.error('💥 Error message:', error.message)
    console.error('💥 Error stack:', error.stack)
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry', details: error.message },
      { status: 500 }
    )
  }
}
