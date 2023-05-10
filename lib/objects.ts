const isObject = (value: unknown) => typeof value === 'object' && !Array.isArray(value) && value !== null;

// const merge = (objects, override = false) => {
// 	const merged = {};
// 	objects.forEach((obj) => {
// 		const entries = Object.entries(obj);
// 		entries.forEach(([key, value]) => {
// 			if (!merged[key] || override) merged[key] = value;
// 		});
// 	});
// 	return merged;
// };

// // Key-value modifications
// const swapKeysWithValues = (obj) => {
// 	if (!isObject(obj)) return undefined;
// 	const entries = Object.entries(obj || {});
// 	const swapped = entries.map(([key, value]) => [value, key]);
// 	return Object.fromEntries(swapped);
// };

// const modifyKeys = (obj, fn) => {
// 	if (!isObject(obj)) return undefined;
// 	const entries = Object.entries(obj || {});
// 	const modified = entries.map(([key, value]) => [fn(key, value), value]);
// 	return Object.fromEntries(modified);
// };

// export default { isObject, merge, swapKeysWithValues, modifyKeys };

export default { isObject };
