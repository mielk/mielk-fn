import { createClient, RedisClientType } from 'redis';

export interface RedisConfig {
    host?: string;
    port?: string;
    password?: string;
}

const defaultHost: string = '127.0.0.1';
const defaultPort: string = '6379';

let redisClient: RedisClientType | null = null;
let connected = false;

const createRedisClient = (config?: RedisConfig): RedisClientType => {
    const { host, port } = config || {};
    const client: RedisClientType = createClient({
        url: `redis://${host || defaultHost}:${port || defaultPort}`,
    });
    client.on('error', (err) => console.error('Redis error:', err));
    console.log('Redis URL:', `redis://${host}:${port}`);
    return client;
}

export async function getRedisClient(config?: RedisConfig) {
    if (redisClient === null) {
        redisClient = createRedisClient(config);
    }

    if (!connected) {
        await redisClient.connect();
        connected = true;
    }

    return redisClient;
}