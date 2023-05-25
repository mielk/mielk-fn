type AnyObject = { [key: string]: any };
type NumberStringFunction = (key: string, item: any) => number | string;

const isObject = (value: unknown) => typeof value === 'object' && !Array.isArray(value) && value !== null;

const isPlainObject = (value: unknown) => value?.constructor.name === 'Object';

const isPrimitive = (value: any, includeNullAndUndefined: boolean = true) => {
	if (value !== Object(value)) {
		if (!includeNullAndUndefined && (value === undefined || value === null)) return false;
		return true;
	}
	return false;
};

const isArrayOfPrimitives = (value: any, includeNullAndUndefined: boolean = true) => {
	if (!Array.isArray(value)) return false;
	return value.length > 0 && value.every((i) => isPrimitive(i, includeNullAndUndefined));
};

const isStringOrNumber = (value: any): boolean => ['string', 'number'].includes(typeof value);

export { isArrayOfPrimitives, isObject, isPlainObject, isPrimitive, isStringOrNumber };

export default { isArrayOfPrimitives, isObject, isPlainObject, isPrimitive, isStringOrNumber };
