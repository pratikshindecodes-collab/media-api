
import "dotenv/config";
import mongoose from "mongoose";
import ProcessedWebhookEvent from "./models/ProcessedWebhookEvent.js";

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const indexes = await ProcessedWebhookEvent.collection.indexes();

    console.log("Webhook indexes:");
    console.log(indexes);

    const uniqueIndex = indexes.find(
        (index) =>
            index.key?.eventId === 1 &&
            index.unique === true
    );

    console.log(
        uniqueIndex
            ? "SUCCESS: eventId unique index exists"
            : "MISSING: eventId unique index not found"
    );
} catch (error) {
    console.error("Error:", error.message);
} finally {
    await mongoose.disconnect();
}
