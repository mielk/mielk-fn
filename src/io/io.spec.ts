import { parseJsonFile } from './io.js';

describe('parseJson', () => {
  it('should return default object when valid', () => {
    const input = {
      a: 12,
      default: { x: 1, y: 2 },
    };
    expect(parseJsonFile(input)).toEqual({ x: 1, y: 2 });
  });

  it('should return empty object when default is missing', () => {
    const input = { a: 12, b: 23 };
    expect(parseJsonFile(input)).toEqual({});
  });

  it('should return empty object when default is null', () => {
    const input = { default: null };
    expect(parseJsonFile(input)).toEqual({});
  });

  it('should return empty object when default is not an object', () => {
    expect(parseJsonFile({ default: 123 })).toEqual({});
    expect(parseJsonFile({ default: 'text' })).toEqual({});
    expect(parseJsonFile({ default: true })).toEqual({});
  });

  it('should return empty object when default is an array', () => {
    expect(parseJsonFile({ default: [] })).toEqual({});
  });

  it('should return empty object when input is null', () => {
    expect(parseJsonFile(null)).toEqual({});
  });

  it('should return empty object when input is undefined', () => {
    expect(parseJsonFile(undefined)).toEqual({});
  });

  it('should return empty object when input is primitive', () => {
    expect(parseJsonFile(123)).toEqual({});
    expect(parseJsonFile('text')).toEqual({});
    expect(parseJsonFile(true)).toEqual({});
  });

  it('should return empty object when input is array', () => {
    expect(parseJsonFile([])).toEqual({});
  });

  it('should return empty object when default is a special object (Date, Map, etc.)', () => {
    expect(parseJsonFile({ default: new Date() })).toEqual({});
    expect(parseJsonFile({ default: new Map() })).toEqual({});
  });

  it('should handle nested default object', () => {
    const input = {
      default: {
        nested: {
          value: 42,
        },
      },
    };

    expect(parseJsonFile(input)).toEqual({
      nested: {
        value: 42,
      },
    });
  });

  it('should not mutate input object', () => {
    const input = {
      default: { a: 1 },
    };

    const result = parseJsonFile(input);

    expect(result).toEqual({ a: 1 });
    expect(input.default).toEqual({ a: 1 });
  });
});