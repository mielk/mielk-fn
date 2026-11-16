// Module 'redis' (entry point '@mielk/fn/redis'). Shared Redis client of the process and key operations.
// Environment: Node.js only; requires the optional peer dependency redis.
import { getRedisClient, RedisConfigConflictError, REDIS_CONFIG_CONFLICT, type RedisConfig } from './redis-client.js';
import { addRedisKey, removeRedisKey } from './redis-actions.js';

export { getRedisClient, RedisConfigConflictError, REDIS_CONFIG_CONFLICT, type RedisConfig };
export { addRedisKey, removeRedisKey };
