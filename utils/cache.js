import redisClient, {
    connectRedis
} from "../config/redis.js";

const ensureRedisConnection = async () => {
    if (!redisClient.isOpen) {
        await connectRedis();
    }
};

export const getCache = async (key) => {

    await ensureRedisConnection();

    const data =
        await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
};


export const setCache = async (
    key,
    data,
    ttl = 60
) => {

    await ensureRedisConnection();

    await redisClient.set(
        key,
        JSON.stringify(data),
        {
            EX: ttl
        }
    );
};


export const deleteCache = async (key) => {

    await ensureRedisConnection();

    await redisClient.del(key);
};