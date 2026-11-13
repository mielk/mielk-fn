import type { SetOptions } from 'redis';
import { getRedisClient } from './redis-client.js';

/**
 * Deletes a key with the shared Redis client ({@link getRedisClient}).
 *
 * @param key The key to delete; a missing key is not an error.
 */
export const removeRedisKey = async (key: string): Promise<void> => {
  const redisClient = await getRedisClient();
  await redisClient.del(key);
};

/**
 * Stores an object as JSON under a key with the shared Redis client ({@link getRedisClient}),
 * replacing the previous value.
 *
 * @param key The key to write.
 * @param content The object to store; it is serialised with `JSON.stringify`.
 * @param ttlSeconds Time to live in seconds; when omitted or `0`, the key does not expire.
 */
export const addRedisKey = async (
  key: string,
  content: Record<string, unknown>,
  ttlSeconds?: number,
): Promise<void> => {
  const redisClient = await getRedisClient();
  const options: SetOptions = ttlSeconds ? createExpirationOptions(ttlSeconds) : {};
  await redisClient.set(key, JSON.stringify(content), options);
};

const createExpirationOptions = (ttlSeconds: number): SetOptions => ({
  expiration: {
    type: 'EX',
    value: ttlSeconds,
  },
});
