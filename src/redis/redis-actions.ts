import type { SetOptions } from 'redis';
import { getRedisClient } from './redis-client.js';

/**
 * Deletes a key with the shared Redis client ({@link getRedisClient}).
 *
 * @param key The key to delete; a missing key is not an error.
 * @returns A promise that resolves when the key is deleted.
 * @throws Rejects with the error of {@link getRedisClient} when the client cannot be connected, and with the
 *   error of the `redis` client when the command fails.
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
 * @returns A promise that resolves when the value is stored.
 * @throws {TypeError} Rejects when `content` cannot be serialised by `JSON.stringify` (a circular reference or a
 *   `bigint` value); nothing is sent to Redis then.
 * @throws Rejects with the error of {@link getRedisClient} when the client cannot be connected, and with the
 *   error of the `redis` client when the command fails.
 */
export const addRedisKey = async (
  key: string,
  content: Record<string, unknown>,
  ttlSeconds?: number,
): Promise<void> => {
  // Serialised before connecting, so content that cannot be stored fails without touching the network.
  const value = JSON.stringify(content);
  const redisClient = await getRedisClient();
  const options: SetOptions = ttlSeconds ? createExpirationOptions(ttlSeconds) : {};
  await redisClient.set(key, value, options);
};

const createExpirationOptions = (ttlSeconds: number): SetOptions => ({
  expiration: {
    type: 'EX',
    value: ttlSeconds,
  },
});
