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
   */
  onError?: (error: Error) => void;
};

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
  try {
    await client.connect();
    return client;
  } finally {
    connecting = null;
  }
};

/**
 * Returns the shared Redis client of the process, connecting it when it is not open.
 *
 * The first call creates the client from `config` (defaults: `127.0.0.1:6379`, no password).
 * Later calls may omit `config` or pass the same settings; parallel calls share one connection attempt,
 * and a client closed in the meantime is connected again.
 *
 * @param config Connection settings; used only by the call that creates the client.
 * @returns The connected client.
 * @throws Error when a later call passes settings different from those of the existing client.
 * @throws The error of `connect()` when the connection cannot be opened.
 */
export const getRedisClient = async (config?: RedisConfig): Promise<RedisClientType> => {
  const requested = resolveConfig(config);
  if (redisClient === null || activeConfig === null) {
    activeConfig = requested;
    redisClient = createRedisClient(requested);
  } else if (config !== undefined && !isSameConfig(activeConfig, requested)) {
    throw new Error(
      `The Redis client already exists with a different configuration (${activeConfig.host}:${String(activeConfig.port)}).`,
    );
  }

  if (redisClient.isOpen) return redisClient;
  connecting ??= connect(redisClient);
  return connecting;
};
