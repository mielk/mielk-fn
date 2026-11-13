import { describe, expect, it } from 'vitest';
import { getCapturedNumber } from './regex.js';

describe('getCapturedNumber', () => {
  it('returns the captured number when the pattern matches', () => {
    const pattern: string = 'value: (\\d+)';
    const input: string = 'Current value: 123;';
    const result = getCapturedNumber(input, pattern);
    expect(result).toBe(123);
  });

  it('returns undefined when the pattern does not match', () => {
    const pattern: string = 'value: (d+)';
    const input: string = 'Current value: 123;';
    const result = getCapturedNumber(input, pattern);
    expect(result).toBe(undefined);
  });

  it('returns undefined when the captured group is not a number', () => {
    expect(getCapturedNumber('Current value: abc;', 'value: ([a-z]+)')).toBeUndefined();
  });

  it('accepts a RegExp pattern', () => {
    expect(getCapturedNumber('Current value: 42;', /value: ([0-9]+)/)).toBe(42);
  });

  it('returns the first match for a RegExp with the g flag, also on repeated calls', () => {
    const pattern = /value: ([0-9]+)/g;
    expect(getCapturedNumber('value: 1, value: 2', pattern)).toBe(1);
    expect(getCapturedNumber('value: 1, value: 2', pattern)).toBe(1);
  });

  it('returns undefined when the group did not participate in the match', () => {
    expect(getCapturedNumber('value: x', /value: (?:([0-9]+)|x)/)).toBeUndefined();
  });
});
