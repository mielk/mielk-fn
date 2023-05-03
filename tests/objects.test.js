import objects from '../../utils/objects';

describe('isObject', () => {
	it('returns true for non-empty object', () => {
		const obj = { value: 123 };
		expect(objects.isObject(obj)).toEqual(true);
	});

	it('returns true for empty object', () => {
		expect(objects.isObject({})).toEqual(true);
	});

	it('returns false for primitive value', () => {
		expect(objects.isObject('a')).toEqual(false);
	});

	it('returns false for array if default settings', () => {
		expect(objects.isObject([1, 2])).toEqual(false);
	});

	it('returns true for array  if includeArrays set to true', () => {
		expect(objects.isObject([1, 2], true)).toEqual(true);
	});

	it('returns false for null if default settings', () => {
		expect(objects.isObject(null)).toEqual(false);
	});

	it('returns for null true if includeArrays set to true', () => {
		expect(objects.isObject(null, false, true)).toEqual(true);
	});
});

describe('merge', () => {});

describe('swapKeysWithValues', () => {
	it('returns empty object for empty object ', () => {
		const obj = objects.swapKeysWithValues({});
		expect(obj).toEqual({});
	});

	it('returns undefined for non-object ', () => {
		const obj = objects.swapKeysWithValues([]);
		expect(obj).toEqual(undefined);
	});

	it('returns proper result for object with unique values', () => {
		const obj = { name: 'John', surname: 'Snow' };
		const after = objects.swapKeysWithValues(obj);
		const expected = { John: 'name', Snow: 'surname' };
		expect(after).toEqual(expected);
	});

	it('throws error for object with duplicated values', () => {
		expect(false).toEqual(true);
		// const obj = { name: 'John', surname: 'John' };
		// expect(objects.swapKeysWithValues(obj)).toEqual(expected);
	});

	it('returns object with overridden values if ignoreDuplicates set to true', () => {
		expect(false).toEqual(true);
	});
});

describe('appendItemsToParents', () => {});
