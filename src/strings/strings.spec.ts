import { capitalizeFirst, clear } from './strings.js';

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

describe('clear', () => {
  test('clear should remove leading and trailing spaces', () => {
    expect(clear('  Hello world  ')).toBe('Hello world');
  });

  test('clear should remove multiple spaces inside the string', () => {
    expect(clear('Hello    world')).toBe('Hello world');
  });

  test('clear should return the same string if no extra spaces', () => {
    expect(clear('Hello world')).toBe('Hello world');
  });

  test('clear should return empty string if input string contains only spaces', () => {
    expect(clear('     ')).toBe('');
  });

  test('clear should throw an error if input is not a string', () => {
    expect(() => {
      clear(123 as unknown as string);
    }).toThrow();
  });

  test('clear should handle string with only one word correctly', () => {
    expect(clear('    Hello    ')).toBe('Hello');
  });

  test('clear should handle empty string correctly', () => {
    expect(clear('')).toBe('');
  });
});
