import notificationQueue from "./notificationQueue.js";

const removeJob = async () => {
    const jobId = process.argv[2];

    if (!jobId) {
        console.error(
            "Usage: node jobs/queues/removeNotificationJob.js <jobId>"
        );
        process.exitCode = 1;
        return;
    }
    
    try {
        const job = await notificationQueue.getJob(jobId);

        if (!job) {
            console.log("Job not found or already removed.");
            return;
        }

        const state = await job.getState();

        if (state !== "failed" && state !== "completed") {
            console.log(
                `Job is '${state}'. Only failed/completed jobs can be removed by this script.`
            );
            return;
        }

        await job.remove();
        console.log(`Removed job ${jobId}`);
    } catch (error) {
        console.error("Job removal failed:", error.message);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

removeJob();

