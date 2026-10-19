import testQueue from "./testQueue.js";

const removeScheduler = async () => {

    await testQueue.removeJobScheduler(
        "test-scheduler"
    );

    console.log(
        "Test scheduler removed"
    );

    await testQueue.close();
};

removeScheduler();

