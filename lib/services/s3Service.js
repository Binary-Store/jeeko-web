import apiClient from '@/utils/axios'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3 Client configuration
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
  maxAttempts: 3,
  retryMode: 'standard',
})

// MAKE SURE TO EXPORT THIS FUNCTION
export const uploadToS3 = async (file) => {
  try {
    console.log('🔄 Starting S3 upload for:', file.name, file.type, file.size)

    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided')
    }

    // Get presigned URL from API
    const response = await apiClient.post('/admin/upload/presigned-url', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })

    console.log('📡 Presigned URL API response:', response.data)

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to get presigned URL')
    }

    const { presignedUrl, imageUrl } = response.data

    // Upload to S3
    console.log('📤 Uploading to S3...')
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => 'Unknown error')
      throw new Error(`S3 upload failed: ${uploadResponse.status} ${errorText}`)
    }

    console.log('✅ S3 upload successful, returning URL:', imageUrl)
    return imageUrl

  } catch (error) {
    console.error('❌ S3 upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

// Export other functions as well
export const generatePresignedUrl = async (fileName, fileType, options = {}) => {
  try {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `public/${timestamp}-${randomString}-${sanitizedFileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': fileName,
      },
      // Removed ACL to fix the AccessControlListNotSupported error
      ...options,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    })

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    return { 
      presignedUrl, 
      imageUrl, 
      fileName: uniqueFileName,
      expiresAt: new Date(Date.now() + 300000).toISOString()
    }
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw new Error(`Failed to generate presigned URL: ${error.message}`)
  }
}

export const validateS3Config = () => {
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET_NAME'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  return true
}

export const deleteFromS3 = async (fileName) => {
  try {
    const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3')
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}
