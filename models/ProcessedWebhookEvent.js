
import mongoose from "mongoose";

const processedWebhookEventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true
        },
        eventType: {
            type: String,
            required: true
        },
        processedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const ProcessedWebhookEvent = mongoose.model(
    "ProcessedWebhookEvent",
    processedWebhookEventSchema
);

export default ProcessedWebhookEvent;
