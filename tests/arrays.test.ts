import arrays from '../src/methods/arrays';

describe('toMap', () => {
	const { toMap } = arrays;
	const objects = [
		{ name: 'Adam', id: 1 },
		{ name: 'Bartek', id: 4 },
		{ name: 'Czesiek', id: 5 },
	];
	const primitives = ['Adam', 'Bartek', 'Czesiek'];

	it('should create a map from an array of objects', () => {
		const map = toMap(objects, (obj) => obj.id);
		expect(map.size).toBe(3);
		expect(map.get(1)).toEqual(objects[0]);
		expect(map.get(4)).toEqual(objects[1]);
		expect(map.get(5)).toEqual(objects[2]);
	});

	it('should create a map from an array of primitives', () => {
		const map = toMap(primitives, (str) => str.charAt(0));
		expect(map.size).toBe(3);
		expect(map.get('A')).toEqual(primitives[0]);
		expect(map.get('B')).toEqual(primitives[1]);
		expect(map.get('C')).toEqual(primitives[2]);
	});

	it('should allow custom value callback', () => {
		const map = toMap(
			objects,
			(obj) => obj.id,
			(obj) => obj.name
		);
		expect(map.size).toBe(3);
		expect(map.get(1)).toBe('Adam');
		expect(map.get(4)).toBe('Bartek');
		expect(map.get(5)).toBe('Czesiek');
	});

	it('should ignore duplicate keys by default', () => {
		const objectsWithDuplicate = [
			{ name: 'Adam', id: 1 },
			{ name: 'Bartek', id: 4 },
			{ name: 'Czesiek', id: 4 },
		];
		const map = toMap(objectsWithDuplicate, (obj) => obj.id);
		expect(map.size).toBe(2);
		expect(map.get(1)).toEqual(objectsWithDuplicate[0]);
		expect(map.get(4)).toEqual(objectsWithDuplicate[1]);
	});
});

describe('toIndexedArray', () => {
	const { toIndexedArray } = arrays;
	it('should return an indexed array with basic objects', () => {
		const items = [
			{ name: 'Adam', id: 1 },
			{ name: 'Bartek', id: 4 },
			{ name: 'Czesiek', id: 5 },
		];

		const callback = (item: any) => item.id;
		const result = toIndexedArray(items, callback);

		expect(result[1]).toEqual({ name: 'Adam', id: 1 });
		expect(result[4]).toEqual({ name: 'Bartek', id: 4 });
		expect(result[5]).toEqual({ name: 'Czesiek', id: 5 });
	});

	it('should handle custom class instances', () => {
		class Person {
			fullName: string;
			id: number;

			constructor(fullName: string, id: number) {
				this.fullName = fullName;
				this.id = id;
			}
		}

		const items = [new Person('Adam', 1), new Person('Bartek', 4), new Person('Czesiek', 5)];

		const callback = (item: unknown) => {
			if (typeof item === 'object' && item !== null && 'id' in item) {
				return (item as Person).id;
			}
			return -1;
		};
		const result = toIndexedArray(items, callback);

		expect(result[1]).toEqual(new Person('Adam', 1));
		expect(result[4]).toEqual(new Person('Bartek', 4));
		expect(result[5]).toEqual(new Person('Czesiek', 5));
	});

	it('should throw an error when the callback returns a non-number value', () => {
		const items = [
			{ name: 'Adam', id: '1' },
			{ name: 'Bartek', id: '4' },
			{ name: 'Czesiek', id: '5' },
		];

		const callback = (item: any) => item.id;
		expect(() => toIndexedArray(items, callback)).toThrow(new TypeError('Callback should return a number.'));
	});

	it('should handle an empty array', () => {
		const items: any[] = [];
		const callback = (item: any) => item.id;
		const result = toIndexedArray(items, callback);
		expect(result).toEqual([]);
	});
});
