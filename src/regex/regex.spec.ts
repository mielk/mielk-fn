import { describe, expect, it } from 'vitest';
import { getCapturedNumber } from './regex.js';

describe('getCapturedNumber', () => {
  it('If there is a match, correct number should be returned', () => {
    const pattern: string = 'value: (\\d+)';
    const input: string = 'Current value: 123;';
    const result = getCapturedNumber(input, pattern);
    expect(result).toBe(123);
  });

  it('If there is no match, undefined is returned', () => {
    const pattern: string = 'value: (d+)';
    const input: string = 'Current value: 123;';
    const result = getCapturedNumber(input, pattern);
    expect(result).toBe(undefined);
  });
});
