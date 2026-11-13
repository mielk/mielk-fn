export function formatWithSign(value: number, decimals = 0): string {
  if (isNaN(value)) return 'NaN';
  const rounded = value.toFixed(decimals);
  // A value that rounds to zero (e.g. 0.2 or -0.2 with no decimals) is shown without a sign.
  if (Number(rounded) === 0) return (0).toFixed(decimals);
  if (value > 0) return '+' + rounded;
  return '−' + rounded.substring(1);
}

export function formatPercent(value: number, decimals = 0, plusPrefixForPositive = false): string {
  if (!plusPrefixForPositive && value > 0) return (value * 100).toFixed(decimals) + '%';
  return formatWithSign(value * 100, decimals) + '%';
}
