import testQueue from "./testQueue.js";

const  scheduleTestJob = async () => {

    await testQueue.upsertJobScheduler(
        "test-scheduler",
        {
            every: 10000
        },
        {
            name: "scheduled-test-job",

            data: {
                message: "Hello from schedule job"
            }
        }
    );

    console.log(
        "Scheduler created successfully"
    );

    await testQueue.close();
};

scheduleTestJob();

 