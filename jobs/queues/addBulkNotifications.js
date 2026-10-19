import notificationQueue from "./notificationQueue.js";

const addBulkNotifications = async () => {
    try {
        const jobs = [
            {
                name: "product-created",
                data: {
                    productId: "101",
                    productName: "Keyboard"
                },
                opts: {
                    jobId: "product-created-101",
                    priority:1
                }
            },
            {
                name: "product-created",
                data: {
                    productId: "102",
                    productName: "Mouse"
                },
                opts: {
                    jobId: "product-created-102",
                    priority: 5
                }
            },
            {
                name: "product-created",
                data: {
                    productId: "103",
                    productName: "Monitor"
                },
                opts: {
                    jobId: "product-created-103",
                    priority: 10
                }
            }
        ];

        const addedJobs = 
            await notificationQueue.addBulk(jobs);

        console.log("Bulk jobs added successfully:");

        for (const job of addedJobs) {
            console.log({
                id: job.id,
                name: job.name,
                data: job.data
            });
        }
    } catch (error) {
        console.error("Bulk insertion failed:", error);
        process.exitCode = 1;
    } finally {
        await notificationQueue.close();
    }
};


addBulkNotifications();

