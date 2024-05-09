import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error Connection To MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
