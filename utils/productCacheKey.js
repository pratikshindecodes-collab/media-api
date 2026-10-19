import redisClient, {
    connectRedis
} from "../config/redis.js";

const PRODUCT_CACHE_VERSION_KEY =
    "products:list:version";

const ensureRedisConnection = async () => {

    if (!redisClient.isOpen) {
        await connectRedis();
    }
};


// Generate Product List Cache Key
export const getProductListCacheKey = async (
    query
) => {

    await ensureRedisConnection();

    let version =
        await redisClient.get(
            PRODUCT_CACHE_VERSION_KEY
        );

    if (!version) {
        version = "1";

        await redisClient.set(
            PRODUCT_CACHE_VERSION_KEY,
            version
        );
    }

    const normalizedQuery = {
        search: query.search || "",
        minPrice: query.minPrice || "",
        maxPrice: query.maxPrice || "",
        sort: query.sort || "",
        page: query.page || "1",
        limit: query.limit || "10"
    };

    return `products:list:v${version}:${JSON.stringify(
        normalizedQuery
    )}`;
};


// Invalidate Product List Cache
export const invalidateProductListCache =
    async () => {

        await ensureRedisConnection();

        await redisClient.incr(
            PRODUCT_CACHE_VERSION_KEY
        );

        console.log(
            "Product list cache invalidated"
        );
    };