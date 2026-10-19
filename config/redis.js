import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({
    url: env.redisUrl
});

redisClient.on("error", (error) => {
    console.error(
        "Redis Client Error:",
        error
    );
});


export const connectRedis = async () => {
    if (redisClient.isOpen) {
        return;
    }

    await redisClient.connect();

    console.log(
        "Redis connected successfully"
    );
};

export default redisClient;

