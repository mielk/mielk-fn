import arrays from './arrays.js';

const isObject = (value, includeArrays = false, includeNull = false) =>
	typeof value === 'object' &&
	(!Array.isArray(value) || includeArrays) &&
	(value !== null || includeNull);

const merge = (objects, override = false) => {
	const merged = {};
	objects.forEach((obj) => {
		const entries = Object.entries(obj);
		entries.forEach(([key, value]) => {
			if (!merged[key] || override) merged[key] = value;
		});
	});
	return merged;
};

const swapKeysWithValues = (obj) => {
	if (!isObject(obj)) return undefined;
	const entries = Object.entries(obj || {});
	const swapped = entries.map(([key, value]) => [value, key]);
	return Object.fromEntries(swapped);
};

export default { isObject, merge, swapKeysWithValues };
