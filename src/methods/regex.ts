const getCapturedNumber = (input: string, pattern: string): number | undefined => {
	const match = input.match(pattern);
	console.log(match);
	if (match && match[1]) {
		console.log(match);
		const num: number = parseInt(match[1], 10);
		return num;
	}
	return undefined;
};

export default { getCapturedNumber };
