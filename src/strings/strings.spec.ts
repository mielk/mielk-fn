import { describe, expect, it, test } from 'vitest';
import { capitalizeFirst, collapseWhitespace } from './strings.js';

describe('capitalizeFirst', () => {
  it('should capitalize first letter of a lowercase word', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('should not change already capitalized string', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('should not modify rest of the string', () => {
    expect(capitalizeFirst('hELLO')).toBe('HELLO');
  });

  it('should handle empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should handle single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  it('should handle strings starting with non-letter', () => {
    expect(capitalizeFirst('1hello')).toBe('1hello');
    expect(capitalizeFirst('!test')).toBe('!test');
  });

  it('should handle unicode characters', () => {
    expect(capitalizeFirst('żółw')).toBe('Żółw');
  });

  it('should capitalize first non-whitespace character', () => {
    expect(capitalizeFirst(' hello')).toBe(' Hello');
    expect(capitalizeFirst('   world')).toBe('   World');
  });

  it('should return string unchanged if it contains only whitespace', () => {
    expect(capitalizeFirst('   ')).toBe('   ');
  });

  it('should not modify non-letter first non-whitespace character', () => {
    expect(capitalizeFirst('   123abc')).toBe('   123abc');
    expect(capitalizeFirst('   !test')).toBe('   !test');
  });
});

describe('collapseWhitespace', () => {
  test('collapseWhitespace should remove leading and trailing spaces', () => {
    expect(collapseWhitespace('  Hello world  ')).toBe('Hello world');
  });

  test('collapseWhitespace should remove multiple spaces inside the string', () => {
    expect(collapseWhitespace('Hello    world')).toBe('Hello world');
  });

  test('collapseWhitespace should return the same string if no extra spaces', () => {
    expect(collapseWhitespace('Hello world')).toBe('Hello world');
  });

  test('collapseWhitespace should return empty string if input string contains only spaces', () => {
    expect(collapseWhitespace('     ')).toBe('');
  });

  test('collapseWhitespace should throw an error if input is not a string', () => {
    expect(() => {
      collapseWhitespace(123 as unknown as string);
    }).toThrow();
  });

  test('collapseWhitespace should handle string with only one word correctly', () => {
    expect(collapseWhitespace('    Hello    ')).toBe('Hello');
  });

  test('collapseWhitespace should handle empty string correctly', () => {
    expect(collapseWhitespace('')).toBe('');
  });
});
