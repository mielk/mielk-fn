import type { ObjectAny } from '../types/objects.js';
import { isObject, isPlainObject } from '../variables/variables.js';

type NumberStringFunction = (key: string, item: any) => number | string;

type InvertAllowedTypes = string | number;

/**
 * Merges the own enumerable properties of several objects into a new object.
 *
 * Items that are not objects (primitives, arrays, `null`) are skipped. A key present in several objects is
 * resolved by `override`. Keys are written as own properties, so a key such as `__proto__` does not change
 * the prototype of the result.
 *
 * @param objects Objects to merge, in order.
 * @param override `false` (default): the first value of a key wins, also when it is `0`, `''`, `false` or
 *   `null`; `true`: the last value wins.
 * @returns New object with the merged properties.
 */
function merge(objects: readonly unknown[], override = false): Record<string, unknown> {
  const merged = new Map<string, unknown>();
  for (const obj of objects) {
    if (!isObject(obj)) continue;
    for (const [key, value] of Object.entries(obj)) {
      if (override || !merged.has(key)) merged.set(key, value);
    }
  }
  return Object.fromEntries(merged);
}

/**
 * Swaps keys and values of an object.
 *
 * Several keys with the same value would give the same key in the result. The entries are processed in the
 * iteration order of `for...in` (integer-like keys first, ascending, then the other keys in insertion order).
 *
 * @param obj Object whose values are strings or numbers.
 * @param ignoreDuplicatedKey `true`: keep the first entry for a repeated value and skip the next ones;
 *   `false` (default): throw an error on a repeated value.
 * @returns New object with the values of `obj` as keys and its keys as values.
 * @throws {Error} When `obj` is not an object, a value is neither a string nor a number, or a value repeats
 *   and `ignoreDuplicatedKey` is `false`.
 */
function invert<T extends InvertAllowedTypes, U extends InvertAllowedTypes>(
  obj: Record<T, U>,
  ignoreDuplicatedKey = false,
): Record<U, T> {
  if (!isObject(obj)) {
    throw new Error('Invalid input: the input must be an object.');
  }

  const inverted = {} as Record<U, T>;
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Invalid value type: the value must be a string or a number.');
    }
    if (Object.prototype.hasOwnProperty.call(inverted, value)) {
      if (ignoreDuplicatedKey) continue;
      throw new Error(`Duplicated key in the result: the value '${value}' occurs more than once.`);
    }
    inverted[value] = key;
  }

  return inverted;
}

const modifyKeys = (obj: ObjectAny, callback: NumberStringFunction, ignoreDuplicates = true): ObjectAny => {
  if (!isPlainObject(obj)) throw new TypeError(`Invalid type of ${obj?.constructor.name}. Expected JavaScript object`);
  const entries = Object.entries(obj || {});
  const result: ObjectAny = {};
  entries.forEach(([key, value]) => {
    const newKey: string | number = callback(key, value);
    if (!result.hasOwnProperty(newKey) || !ignoreDuplicates) {
      result[newKey] = value;
    }
  });
  return result;
};

const isNonEmptyObject = (value: any): value is object => {
  if (!isObject(value)) return false;
  return Object.keys(value).length > 0;
};

export { invert, isNonEmptyObject, merge, modifyKeys };

export default { invert, isNonEmptyObject, merge, modifyKeys };
