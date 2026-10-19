import notificationQueue from "./notificationQueue.js";

const resumeQueue = async () => {
    try {
        await notificationQueue.resume();

        console.log("Notification queue resumed.");

        const paused = await notificationQueue.isPaused();
        console.log("Is paused:", paused);
    } catch (error) {
        console.error("Could not resume queue:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};

resumeQueue();

