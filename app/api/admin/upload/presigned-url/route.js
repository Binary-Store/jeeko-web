import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function POST(request) {
  console.log('🚀 Presigned URL API route called')
  
  try {
    const body = await request.json()
    console.log('📝 Request body:', body)

    const { fileName, fileType, fileSize } = body

    // Validate required fields
    if (!fileName || !fileType || !fileSize) {
      console.error('❌ Missing required fields:', { fileName, fileType, fileSize })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fileName, fileType, fileSize' },
        { status: 400 }
      )
    }

    // Check environment variables
    const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME']
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingEnvVars.length > 0) {
      console.error('❌ Missing environment variables:', missingEnvVars)
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing AWS credentials' },
        { status: 500 }
      )
    }

    console.log('✅ Environment variables validated')

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (fileSize > maxSize) {
      console.error('❌ File too large:', { fileSize, maxSize })
      return NextResponse.json(
        { success: false, error: `File size ${(fileSize / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 5MB` },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(fileType)) {
      console.error('❌ Invalid file type:', fileType)
      return NextResponse.json(
        { success: false, error: `File type ${fileType} is not supported. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed')

    // Create S3 Client
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    })

    console.log('✅ S3 Client created')

    // Generate unique filename - UPDATED to use public folder
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `public/product-categories/${timestamp}-${randomString}-${sanitizedFileName}` // Changed path

    console.log('📁 Generated filename:', uniqueFileName)

    // Create command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    })

    console.log('🔨 PutObjectCommand created')

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    })

    console.log('✅ Presigned URL generated successfully')

    // Construct public image URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    console.log('🌐 Image URL:', imageUrl)

    return NextResponse.json({
      success: true,
      presignedUrl,
      imageUrl,
      fileName: uniqueFileName,
      expiresAt: new Date(Date.now() + 300000).toISOString()
    })

  } catch (error) {
    console.error('💥 API Route Error Details:')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate presigned URL',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
