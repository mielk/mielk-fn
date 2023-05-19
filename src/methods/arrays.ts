type NumberFunction = (item: any) => number;
type StringNumberFunction = (item: any) => string | number;
type AnyFunction = (item: any) => any;

const toMap = (
	items: any[],
	keyCallback: StringNumberFunction,
	valueFn: AnyFunction = (item) => item,
	ignoreDuplicates = true
) => {
	const map = new Map();
	items.forEach((item) => {
		const key = keyCallback(item);
		const value = valueFn ? valueFn(item) : item;
		if (ignoreDuplicates && map.has(key)) {
		} else {
			map.set(key, value);
		}
	});
	return map;
};

const toIndexedArray = (items: any[], callback: NumberFunction): any[] => {
	const arr: any[] = [];
	items.forEach((item) => {
		// Check if item is an object and has a function named callback
		if (typeof item === 'object' && item !== null) {
			const index = callback(item);
			if (typeof index !== 'number') {
				throw new TypeError('Callback should return a number.');
			}
			arr[index] = item;
		}
	});
	return arr;
};

export { toMap, toIndexedArray };

export default { toMap, toIndexedArray };
