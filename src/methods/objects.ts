import { isObject, isPlainObject } from './variables';

type AnyObject = { [key: string]: any };
type NumberStringFunction = (key: string, item: any) => number | string;

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

const invert = (obj: Record<string | number, string | number>): Record<string | number, string | number> => {
	if (!isObject(obj)) {
		throw new Error('Invalid input: the input must be an object.');
	}

	const inverted: Record<string | number, string | number> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new Error('Invalid value type: the value must be a string or a number.');
		}

		inverted[value] = key;
	}

	return inverted;
};

const modifyKeys = (obj: AnyObject, callback: NumberStringFunction, ignoreDuplicates = true) => {
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

export default { merge, invert, modifyKeys };
