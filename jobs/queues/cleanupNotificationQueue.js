import notificationQueue from "./notificationQueue.js";

const cleanupQueue = async () => {
    try {
        const oneHour = 60 * 60 * 1000;

        const removeIds = await notificationQueue.clean(
            oneHour,
            100,
            "completed"
        );

        console.log(
            `Removed ${removeIds.length} old completed jobs`
        );

        console.log("Removed job IDs:", removedIds);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

cleanupQueue();

