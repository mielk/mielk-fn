import strings from '../src/methods/strings';

describe('clear', () => {
	const { clear } = strings;
	test('clear should remove leading and trailing spaces', () => {
		expect(clear('  Hello world  ')).toBe('Hello world');
	});

	test('clear should remove multiple spaces inside the string', () => {
		expect(clear('Hello    world')).toBe('Hello world');
	});

	test('clear should return the same string if no extra spaces', () => {
		expect(clear('Hello world')).toBe('Hello world');
	});

	test('clear should return empty string if input string contains only spaces', () => {
		expect(clear('     ')).toBe('');
	});

	test('clear should throw an error if input is not a string', () => {
		expect(() => {
			clear(123 as unknown as string);
		}).toThrow();
	});

	test('clear should handle string with only one word correctly', () => {
		expect(clear('    Hello    ')).toBe('Hello');
	});

	test('clear should handle empty string correctly', () => {
		expect(clear('')).toBe('');
	});
});
