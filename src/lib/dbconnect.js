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
    const db = await mongoose.connect(process.env.MONGODB_URI)
    isConnected = mongoose.connection.readyState === 1;
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });


    mongoose.connection.on('disconnected', () => {
      isConnected = false;
    });

  } catch (err) {
    console.error('DB connection error:', err)
    throw err
  }
}

export default dbConnect
