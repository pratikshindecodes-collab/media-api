import notificationQueue from "./notificationQueue.js";

const setLimits = async () => {
    try {
        await notificationQueue.setGlobalConcurrency(3);

        const concurrency =
            await notificationQueue.getGlobalConcurrency();

        console.log(
            "Global concurrency limit:",
            concurrency
        );

        await notificationQueue.setGlobalConcurrency(5, 100);

        const rateLimit = 
            await notificationQueue.getGlobalRateLimit();

        console.log("Global rate limit:", rateLimit);
    } catch (error) {
        console.error("Could not set limits:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};


setLimits();