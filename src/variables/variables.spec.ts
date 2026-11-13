import { describe, expect, it, test } from 'vitest';
import { isArrayOfPrimitives, isObject, isPlainObject, isPrimitive, isStringOrNumber } from './variables.js';

describe('isArrayOfPrimitives', () => {
  it('should return true for an array of numbers', () => {
    expect(isArrayOfPrimitives([1, 2, 3])).toBe(true);
  });

  it('should return false for an empty array', () => {
    expect(isArrayOfPrimitives([])).toBe(false);
  });

  it('should return true for an array of strings', () => {
    expect(isArrayOfPrimitives(['hello', 'world'])).toBe(true);
  });

  it('should return false for an array containing a non-primitive value', () => {
    expect(isArrayOfPrimitives([1, {}, 3])).toBe(false);
  });

  it('should return true for an array containing null and undefined values by default', () => {
    expect(isArrayOfPrimitives([1, null, undefined])).toBe(true);
  });

  it('should return false for an array containing null and undefined values if includeNullAndUndefined is set to false', () => {
    expect(isArrayOfPrimitives([1, null, undefined], false)).toBe(false);
  });

  it('should return true for an array containing boolean values', () => {
    expect(isArrayOfPrimitives([true, false])).toBe(true);
  });

  it('should return true for an array containing mixed primitive types', () => {
    expect(isArrayOfPrimitives([1, 'string', true, null, undefined])).toBe(true);
  });

  it('should return false for a non-array value', () => {
    expect(isArrayOfPrimitives('not an array')).toBe(false);
  });

  it('should return false for an array containing mixed types, with a non-primitive included', () => {
    expect(isArrayOfPrimitives([1, 'string', true, null, undefined, {}])).toBe(false);
  });
});

describe('isObject', () => {
  test('should return true for non-empty object', () => {
    const obj = { value: 123 };
    expect(isObject(obj)).toEqual(true);
  });

  test('should return true for empty object', () => {
    expect(isObject({})).toEqual(true);
  });
  test('should return true for an object', () => {
    expect(isObject({ key: 'value' })).toBe(true);
  });

  test('should return false for an array', () => {
    expect(isObject([1, 2, 3])).toBe(false);
  });

  test('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  test('should return false for a string', () => {
    expect(isObject('string')).toBe(false);
  });

  test('should return false for a number', () => {
    expect(isObject(42)).toBe(false);
  });

  test('should return false for a boolean', () => {
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
  });

  test('should return false for a function', () => {
    expect(isObject(() => {})).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('should return false for undefined', () => {
    expect(isPlainObject(undefined)).toBeFalsy();
  });

  it('should return false for null', () => {
    expect(isPlainObject(null)).toBeFalsy();
  });

  it('should return false for boolean', () => {
    expect(isPlainObject(true)).toBeFalsy();
    expect(isPlainObject(false)).toBeFalsy();
  });

  it('should return false for number', () => {
    expect(isPlainObject(0)).toBeFalsy();
    expect(isPlainObject(123)).toBeFalsy();
    expect(isPlainObject(NaN)).toBeFalsy();
  });

  it('should return false for string', () => {
    expect(isPlainObject('')).toBeFalsy();
    expect(isPlainObject('text')).toBeFalsy();
  });

  it('should return false for symbol', () => {
    expect(isPlainObject(Symbol())).toBeFalsy();
  });

  it('should return false for bigint', () => {
    expect(isPlainObject(BigInt(10))).toBeFalsy();
  });

  it('should return false for function', () => {
    expect(
      isPlainObject(() => {
        return undefined;
      }),
    ).toBeFalsy();
    expect(
      isPlainObject(function () {
        return undefined;
      }),
    ).toBeFalsy();
  });

  it('should return false for array', () => {
    expect(isPlainObject([])).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
  });

  it('should return false for Date', () => {
    expect(isPlainObject(new Date())).toBeFalsy();
  });

  it('should return false for RegExp', () => {
    expect(isPlainObject(/abc/)).toBeFalsy();
  });

  it('should return false for Map', () => {
    expect(isPlainObject(new Map())).toBeFalsy();
  });

  it('should return false for Set', () => {
    expect(isPlainObject(new Set())).toBeFalsy();
  });

  it('should return false for Error', () => {
    expect(isPlainObject(new Error('test'))).toBeFalsy();
  });

  it('should return false for class instance', () => {
    class Test {}
    expect(isPlainObject(new Test())).toBeFalsy();
  });

  it('should return false for object wrapper types', () => {
    expect(isPlainObject(new String('test'))).toBeFalsy();
    expect(isPlainObject(new Number(123))).toBeFalsy();
    expect(isPlainObject(new Boolean(true))).toBeFalsy();
  });

  it('should return false for Promise', () => {
    expect(isPlainObject(Promise.resolve())).toBeFalsy();
  });

  it('should return false for global objects', () => {
    expect(isPlainObject(Math)).toBeFalsy();
    expect(isPlainObject(JSON)).toBeFalsy();
  });

  it('should return true for empty object', () => {
    expect(isPlainObject({})).toBeTruthy();
  });

  it('should return true for non-empty object', () => {
    expect(isPlainObject({ a: 1 })).toBeTruthy();
  });

  it('should return true for object created with Object constructor', () => {
    expect(isPlainObject(new Object())).toBeTruthy();
  });

  it('should return true for object with null prototype', () => {
    expect(isPlainObject(Object.create(null))).toBeTruthy();
  });

  it('should return true for object of strings', () => {
    expect(isPlainObject({ a: 'a', b: 'b' })).toBeTruthy();
  });

  it('should return true for object of objects', () => {
    expect(isPlainObject({ a: new Object(), b: [] })).toBeTruthy();
  });
});

describe('isPrimitive', () => {
  test('should return true for string', () => {
    expect(isPrimitive('Hello')).toBe(true);
  });

  test('should return true for number', () => {
    expect(isPrimitive(123)).toBe(true);
  });

  test('should return true for boolean', () => {
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
  });

  test('should return true for null if includeNullAndUndefined is set to false', () => {
    expect(isPrimitive(null, true)).toBe(true);
  });

  test('should return true for undefined if includeNullAndUndefined is set to false', () => {
    expect(isPrimitive(undefined, true)).toBe(true);
  });

  test('should return false for null if includeNullAndUndefined is set to true', () => {
    expect(isPrimitive(null, false)).toBe(false);
  });

  test('should return false for undefined if includeNullAndUndefined is set to true', () => {
    expect(isPrimitive(undefined, false)).toBe(false);
  });

  test('should return true for symbol', () => {
    expect(isPrimitive(Symbol('symbol'))).toBe(true);
  });

  test('should return false for object', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive({ key: 'value' })).toBe(false);
  });

  test('should return false for array', () => {
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive([1, 2, 3])).toBe(false);
  });

  test('should return false for function', () => {
    expect(isPrimitive(() => {})).toBe(false);
  });
});

describe('isStringOrNumber', () => {
  test('returns false for non-empty object', () => {
    const obj = { value: 123 };
    expect(isStringOrNumber(obj)).toEqual(false);
  });

  test('returns false for empty object', () => {
    expect(isStringOrNumber({})).toEqual(false);
  });
  test('should return false for an object', () => {
    const obj = { key: 'value' };
    expect(isStringOrNumber(obj)).toBe(false);
  });

  test('should return false for an array', () => {
    const arr = [1, 2, 3];
    expect(isStringOrNumber(arr)).toBe(false);
  });

  test('should return false for null', () => {
    expect(isStringOrNumber(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isStringOrNumber(undefined)).toBe(false);
  });

  test('should return true for a non-empty string', () => {
    expect(isStringOrNumber('string')).toBe(true);
  });

  test('should return true for an empty string', () => {
    expect(isStringOrNumber('string')).toBe(true);
  });

  test('should return true for a positive number', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  test('should return true for a zero', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  test('should return true for a negative number', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  test('should return true for a float number', () => {
    expect(isStringOrNumber(42.5)).toBe(true);
  });

  test('should return false for a boolean', () => {
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber(false)).toBe(false);
  });

  test('should return false for a function', () => {
    const func = () => {};
    expect(isStringOrNumber(func)).toBe(false);
  });
});
