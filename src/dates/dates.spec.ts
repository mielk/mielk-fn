import { describe, expect, it } from 'vitest';
import { formatDateDefault } from './dates.js';

describe('formatDateDefault', () => {
  it('returns empty string for undefined', () => {
    expect(formatDateDefault(undefined)).toBe('');
  });

  it('returns string in format YYYY-MM-DD HH:mm:ss', () => {
    const date = new Date('2024-01-02T03:04:05Z');

    const result = formatDateDefault(date);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('always has 2-digit month, day, hour, minute, second', () => {
    const date = new Date('2024-04-05T06:07:08Z');

    const result = formatDateDefault(date);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('accepts custom timeZone parameter', () => {
    const date = new Date('2024-01-02T03:04:05Z');

    const result = formatDateDefault(date, 'UTC');

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('still returns a valid structure for different time zones', () => {
    const date = new Date('2024-06-15T10:20:30Z');

    const resultWarsaw = formatDateDefault(date, 'Europe/Warsaw');
    const resultUTC = formatDateDefault(date, 'UTC');

    expect(resultWarsaw).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(resultUTC).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    expect(resultWarsaw).not.toBe(resultUTC);
  });

  it('is deterministic', () => {
    const date = new Date('2024-06-15T10:20:30Z');

    expect(formatDateDefault(date)).toBe(formatDateDefault(date));
  });

  it('does not mutate input date', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const time = date.getTime();

    formatDateDefault(date);

    expect(date.getTime()).toBe(time);
  });
});
