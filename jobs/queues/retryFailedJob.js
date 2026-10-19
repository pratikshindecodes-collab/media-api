import notificationQueue from "./notificationQueue.js";

const retryFailedJob = async () => {
    const jobId = process.argv[2];

    if (!jobId) {
        console.error(
            "Usage: node jobs/queues/retryFailedJob.js <jobId>"
        );
        process.exitCode = 1;
        return;
    }

    try {
        const job = await notificationQueue.getJob(jobId);

        if (!job) {
            console.log("Job not found.");
            return;
        }

        const state = await job.getState();

        if (state !== "failed") {
            console.log(`Job is '${state}', not 'failed'.`);
            return;
        }

        await job.retry();

        console.log(`Job ${jobId} moved for retry.`);
    } catch (error) {
        console.error("Retry failed:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

retryFailedJob();