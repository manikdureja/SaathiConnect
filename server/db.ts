import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:<password>@cluster0.9zyf5lv.mongodb.net/saathi';

let useInMemoryDB = false;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    // Set a shorter timeout for MongoDB connection
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log('MongoDB connected successfully');
    useInMemoryDB = false;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Using in-memory storage as fallback');
    useInMemoryDB = true;
  }
}

export function isMongoDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function shouldUseInMemoryDB(): boolean {
  return useInMemoryDB;
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
