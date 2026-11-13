import { describe, expect, expectTypeOf, it } from 'vitest';
import { isArrayOfPrimitives, isObject, isPlainObject, isPrimitive, isStringOrNumber } from './variables.js';

describe('isArrayOfPrimitives', () => {
  it('returns true for an array of numbers', () => {
    expect(isArrayOfPrimitives([1, 2, 3])).toBe(true);
  });

  it('returns false for an empty array', () => {
    expect(isArrayOfPrimitives([])).toBe(false);
  });

  it('returns true for an array of strings', () => {
    expect(isArrayOfPrimitives(['hello', 'world'])).toBe(true);
  });

  it('returns false for an array containing a non-primitive value', () => {
    expect(isArrayOfPrimitives([1, {}, 3])).toBe(false);
  });

  it('returns true for an array containing null and undefined values by default', () => {
    expect(isArrayOfPrimitives([1, null, undefined])).toBe(true);
  });

  it('returns false for an array containing null and undefined values if includeNullAndUndefined is set to false', () => {
    expect(isArrayOfPrimitives([1, null, undefined], false)).toBe(false);
  });

  it('returns true for an array containing boolean values', () => {
    expect(isArrayOfPrimitives([true, false])).toBe(true);
  });

  it('returns true for an array containing mixed primitive types', () => {
    expect(isArrayOfPrimitives([1, 'string', true, null, undefined])).toBe(true);
  });

  it('returns false for a non-array value', () => {
    expect(isArrayOfPrimitives('not an array')).toBe(false);
  });

  it('returns false for an array containing mixed types, with a non-primitive included', () => {
    expect(isArrayOfPrimitives([1, 'string', true, null, undefined, {}])).toBe(false);
  });
});

describe('isObject', () => {
  it('returns true for non-empty object', () => {
    const obj = { value: 123 };
    expect(isObject(obj)).toEqual(true);
  });

  it('returns true for empty object', () => {
    expect(isObject({})).toEqual(true);
  });
  it('returns true for an object', () => {
    expect(isObject({ key: 'value' })).toBe(true);
  });

  it('returns false for an array', () => {
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isObject('string')).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isObject(42)).toBe(false);
  });

  it('returns false for a boolean', () => {
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
  });

  it('returns false for a function', () => {
    expect(isObject(() => {})).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('returns false for undefined', () => {
    expect(isPlainObject(undefined)).toBeFalsy();
  });

  it('returns false for null', () => {
    expect(isPlainObject(null)).toBeFalsy();
  });

  it('returns false for boolean', () => {
    expect(isPlainObject(true)).toBeFalsy();
    expect(isPlainObject(false)).toBeFalsy();
  });

  it('returns false for number', () => {
    expect(isPlainObject(0)).toBeFalsy();
    expect(isPlainObject(123)).toBeFalsy();
    expect(isPlainObject(NaN)).toBeFalsy();
  });

  it('returns false for string', () => {
    expect(isPlainObject('')).toBeFalsy();
    expect(isPlainObject('text')).toBeFalsy();
  });

  it('returns false for symbol', () => {
    expect(isPlainObject(Symbol())).toBeFalsy();
  });

  it('returns false for bigint', () => {
    expect(isPlainObject(BigInt(10))).toBeFalsy();
  });

  it('returns false for function', () => {
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

  it('returns false for array', () => {
    expect(isPlainObject([])).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
  });

  it('returns false for Date', () => {
    expect(isPlainObject(new Date())).toBeFalsy();
  });

  it('returns false for RegExp', () => {
    expect(isPlainObject(/abc/)).toBeFalsy();
  });

  it('returns false for Map', () => {
    expect(isPlainObject(new Map())).toBeFalsy();
  });

  it('returns false for Set', () => {
    expect(isPlainObject(new Set())).toBeFalsy();
  });

  it('returns false for Error', () => {
    expect(isPlainObject(new Error('test'))).toBeFalsy();
  });

  it('returns false for class instance', () => {
    class Test {}
    expect(isPlainObject(new Test())).toBeFalsy();
  });

  it('returns false for object wrapper types', () => {
    expect(isPlainObject(new String('test'))).toBeFalsy();
    expect(isPlainObject(new Number(123))).toBeFalsy();
    expect(isPlainObject(new Boolean(true))).toBeFalsy();
  });

  it('returns false for Promise', () => {
    expect(isPlainObject(Promise.resolve())).toBeFalsy();
  });

  it('returns false for global objects', () => {
    expect(isPlainObject(Math)).toBeFalsy();
    expect(isPlainObject(JSON)).toBeFalsy();
  });

  it('returns true for empty object', () => {
    expect(isPlainObject({})).toBeTruthy();
  });

  it('returns true for non-empty object', () => {
    expect(isPlainObject({ a: 1 })).toBeTruthy();
  });

  it('returns true for object created with Object constructor', () => {
    expect(isPlainObject(new Object())).toBeTruthy();
  });

  it('returns true for object with null prototype', () => {
    expect(isPlainObject(Object.create(null))).toBeTruthy();
  });

  it('returns true for object of strings', () => {
    expect(isPlainObject({ a: 'a', b: 'b' })).toBeTruthy();
  });

  it('returns true for object of objects', () => {
    expect(isPlainObject({ a: new Object(), b: [] })).toBeTruthy();
  });
});

describe('isPrimitive', () => {
  it('returns true for string', () => {
    expect(isPrimitive('Hello')).toBe(true);
  });

  it('returns true for number', () => {
    expect(isPrimitive(123)).toBe(true);
  });

  it('returns true for boolean', () => {
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
  });

  it('returns true for null if includeNullAndUndefined is set to false', () => {
    expect(isPrimitive(null, true)).toBe(true);
  });

  it('returns true for undefined if includeNullAndUndefined is set to false', () => {
    expect(isPrimitive(undefined, true)).toBe(true);
  });

  it('returns false for null if includeNullAndUndefined is set to true', () => {
    expect(isPrimitive(null, false)).toBe(false);
  });

  it('returns false for undefined if includeNullAndUndefined is set to true', () => {
    expect(isPrimitive(undefined, false)).toBe(false);
  });

  it('returns true for symbol', () => {
    expect(isPrimitive(Symbol('symbol'))).toBe(true);
  });

  it('returns false for object', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive({ key: 'value' })).toBe(false);
  });

  it('returns false for array', () => {
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive([1, 2, 3])).toBe(false);
  });

  it('returns false for function', () => {
    expect(isPrimitive(() => {})).toBe(false);
  });
});

describe('isPrimitive', () => {
  it('narrows to a type that includes symbol and bigint', () => {
    const value: unknown = Symbol('s');
    if (isPrimitive(value)) {
      expectTypeOf(value).toEqualTypeOf<string | number | boolean | bigint | symbol | null | undefined>();
    }
  });

  it('excludes null and undefined from the narrowed type when includeNullAndUndefined is false', () => {
    const value: unknown = 1n;
    if (isPrimitive(value, false)) {
      expectTypeOf(value).toEqualTypeOf<string | number | boolean | bigint | symbol>();
    }
  });
});

describe('isStringOrNumber', () => {
  it('returns false for non-empty object', () => {
    const obj = { value: 123 };
    expect(isStringOrNumber(obj)).toEqual(false);
  });

  it('returns false for empty object', () => {
    expect(isStringOrNumber({})).toEqual(false);
  });
  it('returns false for an object', () => {
    const obj = { key: 'value' };
    expect(isStringOrNumber(obj)).toBe(false);
  });

  it('returns false for an array', () => {
    const arr = [1, 2, 3];
    expect(isStringOrNumber(arr)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isStringOrNumber(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isStringOrNumber(undefined)).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(isStringOrNumber('string')).toBe(true);
  });

  it('returns true for an empty string', () => {
    expect(isStringOrNumber('string')).toBe(true);
  });

  it('returns true for a positive number', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  it('returns true for a zero', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  it('returns true for a negative number', () => {
    expect(isStringOrNumber(42)).toBe(true);
  });

  it('returns true for a float number', () => {
    expect(isStringOrNumber(42.5)).toBe(true);
  });

  it('returns false for a boolean', () => {
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber(false)).toBe(false);
  });

  it('returns false for a function', () => {
    const func = () => {};
    expect(isStringOrNumber(func)).toBe(false);
  });
});
