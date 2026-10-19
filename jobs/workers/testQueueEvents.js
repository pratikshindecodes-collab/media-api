import { QueueEvents } from "bullmq";
import env from "../../config/env.js";

const queueEvents = new QueueEvents(
    "test-queue",
    {
        connection: {
            url: env.redisUrl
        }
    }
);

queueEvents.on(
    "completed",
    ({ jobId }) => {

        console.log(
            `Queue Event: Job ${jobId} completed`
        );
    }
);

queueEvents.on(
    "failed",
    ({ jobId, failedReason }) => {

        console.error(
            `Queue Event: Job ${jobId} failed`
        );

        console.error(
            "Reason:",
            failedReason
        );
    }
);

console.log(
    "Queue events monitor is running..."
);