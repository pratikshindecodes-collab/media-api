import { Worker } from "bullmq";
import env from "../../config/env.js";

const worker = new Worker(
    "notification-queue",

    async (job) => {
        console.log(
            `[START] Job ${job.id}: ${job.name}`
        );

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        console.log(`[DONE] Job ${job.id}`);

        return { success: true };
    },

    {
        connection: {
            url: env.redisUrl
        },

        concurrency: 5
    }
);

worker.on(
    "completed",
    (job,result) => {

        console.log(
            `Notification job ${job.id} completed`,
            result
        );
    }
);


worker.on(
    "failed",
    (job, error) => {

        console.error(
            `Notification job ${job?.id} failed:`,
            error.message
        );
    }
);


console.log(
    "Notification worker is running..."
)

const shutdown = async () => {

    console.log(
        "Shutting down notification worker..."
    );

    await worker.close();

    console.log(
        "Notification worker stopped"
    );

};

process.on(
    "SIGINT",
    shutdown
);

process.on(
    "SIGTERM",
    shutdown
);

