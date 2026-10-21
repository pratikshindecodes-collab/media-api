import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({
    url: env.redisUrl
});

redisClient.on("error", (error) => {
    console.error(
        "Redis Client Error:",
        error.message
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

export const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        await redisClient.close();
        console.log("Redis diconnected successfully");
    }
};

export default redisClient;

