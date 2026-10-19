import testQueue from "./testQueue.js";

const addTestJob = async () => {

    const job =
        await testQueue.add(
            "test-job",
            {
                message: 
                    "Hello from delayed job!"
              
            },
            {
                delay: 10000
            }
        );

    console.log(
        "Job added:",
        job.id
    );

    console.log(
        "Job will run after 10 seconds "
    );

    await testQueue.close();
};

addTestJob();

