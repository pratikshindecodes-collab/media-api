import { Worker } from "bullmq";
import env from "../../config/env.js";

const worker = new Worker(
    "webhook-queue",
    async (job) => {
        const { eventId, eventType, data } = job.data;

        console.log("Processing webhook:", eventId);
        console.log("Event type:", eventType);

        console.log("Event data:", data);

        return {
            success: true,
            eventId,
            processedAt: new Date().toISOString()
        };
    },

    {
        connection: { url: env.redisUrl },
        concurrency: 5
    }
);

worker.on("completed", (job, result) => {
    console.log("Webhook job completed:", job.id, result);
});

worker.on("failed", (job, error) => {
    console.log("Webhook job failed:", job?.id, error.message);
});

console.log("Webhook worker is running...");

const shutdown = async () => {
    await worker.close();
    console.log("Webhook worker stopped");
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

