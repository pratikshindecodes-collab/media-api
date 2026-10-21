import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected successfully");
};

export default connectDB;