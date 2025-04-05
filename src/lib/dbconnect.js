import mongoose from 'mongoose'

let isConnected= false

const dbConnect = async () => {
  if (isConnected) {
    return
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set')
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'worktrack', 
      bufferCommands: false,
    })

    isConnected = true
    console.log('DB connected')
  } catch (err) {
    console.error('DB connection error:', err)
    throw err
  }
}

export default dbConnect
