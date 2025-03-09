import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectDB = async () => {
    try {
        const uri = process.env.DB_URI; // Use DB_URI instead of MONGO_URI
        if (!uri) {
            throw new Error("DB_URI is not defined in the .env file");
        }
        await mongoose.connect(uri, {
        });
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};
