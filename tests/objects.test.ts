import objects from '../lib/objects';

describe('isObject', () => {
	const isObject = objects.isObject;
	test('returns true for non-empty object', () => {
		const obj = { value: 123 };
		expect(isObject(obj)).toEqual(true);
	});

	test('returns true for empty object', () => {
		expect(isObject({})).toEqual(true);
	});
	test('should return true for an object', () => {
		const obj = { key: 'value' };
		expect(isObject(obj)).toBe(true);
	});

	test('should return false for an array', () => {
		const arr = [1, 2, 3];
		expect(isObject(arr)).toBe(false);
	});

	test('should return false for null', () => {
		expect(isObject(null)).toBe(false);
	});

	test('should return false for undefined', () => {
		expect(isObject(undefined)).toBe(false);
	});

	test('should return false for a string', () => {
		expect(isObject('string')).toBe(false);
	});

	test('should return false for a number', () => {
		expect(isObject(42)).toBe(false);
	});

	test('should return false for a boolean', () => {
		expect(isObject(true)).toBe(false);
		expect(isObject(false)).toBe(false);
	});

	test('should return false for a function', () => {
		const func = () => {};
		expect(isObject(func)).toBe(false);
	});
});

// describe('merge', () => {});

// describe('swapKeysWithValues', () => {
// 	it('returns empty object for empty object ', () => {
// 		const obj = objects.swapKeysWithValues({});
// 		expect(obj).toEqual({});
// 	});

// 	it('returns undefined for non-object ', () => {
// 		const obj = objects.swapKeysWithValues([]);
// 		expect(obj).toEqual(undefined);
// 	});

// 	it('returns proper result for object with unique values', () => {
// 		const obj = { name: 'John', surname: 'Snow' };
// 		const after = objects.swapKeysWithValues(obj);
// 		const expected = { John: 'name', Snow: 'surname' };
// 		expect(after).toEqual(expected);
// 	});

// 	it('throws error for object with duplicated values', () => {
// 		expect(false).toEqual(true);
// 		// const obj = { name: 'John', surname: 'John' };
// 		// expect(objects.swapKeysWithValues(obj)).toEqual(expected);
// 	});

// 	it('returns object with overridden values if ignoreDuplicates set to true', () => {
// 		expect(false).toEqual(true);
// 	});
// });

// describe('appendItemsToParents', () => {});
