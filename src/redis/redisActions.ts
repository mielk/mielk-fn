import { SetOptions } from "redis";
import { getRedisClient } from "./redisClient.js";

export const removeRedisKey = async (key: string) => {
    const redisClient = await getRedisClient();
    await redisClient.del(key);
}

export const addRedisKey = async (key: string, content: Record<string, unknown>, ttlSeconds?: number) => {
    const redisClient = await getRedisClient();
    const options: SetOptions = ttlSeconds ? createExpirationOptionObject(ttlSeconds) : {};
    await redisClient.set(
        key,
        JSON.stringify(content),
        options
    );
}

const createExpirationOptionObject = (ttlSeconds: number): SetOptions => {
    return {
        expiration: {
            type: 'EX',
            value: ttlSeconds
        }
    }
}