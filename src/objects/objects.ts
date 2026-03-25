import type { AnyObject } from "../types/objects.js";
import { isObject, isPlainObject } from "../variables/variables.js";

type NumberStringFunction = (key: string, item: any) => number | string;

type InvertAllowedTypes = string | number;

const merge = (objects: AnyObject[], override: boolean = false): AnyObject => {
  const merged: AnyObject = {};
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

function invert<T extends InvertAllowedTypes, U extends InvertAllowedTypes>(obj: Record<T, U>): Record<U, T> {
  if (!isObject(obj)) {
    throw new Error('Invalid input: the input must be an object.');
  }

  const inverted = {} as Record<U, T>;
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Invalid value type: the value must be a string or a number.');
    }
    inverted[value] = key;
  }

  return inverted;
}

const modifyKeys = (obj: AnyObject, callback: NumberStringFunction, ignoreDuplicates = true): AnyObject => {
  if (!isPlainObject(obj)) throw new TypeError(`Invalid type of ${obj?.constructor.name}. Expected JavaScript object`);
  const entries = Object.entries(obj || {});
  const result: AnyObject = {};
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