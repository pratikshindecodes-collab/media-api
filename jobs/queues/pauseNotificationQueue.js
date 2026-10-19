import notificationQueue from "./notificationQueue.js";

const pauseQueue = async () => {
    try {
        await notificationQueue.pause();

        console.log("Notification queue paused.");

        const paused = await notificationQueue.isPaused();
        console.log("Is paused:", paused);
    } catch (error) {
        console.error("Could not pause queue:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

pauseQueue();

