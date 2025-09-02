import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import Inquiry from '@/lib/models/Inquiry'

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

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    console.log('DELETE request received for inquiry ID:', id)

    if (!isValidObjectId(id)) {
      console.error('Invalid ObjectId format:', id)
      return NextResponse.json(
        { success: false, error: 'Invalid inquiry ID format' },
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
      const deletedInquiry = await Inquiry.findByIdAndDelete(id)
      
      if (!deletedInquiry) {
        console.error('Inquiry not found with ID:', id)
        return NextResponse.json(
          { success: false, error: 'Inquiry not found' },
          { status: 404 }
        )
      }

      console.log('Inquiry deleted successfully:', deletedInquiry.fullname, deletedInquiry.email)

      return NextResponse.json({
        success: true,
        message: 'Inquiry deleted successfully',
        data: deletedInquiry
      }, { status: 200 })

    } catch (deleteError) {
      console.error('Error during delete operation:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete inquiry from database' },
        { status: 500 }
      )
    }

  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in DELETE /api/inquiry/[id]:', error)
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
