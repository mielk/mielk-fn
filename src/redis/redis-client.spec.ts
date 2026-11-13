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
});
