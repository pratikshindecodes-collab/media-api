import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
    try {
        mongoose.set(
            "autoIndex",
            process.env.NODE_ENV !== "production"
        )
        await mongoose.connect(env.mongoUri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;