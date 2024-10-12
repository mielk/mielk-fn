import regex from '../src/methods/regex';

describe('getCapturedNumber', () => {
	const getCapturedNumber = regex.getCapturedNumber;
	it('If there is a match, correct number should be returned', () => {
		const pattern: string = 'value: (\\d+)';
		const input: string = 'Current value: 123;';
		const result = getCapturedNumber(input, pattern);
		expect(result).toBe(123);
	});

	it('If there is no match, undefined is returned', () => {
		const pattern: string = 'value: (d+)';
		const input: string = 'Current value: 123;';
		const result = getCapturedNumber(input, pattern);
		expect(result).toBe(undefined);
	});
});
