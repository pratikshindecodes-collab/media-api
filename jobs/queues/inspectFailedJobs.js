import notificationQueue from "./notificationQueue.js";

const inspectFailedJobs = async () => {
    try {
        const jobs = await notificationQueue.getFailed(0, 19);

        if (jobs.length === 0) {
            console.log("No failed jobs found.");
            return;
        }

        for (const job of jobs) {
            console.log({
                id: job.id,
                name: job.name,
                data: job.data,
                failedReason: job.failedReason,
                attemptsMade: job.attemptsMade
            });
        }
    } catch (error) {
        console.error("Could not inspect failed jobs:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

inspectFailedJobs();

