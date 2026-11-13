import type { ObjectAny } from '../types/objects.js';
import { isObject, isPlainObject } from '../variables/variables.js';

type NumberStringFunction = (key: string, item: any) => number | string;

type InvertAllowedTypes = string | number;

const merge = (objects: ObjectAny[], override: boolean = false): ObjectAny => {
  const merged: ObjectAny = {};
  objects.forEach((obj) => {
    if (isObject(obj)) {
      const entries = Object.entries(obj);
      entries.forEach(([key, value]) => {
        if (!merged[key] || override) merged[key] = value;
      });
    }
  });
  return merged;
};

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
