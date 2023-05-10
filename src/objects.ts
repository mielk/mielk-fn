type AnyObject = { [key: string]: any };
type NumberStringFunction = (key: string, item: any) => number | string;

const isObject = (value: unknown) => typeof value === 'object' && !Array.isArray(value) && value !== null;

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

const invert = (
	obj: Record<string | number, string | number>
): Record<string | number, string | number> => {
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
	if (!isObject(obj)) return undefined;
	const entries = Object.entries(obj || {});
	const modified = entries.map(([key, value]) => [callback(key, value), value]);
	return Object.fromEntries(modified);
};

export default { isObject, merge, invert, modifyKeys };
