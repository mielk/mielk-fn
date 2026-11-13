import { describe, expect, it } from 'vitest';
import { capitalizeFirst, collapseWhitespace } from './strings.js';

describe('capitalizeFirst', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('does not change already capitalized string', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('does not modify rest of the string', () => {
    expect(capitalizeFirst('hELLO')).toBe('HELLO');
  });

  it('handles empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  it('handles strings starting with non-letter', () => {
    expect(capitalizeFirst('1hello')).toBe('1hello');
    expect(capitalizeFirst('!test')).toBe('!test');
  });

  it('handles unicode characters', () => {
    expect(capitalizeFirst('żółw')).toBe('Żółw');
  });

  it('capitalizes the first non-whitespace character', () => {
    expect(capitalizeFirst(' hello')).toBe(' Hello');
    expect(capitalizeFirst('   world')).toBe('   World');
  });

  it('returns string unchanged if it contains only whitespace', () => {
    expect(capitalizeFirst('   ')).toBe('   ');
  });

  it('does not modify non-letter first non-whitespace character', () => {
    expect(capitalizeFirst('   123abc')).toBe('   123abc');
    expect(capitalizeFirst('   !test')).toBe('   !test');
  });
});

describe('collapseWhitespace', () => {
  it('removes leading and trailing spaces', () => {
    expect(collapseWhitespace('  Hello world  ')).toBe('Hello world');
  });

  it('removes multiple spaces inside the string', () => {
    expect(collapseWhitespace('Hello    world')).toBe('Hello world');
  });

  it('returns the same string if no extra spaces', () => {
    expect(collapseWhitespace('Hello world')).toBe('Hello world');
  });

  it('returns empty string if input string contains only spaces', () => {
    expect(collapseWhitespace('     ')).toBe('');
  });

  it('throws an error if input is not a string', () => {
    expect(() => {
      // @ts-expect-error A number is not a string; simulates a caller without type checking.
      collapseWhitespace(123);
    }).toThrow();
  });

  it('handles string with only one word correctly', () => {
    expect(collapseWhitespace('    Hello    ')).toBe('Hello');
  });

  it('handles empty string correctly', () => {
    expect(collapseWhitespace('')).toBe('');
  });
});
