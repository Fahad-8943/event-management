import mongoose from "mongoose";

const connectionString = process.env.DB_CONNECTION_URL as string;
export const connectDB = async () => {
  try {
    if (!connectionString) {
      throw new Error("DB_CONNECTION_URL is not configured");
    }
    await mongoose.connect(connectionString);
    console.log("DB connection successfull");
  } catch (error) {
    console.log("DB connection failed");
    console.log(error);
    throw error;
  }
};
