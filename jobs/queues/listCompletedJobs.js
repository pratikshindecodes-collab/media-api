import notificationQueue from "./notificationQueue.js";

const listCompletedJobs = async () => {
    try {
        const jobs = await notificationQueue.getCompleted(0, 19);

        if (jobs.length === 0) {
            console.log("No retained completed jobs.");
            return;
        }

        for (const job of jobs) {
            console.log({
                id: job.id,
                name: job.name,
                data: job.data,
                attemptsMade: job.attemptsMade
            });
        }
    } catch (error) {
        console.error("Could not list jobs:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

listCompletedJobs();
