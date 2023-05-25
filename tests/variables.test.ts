import variables from '../src/methods/variables';

describe('isArrayOfPrimitives', () => {
	const { isArrayOfPrimitives } = variables;

	it('should return true for an array of numbers', () => {
		expect(isArrayOfPrimitives([1, 2, 3])).toBe(true);
	});

	it('should return false for an empty array', () => {
		expect(isArrayOfPrimitives([])).toBe(false);
	});

	it('should return true for an array of strings', () => {
		expect(isArrayOfPrimitives(['hello', 'world'])).toBe(true);
	});

	it('should return false for an array containing a non-primitive value', () => {
		expect(isArrayOfPrimitives([1, {}, 3])).toBe(false);
	});

	it('should return true for an array containing null and undefined values by default', () => {
		expect(isArrayOfPrimitives([1, null, undefined])).toBe(true);
	});

	it('should return false for an array containing null and undefined values if includeNullAndUndefined is set to false', () => {
		expect(isArrayOfPrimitives([1, null, undefined], false)).toBe(false);
	});

	it('should return true for an array containing boolean values', () => {
		expect(isArrayOfPrimitives([true, false])).toBe(true);
	});

	it('should return true for an array containing mixed primitive types', () => {
		expect(isArrayOfPrimitives([1, 'string', true, null, undefined])).toBe(true);
	});

	it('should return false for a non-array value', () => {
		expect(isArrayOfPrimitives('not an array')).toBe(false);
	});

	it('should return false for an array containing mixed types, with a non-primitive included', () => {
		expect(isArrayOfPrimitives([1, 'string', true, null, undefined, {}])).toBe(false);
	});
});

describe('isObject', () => {
	const { isObject } = variables;
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

describe('isPlainObject', () => {
	const { isPlainObject } = variables;
	it('should return true for plain JavaScript objects', () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject({ key: 'value' })).toBe(true);
	});

	it('should return false for non-plain JavaScript objects', () => {
		expect(isPlainObject([])).toBe(false);
		expect(isPlainObject(new Date())).toBe(false);
		expect(isPlainObject(null)).toBe(false);
		expect(isPlainObject(undefined)).toBe(false);
		expect(isPlainObject(123)).toBe(false);
		expect(isPlainObject('string')).toBe(false);
		expect(isPlainObject(true)).toBe(false);
		expect(isPlainObject(() => {})).toBe(false);
		class CustomClass {}
		expect(isPlainObject(new CustomClass())).toBe(false);
	});
});

describe('isPrimitive', () => {
	const { isPrimitive } = variables;
	test('isPrimitive should return true for string', () => {
		expect(isPrimitive('Hello')).toBe(true);
	});

	test('isPrimitive should return true for number', () => {
		expect(isPrimitive(123)).toBe(true);
	});

	test('isPrimitive should return true for boolean', () => {
		expect(isPrimitive(true)).toBe(true);
		expect(isPrimitive(false)).toBe(true);
	});

	test('isPrimitive should return true for null if includeNullAndUndefined is set to false', () => {
		expect(isPrimitive(null, true)).toBe(true);
	});

	test('isPrimitive should return true for undefined if includeNullAndUndefined is set to false', () => {
		expect(isPrimitive(undefined, true)).toBe(true);
	});

	test('isPrimitive should return false for null if includeNullAndUndefined is set to true', () => {
		expect(isPrimitive(null, false)).toBe(false);
	});

	test('isPrimitive should return false for undefined if includeNullAndUndefined is set to true', () => {
		expect(isPrimitive(undefined, false)).toBe(false);
	});

	test('isPrimitive should return true for symbol', () => {
		expect(isPrimitive(Symbol('symbol'))).toBe(true);
	});

	test('isPrimitive should return false for object', () => {
		expect(isPrimitive({})).toBe(false);
		expect(isPrimitive({ key: 'value' })).toBe(false);
	});

	test('isPrimitive should return false for array', () => {
		expect(isPrimitive([])).toBe(false);
		expect(isPrimitive([1, 2, 3])).toBe(false);
	});

	test('isPrimitive should return false for function', () => {
		expect(isPrimitive(() => {})).toBe(false);
	});
});

describe('isStringOrNumber', () => {
	const { isStringOrNumber } = variables;
	test('returns false for non-empty object', () => {
		const obj = { value: 123 };
		expect(isStringOrNumber(obj)).toEqual(false);
	});

	test('returns false for empty object', () => {
		expect(isStringOrNumber({})).toEqual(false);
	});
	test('should return false for an object', () => {
		const obj = { key: 'value' };
		expect(isStringOrNumber(obj)).toBe(false);
	});

	test('should return false for an array', () => {
		const arr = [1, 2, 3];
		expect(isStringOrNumber(arr)).toBe(false);
	});

	test('should return false for null', () => {
		expect(isStringOrNumber(null)).toBe(false);
	});

	test('should return false for undefined', () => {
		expect(isStringOrNumber(undefined)).toBe(false);
	});

	test('should return true for a non-empty string', () => {
		expect(isStringOrNumber('string')).toBe(true);
	});

	test('should return true for an empty string', () => {
		expect(isStringOrNumber('string')).toBe(true);
	});

	test('should return true for a positive number', () => {
		expect(isStringOrNumber(42)).toBe(true);
	});

	test('should return true for a zero', () => {
		expect(isStringOrNumber(42)).toBe(true);
	});

	test('should return true for a negative number', () => {
		expect(isStringOrNumber(42)).toBe(true);
	});

	test('should return true for a float number', () => {
		expect(isStringOrNumber(42.5)).toBe(true);
	});

	test('should return false for a boolean', () => {
		expect(isStringOrNumber(true)).toBe(false);
		expect(isStringOrNumber(false)).toBe(false);
	});

	test('should return false for a function', () => {
		const func = () => {};
		expect(isStringOrNumber(func)).toBe(false);
	});
});
