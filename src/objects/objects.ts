import { isObject, isPlainObject } from '../variables/variables.js';

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

  // Keyed by the string form of the value, as object keys are: 1 and '1' are the same key.
  const inverted = new Map<string, T>();
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Invalid value type: the value must be a string or a number.');
    }
    if (inverted.has(String(value))) {
      if (ignoreDuplicatedKey) continue;
      throw new Error(`Duplicated key in the result: the value '${value}' occurs more than once.`);
    }
    inverted.set(String(value), key);
  }

  // Built from entries, so a value such as '__proto__' becomes an own key and does not set the prototype.
  return Object.fromEntries(inverted) as Record<U, T>;
}

/**
 * Returns a copy of a plain object with each key replaced by the result of a callback.
 *
 * @param obj Plain object (object literal, `new Object()` or `Object.create(null)`).
 * @param callback Returns the new key for a key and its value.
 * @param ignoreDuplicates `true` (default): when several keys map to the same new key, the first one wins;
 *   `false`: the last one wins.
 * @returns New object with the new keys and the original values; keys are own properties, also `__proto__`.
 * @throws {TypeError} When `obj` is not a plain object.
 */
const modifyKeys = <V>(
  obj: Readonly<Record<string, V>>,
  callback: (key: string, value: V) => string | number,
  ignoreDuplicates = true,
): Record<string, V> => {
  if (!isPlainObject(obj)) throw new TypeError(`Invalid type of ${typeName(obj)}. Expected JavaScript object`);
  const result = new Map<string, V>();
  for (const [key, value] of Object.entries(obj)) {
    const newKey = String(callback(key, value));
    if (!result.has(newKey) || !ignoreDuplicates) {
      result.set(newKey, value);
    }
  }
  return Object.fromEntries(result);
};

/**
 * Checks whether a value is an object other than an array with at least one own enumerable key.
 *
 * @param value Value to check.
 * @returns `true` for a non-empty object.
 */
const isNonEmptyObject = (value: unknown): value is object => {
  if (!isObject(value)) return false;
  return Object.keys(value).length > 0;
};

/** Name of the value's type for error messages: the constructor name, or `null` / `undefined`. */
const typeName = (value: unknown): string => {
  if (value === null || value === undefined) return String(value);
  const boxed = Object(value) as object;
  return boxed.constructor.name;
};

export { invert, isNonEmptyObject, merge, modifyKeys };
