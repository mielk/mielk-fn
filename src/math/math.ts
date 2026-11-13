/**
 * Formats a number with a fixed number of decimals and an explicit sign: `+` for positive values and the
 * minus sign `−` (U+2212) for negative ones. A value that rounds to zero is shown without a sign.
 *
 * @param value Number to format.
 * @param decimals Number of decimals (default 0).
 * @returns The formatted number, or `'NaN'` for `NaN`.
 */
export function formatWithSign(value: number, decimals = 0): string {
  if (isNaN(value)) return 'NaN';
  const rounded = value.toFixed(decimals);
  // A value that rounds to zero (e.g. 0.2 or -0.2 with no decimals) is shown without a sign.
  if (Number(rounded) === 0) return (0).toFixed(decimals);
  if (value > 0) return '+' + rounded;
  return '−' + rounded.substring(1);
}

/**
 * Formats a fraction as a percentage (`0.125` with one decimal gives `'12.5%'`). Negative values use the
 * minus sign `−` (U+2212).
 *
 * @param value Fraction to format (1 is 100%).
 * @param decimals Number of decimals (default 0).
 * @param plusPrefixForPositive Whether positive values get a `+` sign (default `false`).
 * @returns The formatted percentage.
 */
export function formatPercent(value: number, decimals = 0, plusPrefixForPositive = false): string {
  if (!plusPrefixForPositive && value > 0) return (value * 100).toFixed(decimals) + '%';
  return formatWithSign(value * 100, decimals) + '%';
}
