import notificationQueue from "./notificationQueue.js";

const inspectQueue = async () => {
    try {
        const counts = await notificationQueue.getJobCounts(
            "waiting",
            "active",
            "delayed",
            "completed",
            "failed",
            "prioritized"
        );

        console.log("Notification Queue Status:");
        console.table(counts);
    } catch (error) {
        console.error("Inspection failed:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

inspectQueue();