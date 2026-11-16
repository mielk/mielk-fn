import { createClient, type RedisClientType } from 'redis';

/** Connection settings of the shared Redis client. */
export type RedisConfig = {
    /** Server host; default `127.0.0.1`. */
    host?: string;
    /** Server port; default `6379`. */
    port?: number;
    /** Password (AUTH); omitted when the server does not require one. */
    password?: string;
    /**
     * Receives errors emitted by the client (e.g. a lost connection while it reconnects).
     * Without it these events are not reported; failed commands still reject their promises.
     *
     * @since 2.0.0
     */
    onError?: (error: Error) => void;
};

/**
 * Value of {@link RedisConfigConflictError.code}.
 *
 * @since 2.1.0
 */
export const REDIS_CONFIG_CONFLICT = 'REDIS_CONFIG_CONFLICT';

/**
 * Thrown by {@link getRedisClient} when a later call passes a configuration different from the one of the
 * existing client. Callers tell it from other errors by `instanceof` or by `code`, not by the message.
 *
 * @since 2.1.0
 */
export class RedisConfigConflictError extends Error {
    /** Always {@link REDIS_CONFIG_CONFLICT}. */
    readonly code = REDIS_CONFIG_CONFLICT;

    constructor(message: string) {
        super(message);
        this.name = 'RedisConfigConflictError';
    }
}

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 6379;

type ResolvedConfig = Required<Pick<RedisConfig, 'host' | 'port'>> & Pick<RedisConfig, 'password' | 'onError'>;

let activeConfig: ResolvedConfig | null = null;
let redisClient: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;

const resolveConfig = (config: RedisConfig = {}): ResolvedConfig => ({
    host: config.host ?? DEFAULT_HOST,
    port: config.port ?? DEFAULT_PORT,
    password: config.password,
    onError: config.onError,
});

const isSameConfig = (a: ResolvedConfig, b: ResolvedConfig): boolean =>
    a.host === b.host && a.port === b.port && a.password === b.password && a.onError === b.onError;

const createRedisClient = (config: ResolvedConfig): RedisClientType => {
    const { host, port, password, onError } = config;
    const client: RedisClientType = createClient({ socket: { host, port }, password });
    // An 'error' event without a listener would crash the process, so the listener is always registered.
    client.on('error', (error: Error) => onError?.(error));
    return client;
};

const connect = async (client: RedisClientType): Promise<RedisClientType> => {
    await client.connect();
    return client;
};

// Starts a connection attempt shared by parallel callers and clears it once it settles. The callbacks of
// then() always run after the assignment below; clearing it in a finally block inside connect() would run
// before it when client.connect() throws synchronously, and the failed attempt would stay in place.
// No second attempt can start while this one is pending, so the attempt being cleared is always this one.
const startConnecting = (client: RedisClientType): Promise<RedisClientType> => {
    const attempt = connect(client);
    connecting = attempt;
    const clear = (): void => {
        connecting = null;
    };
    attempt.then(clear, clear);
    return attempt;
};

/**
 * Returns the shared Redis client of the process, connecting it when it is not open.
 *
 * The first call creates the client from `config` (defaults: `127.0.0.1:6379`, no password).
 * Later calls may omit `config` or pass the same settings; parallel calls share one connection attempt and
 * all of them resolve or reject with it, and a client closed in the meantime is connected again.
 *
 * @param config Connection settings; used only by the call that creates the client.
 * @returns The connected client.
 * @throws {RedisConfigConflictError} (`code` `REDIS_CONFIG_CONFLICT`) when a later call passes settings different from those of the existing client.
 * @throws The error of `connect()` when the connection cannot be opened.
 */
export const getRedisClient = async (config?: RedisConfig): Promise<RedisClientType> => {
    const requested = resolveConfig(config);
    if (redisClient === null || activeConfig === null) {
        activeConfig = requested;
        redisClient = createRedisClient(requested);
    } else if (config !== undefined && !isSameConfig(activeConfig, requested)) {
        throw new RedisConfigConflictError(
            `The Redis client already exists with a different configuration (${activeConfig.host}:${String(activeConfig.port)}).`,
        );
    }

    // A pending attempt is checked first: redis sets isOpen to true at the start of connect(), before the socket
    // is ready and before authentication, so isOpen alone does not mean the connection succeeded.
    if (connecting !== null) return connecting;
    if (redisClient.isOpen) return redisClient;
    return startConnecting(redisClient);
};
