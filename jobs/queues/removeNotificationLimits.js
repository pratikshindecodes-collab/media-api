import notificationQueue from "./notificationQueue.js";

const removeLimits = async () => {
    try {
        await notificationQueue.removeGlobalConcurrency();
        await notificationQueue.removeGlobalRateLimit();

        console.log("Global concurrency and rate limits removed.");
    } catch (error) {
        console.log("Could not remove limits:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

removeLimits();

