import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

// Unit tests use a fake redis client and never connect to a Redis server (ts:TST-5).
const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock('redis', () => ({ createClient }));

type FakeClient = {
    isOpen: boolean;
    connect: Mock<() => Promise<FakeClient>>;
    on: Mock;
};

const createFakeClient = (): FakeClient => {
    const client: FakeClient = { isOpen: false, connect: vi.fn(), on: vi.fn() };
    client.connect.mockImplementation(async () => {
        await Promise.resolve();
        client.isOpen = true;
        return client;
    });
    return client;
};

// The module keeps a single client in module state, so every test loads a fresh copy.
const loadModule = async () => {
    vi.resetModules();
    return import('./redis-client.js');
};

let fakeClient: FakeClient;

beforeEach(() => {
    createClient.mockReset();
    fakeClient = createFakeClient();
    createClient.mockReturnValue(fakeClient);
});

describe('getRedisClient', () => {
    it('creates the client with the default host and port', async () => {
        const { getRedisClient } = await loadModule();
        const client = await getRedisClient();
        expect(client).toBe(fakeClient);
        expect(createClient).toHaveBeenCalledWith({ socket: { host: '127.0.0.1', port: 6379 }, password: undefined });
        expect(fakeClient.connect).toHaveBeenCalledTimes(1);
    });

    it('creates the client with the given host and port', async () => {
        const { getRedisClient } = await loadModule();
        await getRedisClient({ host: 'redis.local', port: 6380 });
        expect(createClient).toHaveBeenCalledWith({ socket: { host: 'redis.local', port: 6380 }, password: undefined });
    });

    it('passes the password to the redis client', async () => {
        const { getRedisClient } = await loadModule();
        await getRedisClient({ password: 'secret' });
        expect(createClient).toHaveBeenCalledWith(expect.objectContaining({ password: 'secret' }));
    });

    it('returns the same client for a later call without configuration', async () => {
        const { getRedisClient } = await loadModule();
        const first = await getRedisClient({ host: 'redis.local' });
        const second = await getRedisClient();
        expect(second).toBe(first);
        expect(createClient).toHaveBeenCalledTimes(1);
    });

    it('returns the same client for a later call with the same configuration', async () => {
        const { getRedisClient } = await loadModule();
        const first = await getRedisClient({ host: 'redis.local', password: 'secret' });
        const second = await getRedisClient({ host: 'redis.local', password: 'secret' });
        expect(second).toBe(first);
    });

    it('throws when a later call passes a different configuration', async () => {
        const { getRedisClient } = await loadModule();
        await getRedisClient({ host: 'redis.local' });
        await expect(getRedisClient({ host: 'other.local' })).rejects.toThrow(/different configuration/);
    });

    it('throws when a later call passes a different error handler', async () => {
        const { getRedisClient } = await loadModule();
        await getRedisClient({ onError: vi.fn() });
        await expect(getRedisClient({ onError: vi.fn() })).rejects.toThrow(/different configuration/);
    });

    it('connects only once when called in parallel', async () => {
        const { getRedisClient } = await loadModule();
        const [first, second] = await Promise.all([getRedisClient(), getRedisClient()]);
        expect(second).toBe(first);
        expect(fakeClient.connect).toHaveBeenCalledTimes(1);
    });

    it('connects again after the connection was closed', async () => {
        const { getRedisClient } = await loadModule();
        await getRedisClient();
        fakeClient.isOpen = false;
        await getRedisClient();
        expect(fakeClient.connect).toHaveBeenCalledTimes(2);
    });

    // The real redis client sets isOpen to true synchronously at the start of connect(), before it settles.
    const connectSettledLater = () => {
        let settle: { resolve: () => void; reject: (error: Error) => void } | undefined;
        fakeClient.connect.mockImplementationOnce(() => {
            fakeClient.isOpen = true;
            return new Promise<FakeClient>((resolve, reject) => {
                settle = { resolve: () => resolve(fakeClient), reject };
            });
        });
        return {
            resolve: () => settle?.resolve(),
            reject: (error: Error) => {
                fakeClient.isOpen = false;
                settle?.reject(error);
            },
        };
    };

    it('resolves parallel calls only after the shared connection attempt succeeds', async () => {
        const { getRedisClient } = await loadModule();
        const connection = connectSettledLater();
        const settled: string[] = [];
        const first = getRedisClient().then(() => settled.push('first'));
        const second = getRedisClient().then(() => settled.push('second'));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(settled).toEqual([]);
        connection.resolve();
        await Promise.all([first, second]);
        expect(settled).toEqual(['first', 'second']);
        expect(fakeClient.connect).toHaveBeenCalledTimes(1);
    });

    it('rejects parallel calls when the shared connection attempt fails', async () => {
        const { getRedisClient } = await loadModule();
        const connection = connectSettledLater();
        const first = getRedisClient();
        const second = getRedisClient();
        connection.reject(new Error('AUTH failed'));
        await expect(first).rejects.toThrow('AUTH failed');
        await expect(second).rejects.toThrow('AUTH failed');
        expect(fakeClient.connect).toHaveBeenCalledTimes(1);
    });

    it('clears the attempt when connect throws synchronously and connects again on the next call', async () => {
        const { getRedisClient } = await loadModule();
        fakeClient.connect.mockImplementationOnce(() => {
            throw new Error('Socket already opened');
        });
        await expect(getRedisClient()).rejects.toThrow('Socket already opened');
        await expect(getRedisClient()).resolves.toBe(fakeClient);
        expect(fakeClient.connect).toHaveBeenCalledTimes(2);
    });

    it('rejects when the connection fails and connects again on the next call', async () => {
        const { getRedisClient } = await loadModule();
        fakeClient.connect.mockRejectedValueOnce(new Error('ECONNREFUSED'));
        await expect(getRedisClient()).rejects.toThrow('ECONNREFUSED');
        await expect(getRedisClient()).resolves.toBe(fakeClient);
        expect(fakeClient.connect).toHaveBeenCalledTimes(2);
    });
});

describe('getRedisClient error events', () => {
    const emitError = (error: Error) => {
        const listener = fakeClient.on.mock.calls.find(([event]) => event === 'error')?.[1] as (error: Error) => void;
        listener(error);
    };

    it('passes client errors to onError', async () => {
        const { getRedisClient } = await loadModule();
        const onError = vi.fn();
        await getRedisClient({ onError });
        const error = new Error('socket closed');
        emitError(error);
        expect(onError).toHaveBeenCalledWith(error);
    });

    it('handles client errors without onError and without writing to the console', async () => {
        const { getRedisClient } = await loadModule();
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        await getRedisClient();
        expect(() => emitError(new Error('socket closed'))).not.toThrow();
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleLog).not.toHaveBeenCalled();
        consoleError.mockRestore();
        consoleLog.mockRestore();
    });
});
