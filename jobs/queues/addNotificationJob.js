import notificationQueue from "./notificationQueue.js";

const addNotificationJob = async () => {

    const jobs = [
        {
            name: "normal-notification",
            data: { message: "Normal notification" },
            priority: 10
        },
        {
            name: "urgent-notification",
            data: { message: "Urgent notification" },
            priority: 1
        },
        {
            name: "media-notification",
            data: { message: "Medium notification" },
            priority: 5
        }
    ];

    for (const item of jobs) {
        const job = await notificationQueue.add(
            item.name,
            item.data,
            {
                priority: item.priority
            }
        );

        console.log(
            `Added ${job.name}, priority ${item.priority}, ID ${job.id}`
        );
    }

    await notificationQueue.close();
};

addNotificationJob().catch((error) => {
    console.error("Could not add jobs:", error);
    process.exitCode = 1;
});

