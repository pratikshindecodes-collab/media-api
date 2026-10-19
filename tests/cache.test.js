import {
    describe,
    it,
    expect,
    beforeAll
} from "vitest";

import {
    connectRedis
} from "../config/redis.js";

import {
    getCache,
    setCache,
    deleteCache
} from "../utils/cache.js";

describe("Redis Cache", () => {

    beforeAll(async () => {
        await connectRedis();
    });

    it("should set and get cached data", async () => {

        const key = "test:product";

        const product = {
            name: "Laptop",
            price: 80000
        };

        await setCache(
            key,
            product,
            60
        );

        const cachedProduct =
            await getCache(key);

        expect(cachedProduct).toEqual(
            product
        );

        await deleteCache(key);
    });

    it("should return null for missing cache", async () => {

        const result =
            await getCache(
                "test:missing"
            );

        expect(result).toBeNull();
    });
});