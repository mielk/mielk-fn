import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis error:', err));

let connected = false;

export async function getRedisClient() {
    if (!connected) {
        await redisClient.connect();
        connected = true;
    }
    return redisClient;
}