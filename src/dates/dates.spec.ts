import { describe, expect, it } from 'vitest';
import { formatDateDefault } from './dates';

describe('formatDateDefault', () => {
  it('should return empty string for undefined', () => {
    expect(formatDateDefault(undefined)).toBe('');
  });

  it('should return string in format YYYY-MM-DD HH:mm:ss', () => {
    const date = new Date('2024-01-02T03:04:05Z');

    const result = formatDateDefault(date);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('should always have 2-digit month, day, hour, minute, second', () => {
    const date = new Date('2024-04-05T06:07:08Z');

    const result = formatDateDefault(date);

    const [datePart, timePart] = result.split(' ');

    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');

    expect(year.length).toBe(4);
    expect(month.length).toBe(2);
    expect(day.length).toBe(2);
    expect(hour.length).toBe(2);
    expect(minute.length).toBe(2);
    expect(second.length).toBe(2);
  });

  it('should accept custom timeZone parameter', () => {
    const date = new Date('2024-01-02T03:04:05Z');

    const result = formatDateDefault(date, 'UTC');

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('should still return valid structure for different time zones', () => {
    const date = new Date('2024-06-15T10:20:30Z');

    const resultWarsaw = formatDateDefault(date, 'Europe/Warsaw');
    const resultUTC = formatDateDefault(date, 'UTC');

    expect(resultWarsaw).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(resultUTC).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    expect(resultWarsaw).not.toBe(resultUTC);
  });

  it('should be deterministic', () => {
    const date = new Date('2024-06-15T10:20:30Z');

    expect(formatDateDefault(date)).toBe(formatDateDefault(date));
  });

  it('should not mutate input date', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const time = date.getTime();

    formatDateDefault(date);

    expect(date.getTime()).toBe(time);
  });
});
