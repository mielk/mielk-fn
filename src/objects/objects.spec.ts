import { describe, expect, it } from 'vitest';
import { invert, isNonEmptyObject, merge, modifyKeys } from './objects.js';

describe('invert', () => {
  it('swaps keys and values', () => {
    const input = { key1: 'value1', key2: 'value2' };
    const result = invert(input);
    expect(result).toEqual({ value1: 'key1', value2: 'key2' });
  });

  it('swaps number keys and values', () => {
    const input = { 1: 2, 3: 4 };
    const result = invert(input);
    expect(result).toEqual({ 2: '1', 4: '3' });
  });

  it('swaps mixed string and number keys and values', () => {
    const input = { key1: 1, 2: 'value2' };
    const result = invert(input);
    expect(result).toEqual({ 1: 'key1', value2: '2' });
  });

  it('returns an empty object for an empty object', () => {
    const input = {};
    const result = invert(input);
    expect(result).toEqual({});
  });

  it('throws for a non-object input', () => {
    const input = 'string' as unknown as Record<string | number, string | number>;
    expect(() => invert(input)).toThrow('Invalid input: the input must be an object.');
  });

  it('throws for a value that cannot be a key', () => {
    const input = { key1: true } as unknown as Record<string | number, string | number>;
    expect(() => invert(input)).toThrow('Invalid value type: the value must be a string or a number.');
  });

  it('inverts object with string keys and number values', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = invert(obj);
    expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
  });

  it('inverts object with number keys and string values', () => {
    const obj = { '1': 'a', '2': 'b', '3': 'c' };
    const result = invert(obj);
    expect(result).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('inverts object with string keys and string values', () => {
    const obj = { a: '1', b: '2', c: '3' };
    const result = invert(obj);
    expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
  });

  it('inverts object with number keys and number values', () => {
    const obj = { '1': 2, '3': 4, '5': 6 };
    const result = invert(obj);
    expect(result).toEqual({ '2': '1', '4': '3', '6': '5' });
  });

  it('inverts object with unusual but valid keys or values', () => {
    const obj = { '': 1, a: 0, b: -1 };
    const result = invert(obj);
    expect(result).toEqual({ '1': '', '0': 'a', '-1': 'b' });
  });

  it('throws on a repeated value by default', () => {
    const obj = { a: 'x', b: 'y', c: 'x' };
    expect(() => invert(obj)).toThrow("Duplicated key in the result: the value 'x' occurs more than once.");
  });

  it('keeps the first key for a repeated value when ignoreDuplicatedKey is true', () => {
    const obj = { a: 1, b: 2, c: 1, d: 1 };
    expect(invert(obj, true)).toEqual({ '1': 'a', '2': 'b' });
  });

  it('treats a number and its string form as the same key', () => {
    const obj = { a: 1, b: '1' };
    expect(invert(obj, true)).toEqual({ '1': 'a' });
    expect(() => invert(obj, false)).toThrow("Duplicated key in the result: the value '1' occurs more than once.");
  });

  it('throws on a repeated value when ignoreDuplicatedKey is false', () => {
    const obj = { a: 'x', b: 'y', c: 'x' };
    expect(() => invert(obj, false)).toThrow("Duplicated key in the result: the value 'x' occurs more than once.");
  });

  it('does not throw without repeated values when ignoreDuplicatedKey is false', () => {
    const obj = { a: 'x', b: 'y' };
    expect(invert(obj, false)).toEqual({ x: 'a', y: 'b' });
  });

  it('does not treat inherited Object properties as existing keys', () => {
    const obj = { a: 'toString', b: 'constructor' };
    expect(invert(obj, false)).toEqual({ toString: 'a', constructor: 'b' });
  });

  it('writes a __proto__ value as an own key without changing the prototype', () => {
    const result = invert({ a: '__proto__' });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
  });
});

describe('isNonEmptyObject', () => {
  it('returns false for a number', () => {
    expect(isNonEmptyObject(1)).toBeFalsy();
  });

  it('returns false for a text', () => {
    expect(isNonEmptyObject('a')).toBeFalsy();
  });

  it('returns false for non-empty array', () => {
    expect(isNonEmptyObject([1, 2, 3])).toBeFalsy();
  });

  it('returns false for empty array', () => {
    expect(isNonEmptyObject([])).toBeFalsy();
  });

  it('returns false for multidimensional array', () => {
    expect(isNonEmptyObject([[], []])).toBeFalsy();
  });

  it('returns false for null', () => {
    expect(isNonEmptyObject(null)).toBeFalsy();
  });

  it('returns false for undefined', () => {
    expect(isNonEmptyObject(undefined)).toBeFalsy();
  });

  it('returns false for empty object', () => {
    expect(isNonEmptyObject({})).toBeFalsy();
  });

  it('returns true for non-empty object', () => {
    expect(isNonEmptyObject({ id: 1 })).toBeTruthy();
  });
});

describe('merge', () => {
  it('returns an empty object for an empty array', () => {
    const result = merge([]);
    expect(result).toEqual({});
  });

  it('ignores non-object items', () => {
    const input = ['string1', 42, true, null, [1]];
    const result = merge(input);
    expect(result).toEqual({});
  });

  it('merges the objects and ignores non-object items', () => {
    const obj1 = { key1: 'value1' };
    const obj2 = { key2: 'value2' };
    const input = [obj1, 'string1', 42, obj2, true] as unknown as Array<object>;
    const result = merge(input);
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('returns an empty object for empty objects', () => {
    const result = merge([{}, {}, {}]);
    expect(result).toEqual({});
  });

  it('merges objects without shared keys', () => {
    const result = merge([{ a: 1 }, { b: 2 }, { c: 3 }]);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('keeps the first value of a shared key when override is false', () => {
    const result = merge([{ a: 1 }, { a: 2 }, { a: 3 }], false);
    expect(result).toEqual({ a: 1 });
  });

  it('takes the last value of a shared key when override is true', () => {
    const result = merge([{ a: 1 }, { a: 2 }, { a: 3 }], true);
    expect(result).toEqual({ a: 3 });
  });

  it('writes __proto__ as an own key without changing the prototype', () => {
    const input = JSON.parse('{"__proto__": {"polluted": true}}') as unknown;
    const result = merge([input]);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result).not.toHaveProperty('polluted');
  });

  it.each([0, '', false, null])('keeps the first value %j when override is false', (first) => {
    const result = merge([{ a: first }, { a: 5 }]);
    expect(result).toEqual({ a: first });
  });
});

describe('modifyKeys', () => {
  type NumberStringFunction = (key: number | string) => number | string;

  it('modifies the keys of the object', () => {
    const input = { id: 1, name: 'John' };
    const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
    const result = modifyKeys(input, callback);
    expect(result).toEqual({ ID: 1, NAME: 'John' });
  });

  it('handles an empty object', () => {
    const input = {};
    const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
    const result = modifyKeys(input, callback);
    expect(result).toEqual({});
  });

  it('handles an object with non-string keys', () => {
    const input = { 1: 'one', 2: 'two', 3: 'three' };
    const callback: NumberStringFunction = (key) => key + '_new';
    const result = modifyKeys(input, callback);
    expect(result).toEqual({ '1_new': 'one', '2_new': 'two', '3_new': 'three' });
  });

  it('modifies the keys based on the callback function', () => {
    const input = { id: 1, name: 'John', age: 30 };
    const callback: NumberStringFunction = (key) => key + '_new';
    const result = modifyKeys(input, callback);
    expect(result).toEqual({ id_new: 1, name_new: 'John', age_new: 30 });
  });

  it('does not modify the original object', () => {
    const input = { id: 1, name: 'John' };
    const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
    const result = modifyKeys(input, callback);
    expect(result).toEqual({ ID: 1, NAME: 'John' });
    expect(input).toEqual({ id: 1, name: 'John' });
  });
  it('modifies the keys of an object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
    const result = modifyKeys(obj, callback);
    expect(result).toEqual({ A: 1, B: 2, C: 3 });
  });

  it('handles an empty object', () => {
    const obj = {};
    const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
    const result = modifyKeys(obj, callback);
    expect(result).toEqual({});
  });

  it('throws an error if the second argument is not a function', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const callback = 'not a function';
    expect(() => modifyKeys(obj, callback as unknown as NumberStringFunction)).toThrow(TypeError);
  });

  it('handles an object with duplicate modified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const callback: NumberStringFunction = () => 'new_key';
    const result = modifyKeys(obj, callback, true);
    expect(result).toEqual({ new_key: 1 });
  });

  it('handles an object with duplicate modified keys if ignoreDuplicates is false', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const callback: NumberStringFunction = () => 'new_key';
    const result = modifyKeys(obj, callback, false);
    expect(result).toEqual({ new_key: 3 });
  });

  it('throws an error in strict mode if given a non-object value', () => {
    'use strict';
    const callback: NumberStringFunction = () => 'new_key';
    const fn = () => {};
    // Simulates callers without type checking: the runtime check rejects non-plain objects.
    const modify = (value: unknown) => () => modifyKeys(value as Record<string, unknown>, callback);
    expect(modify(undefined)).toThrow(new TypeError('Invalid type of undefined. Expected JavaScript object'));
    expect(modify(123)).toThrow(new TypeError('Invalid type of Number. Expected JavaScript object'));
    expect(modify('string')).toThrow(new TypeError('Invalid type of String. Expected JavaScript object'));
    expect(modify(Symbol())).toThrow(new TypeError('Invalid type of Symbol. Expected JavaScript object'));
    expect(modify(true)).toThrow(new TypeError('Invalid type of Boolean. Expected JavaScript object'));
    expect(modify(fn)).toThrow(new TypeError('Invalid type of Function. Expected JavaScript object'));
    expect(modify([])).toThrow(new TypeError('Invalid type of Array. Expected JavaScript object'));
    expect(modify(new Date())).toThrow(new TypeError(`Invalid type of Date. Expected JavaScript object`));
    class MyClass {}
    expect(modify(new MyClass())).toThrow(new TypeError(`Invalid type of MyClass. Expected JavaScript object`));
  });

  it('writes a __proto__ key as an own key without changing the prototype', () => {
    const result = modifyKeys({ a: { polluted: true } }, () => '__proto__');
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result).not.toHaveProperty('polluted');
  });
  it('names null in the error message', () => {
    expect(() => modifyKeys(null as unknown as Record<string, unknown>, (key) => key)).toThrow(
      new TypeError('Invalid type of null. Expected JavaScript object'),
    );
  });
});
