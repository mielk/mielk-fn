export function formatWithSign(value: number, decimals = 0): string {
	const rounded = value.toFixed(decimals);
	if (isNaN(value)) return 'NaN';
	if (value === 0) return rounded;
	if (value > 0) return '+' + rounded;
	return '−' + rounded.substring(1);
}

export function formatPercent(value: number, decimals = 0, plusPrefixForPositive = false): string {
	if (!plusPrefixForPositive && value > 0) return (value * 100).toFixed(decimals) + '%';
	return formatWithSign(value * 100, decimals) + '%';
}
