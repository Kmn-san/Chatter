import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("💣 MongoDB connection error");
        process.exit(1)//exit with failure
    }
}