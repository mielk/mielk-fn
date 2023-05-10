import objects from '../src/objects';

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

describe('merge', () => {
	const merge = objects.merge;
	test('Empty array', () => {
		const result = merge([]);
		expect(result).toEqual({});
	});

	it('Array with non-objects', () => {
		const input = ['string1', 42, true] as unknown as Array<object>;
		const result = merge(input);
		expect(result).toEqual({});
	});

	it('Array with objects and non-objects', () => {
		const obj1 = { key1: 'value1' };
		const obj2 = { key2: 'value2' };
		const input = [obj1, 'string1', 42, obj2, true] as unknown as Array<object>;
		const result = merge(input);
		expect(result).toEqual({ key1: 'value1', key2: 'value2' });
	});

	test('Array with empty objects', () => {
		const result = merge([{}, {}, {}]);
		expect(result).toEqual({});
	});

	test('Array with objects without duplicated properties', () => {
		const result = merge([{ a: 1 }, { b: 2 }, { c: 3 }]);
		expect(result).toEqual({ a: 1, b: 2, c: 3 });
	});

	test('Array with objects with duplicated properties and override=false', () => {
		const result = merge([{ a: 1 }, { a: 2 }, { a: 3 }], false);
		expect(result).toEqual({ a: 1 });
	});

	test('Array with objects with duplicated properties and override=true', () => {
		const result = merge([{ a: 1 }, { a: 2 }, { a: 3 }], true);
		expect(result).toEqual({ a: 3 });
	});
});

describe('invert', () => {
	const invert = objects.invert;
	it('Basic case', () => {
		const input = { key1: 'value1', key2: 'value2' };
		const result = invert(input);
		expect(result).toEqual({ value1: 'key1', value2: 'key2' });
	});

	it('Number keys and values', () => {
		const input = { 1: 2, 3: 4 };
		const result = invert(input);
		expect(result).toEqual({ 2: '1', 4: '3' });
	});

	it('Mixed keys and values', () => {
		const input = { key1: 1, 2: 'value2' };
		const result = invert(input);
		expect(result).toEqual({ 1: 'key1', value2: '2' });
	});

	it('Empty object', () => {
		const input = {};
		const result = invert(input);
		expect(result).toEqual({});
	});

	it('Non-object input', () => {
		const input = 'string' as unknown as Record<string | number, string | number>;
		expect(() => invert(input)).toThrowError('Invalid input: the input must be an object.');
	});

	it('Invalid value type', () => {
		const input = { key1: true } as unknown as Record<string | number, string | number>;
		expect(() => invert(input)).toThrowError(
			'Invalid value type: the value must be a string or a number.'
		);
	});
});

describe('modifyKeys function', () => {
	const { modifyKeys } = objects;
	type NumberStringFunction = (key: number | string) => number | string;
	describe('modifyKeys', () => {
		it('should modify the keys of the object', () => {
			const input = { id: 1, name: 'John' };
			const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
			const result = modifyKeys(input, callback);
			expect(result).toEqual({ ID: 1, NAME: 'John' });
		});

		it('should handle an empty object', () => {
			const input = {};
			const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
			const result = modifyKeys(input, callback);
			expect(result).toEqual({});
		});

		it('should handle an object with non-string keys', () => {
			const input = { 1: 'one', 2: 'two', 3: 'three' };
			const callback: NumberStringFunction = (key) => key + '_new';
			const result = modifyKeys(input, callback);
			expect(result).toEqual({ '1_new': 'one', '2_new': 'two', '3_new': 'three' });
		});

		it('should handle a custom class instance as the input', () => {
			class Person {
				constructor(public name: string, public age: number) {}
			}
			const input = new Person('John', 30);
			const callback: NumberStringFunction = (key) => key + '_new';
			const result = modifyKeys(input, callback);
			expect(result).toEqual({ name_new: 'John', age_new: 30 });
		});

		it('should modify the keys based on the callback function', () => {
			const input = { id: 1, name: 'John', age: 30 };
			const callback: NumberStringFunction = (key) => key + '_new';
			const result = modifyKeys(input, callback);
			expect(result).toEqual({ id_new: 1, name_new: 'John', age_new: 30 });
		});

		it('should not modify the original object', () => {
			const input = { id: 1, name: 'John' };
			const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
			const result = modifyKeys(input, callback);
			expect(result).toEqual({ ID: 1, NAME: 'John' });
			expect(input).toEqual({ id: 1, name: 'John' });
		});
		it('should modify the keys of an object', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
			const result = modifyKeys(obj, callback);
			expect(result).toEqual({ A: 1, B: 2, C: 3 });
		});

		it('should handle an empty object', () => {
			const obj = {};
			const callback: NumberStringFunction = (key) => ('' + key).toUpperCase();
			const result = modifyKeys(obj, callback);
			expect(result).toEqual({});
		});

		it('should throw an error if the second argument is not a function', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const callback = 'not a function';
			expect(() => modifyKeys(obj, callback as unknown as NumberStringFunction)).toThrow(TypeError);
		});

		it('should handle an object with duplicate modified keys', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const callback: NumberStringFunction = (key) => 'new_key';
			expect(() => modifyKeys(obj, callback)).toThrow(Error);
		});

		it('should handle an object with duplicate modified keys if ignoreDuplicates is false', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const callback: NumberStringFunction = (key) => 'new_key';
			const result = modifyKeys(obj, callback, false);
			expect(result).toEqual({ new_key: 3 });
		});
	});
});
