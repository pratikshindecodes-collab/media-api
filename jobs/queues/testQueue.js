import { Queue } from "bullmq";
import env from "../../config/env.js";

const testQueue = new Queue(
    "test-queue",
    {
        connection: {
            url: env.redisUrl
        }
    }
);

export default testQueue;

