import { Worker } from "bullmq";
import env from "../../config/env.js";

const worker = new Worker(
    "test-queue",

    async (job) => {

        console.log(
            "Processing job:",
            job.name
        );

        console.log(
            "Job data:",
            job.data
        );

        // Intentionally fail the job
        throw new Error(
            "Test job failed intentionally"
        );
    },

    {
        connection: {
            url: env.redisUrl
        }
    }
);

worker.on(
    "completed",
    (job) => {

        console.log(
            `Job ${job.id} completed`
        );
    }
);

worker.on(
    "failed",
    (job, error) => {

        console.error(
            `Worker: Job ${job?.id} failed`,
        );

        console.log(
            "Error:",
            error.message
        );
    }
);

console.log(
    "Test worker is running..."
);

