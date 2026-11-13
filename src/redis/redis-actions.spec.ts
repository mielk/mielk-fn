import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addRedisKey, removeRedisKey } from './redis-actions.js';

// The actions are tested against a fake client; the client module has its own tests (ts:TST-5).
const { fakeClient } = vi.hoisted(() => ({ fakeClient: { set: vi.fn(), del: vi.fn() } }));
vi.mock('./redis-client.js', () => ({ getRedisClient: vi.fn(() => Promise.resolve(fakeClient)) }));

beforeEach(() => {
  fakeClient.set.mockReset();
  fakeClient.del.mockReset();
});

describe('addRedisKey', () => {
  it('stores the content as JSON without expiration', async () => {
    await addRedisKey('user:1', { name: 'Ann', age: 30 });
    expect(fakeClient.set).toHaveBeenCalledWith('user:1', '{"name":"Ann","age":30}', {});
  });

  it('sets the expiration in seconds when ttlSeconds is given', async () => {
    await addRedisKey('session', { id: 'x' }, 60);
    expect(fakeClient.set).toHaveBeenCalledWith('session', '{"id":"x"}', { expiration: { type: 'EX', value: 60 } });
  });

  it('does not set an expiration when ttlSeconds is 0', async () => {
    await addRedisKey('session', {}, 0);
    expect(fakeClient.set).toHaveBeenCalledWith('session', '{}', {});
  });

  it('rejects when the client fails', async () => {
    fakeClient.set.mockRejectedValue(new Error('connection lost'));
    await expect(addRedisKey('k', {})).rejects.toThrow('connection lost');
  });
});

describe('removeRedisKey', () => {
  it('deletes the key', async () => {
    await removeRedisKey('user:1');
    expect(fakeClient.del).toHaveBeenCalledWith('user:1');
  });
});
