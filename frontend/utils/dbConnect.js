import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL;

const dbConnect = async () => {
  if (!mongoUrl) {
    throw new Error('Please define the MONGO_URL environment variable');
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
