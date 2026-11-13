export const isArrayOfPrimitives = (value: any, includeNullAndUndefined: boolean = true) => {
  if (!Array.isArray(value)) return false;
  return value.length > 0 && value.every((i) => isPrimitive(i, includeNullAndUndefined));
};

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    return false;
  }

  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isPrimitive = (
  value: any,
  includeNullAndUndefined: boolean = true,
): value is string | number | boolean | undefined | null => {
  return value !== Object(value) && !(!includeNullAndUndefined && (value === undefined || value === null));
};

export const isStringOrNumber = (value: any): value is string | number => ['string', 'number'].includes(typeof value);

export default { isArrayOfPrimitives, isObject, isPlainObject, isPrimitive, isStringOrNumber };
