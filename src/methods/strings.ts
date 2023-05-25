const clear = (value: string): string => {
	const regex = /(^\s+|(?<=\s)\s|\s+$)/gi;
	return value.replace(regex, '');
};

export default { clear };
