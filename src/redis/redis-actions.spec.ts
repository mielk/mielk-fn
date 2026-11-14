import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addRedisKey, removeRedisKey } from './redis-actions.js';
import { getRedisClient } from './redis-client.js';

// The actions are tested against a fake client; the client module has its own tests (ts:TST-5).
const { fakeClient } = vi.hoisted(() => ({ fakeClient: { set: vi.fn(), del: vi.fn() } }));
vi.mock('./redis-client.js', () => ({ getRedisClient: vi.fn(() => Promise.resolve(fakeClient)) }));

beforeEach(() => {
    fakeClient.set.mockReset();
    fakeClient.del.mockReset();
    vi.mocked(getRedisClient).mockClear();
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

    it('rejects with a TypeError for content with a circular reference and does not connect', async () => {
        const content: Record<string, unknown> = {};
        content.self = content;
        await expect(addRedisKey('k', content)).rejects.toThrow(TypeError);
        expect(getRedisClient).not.toHaveBeenCalled();
        expect(fakeClient.set).not.toHaveBeenCalled();
    });

    it('rejects with a TypeError for content with a bigint value', async () => {
        await expect(addRedisKey('k', { count: 1n })).rejects.toThrow(TypeError);
        expect(fakeClient.set).not.toHaveBeenCalled();
    });

    it('rejects when the client cannot be connected', async () => {
        vi.mocked(getRedisClient).mockRejectedValueOnce(new Error('ECONNREFUSED'));
        await expect(addRedisKey('k', {})).rejects.toThrow('ECONNREFUSED');
    });
});

describe('removeRedisKey', () => {
    it('deletes the key', async () => {
        await removeRedisKey('user:1');
        expect(fakeClient.del).toHaveBeenCalledWith('user:1');
    });

    it('rejects when the client fails', async () => {
        fakeClient.del.mockRejectedValue(new Error('connection lost'));
        await expect(removeRedisKey('k')).rejects.toThrow('connection lost');
    });

    it('rejects when the client cannot be connected', async () => {
        vi.mocked(getRedisClient).mockRejectedValueOnce(new Error('ECONNREFUSED'));
        await expect(removeRedisKey('k')).rejects.toThrow('ECONNREFUSED');
    });
});
