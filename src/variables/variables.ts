/**
 * A JavaScript primitive value.
 *
 * @since 2.0.0
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Checks whether a value is a JavaScript primitive.
 *
 * @param value Value to check.
 * @param includeNullAndUndefined `true` (default): `null` and `undefined` count as primitives; `false`: they do not.
 * @returns `true` for strings, numbers, booleans, bigints and symbols, and for `null` and `undefined` when allowed.
 */
export function isPrimitive(value: unknown, includeNullAndUndefined?: true): value is Primitive;
export function isPrimitive(value: unknown, includeNullAndUndefined: false): value is NonNullable<Primitive>;
export function isPrimitive(value: unknown, includeNullAndUndefined?: boolean): boolean;
export function isPrimitive(value: unknown, includeNullAndUndefined = true): boolean {
    if (value === null || value === undefined) return includeNullAndUndefined;
    return typeof value !== 'object' && typeof value !== 'function';
}

/**
 * Checks whether a value is a non-empty array whose items are all primitives.
 *
 * @param value Value to check.
 * @param includeNullAndUndefined Whether `null` and `undefined` items count as primitives (default `true`).
 * @returns `true` for a non-empty array of primitives; `false` for an empty array and for other values.
 */
export const isArrayOfPrimitives = (value: unknown, includeNullAndUndefined = true): boolean => {
    if (!Array.isArray(value)) return false;
    return value.length > 0 && value.every((item) => isPrimitive(item, includeNullAndUndefined));
};

/**
 * Checks whether a value is an object other than an array (class instances included).
 *
 * @param value Value to check.
 * @returns `true` for non-null objects that are not arrays.
 */
export const isObject = (value: unknown): value is object =>
    typeof value === 'object' && !Array.isArray(value) && value !== null;

/**
 * Checks whether a value is a plain object: created by an object literal, `new Object()` or
 * `Object.create(null)`.
 *
 * @param value Value to check.
 * @returns `true` for plain objects; `false` for class instances, arrays, dates and other values.
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    const proto: unknown = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
        return false;
    }

    return Object.prototype.toString.call(value) === '[object Object]';
};

/**
 * Checks whether a value is a string or a number (`NaN` included).
 *
 * @param value Value to check.
 * @returns `true` for strings and numbers.
 */
export const isStringOrNumber = (value: unknown): value is string | number =>
    typeof value === 'string' || typeof value === 'number';
