import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
      .then((client) => {
        console.log('MongoDB connected successfully (development)')
        return client
      })
      .catch((error) => {
        console.error('MongoDB connection failed (development):', error)
        throw error
      })
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  console.log('Creating new MongoDB connection (production)')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then((client) => {
      console.log('MongoDB connected successfully (production)')
      return client
    })
    .catch((error) => {
      console.error('MongoDB connection failed (production):', error)
      throw error
    })
}

export default clientPromise
