import { formatPercent, formatWithSign } from "./math";

describe('formatWithSign', () => {
  it('formats positive numbers with + sign', () => {
    expect(formatWithSign(1.234)).toBe('+1');
  });

  it('formats negative numbers with unicode minus', () => {
    expect(formatWithSign(-1.234)).toBe('−1');
  });

  it('returns plain zero without sign', () => {
    expect(formatWithSign(0)).toBe('0');
  });

  it('respects decimals', () => {
    expect(formatWithSign(1.234, 2)).toBe('+1.23');
    expect(formatWithSign(-1.234, 2)).toBe('−1.23');
  });

  it('rounds values correctly', () => {
    expect(formatWithSign(1.235, 2)).toBe('+1.24');
    expect(formatWithSign(-1.235, 2)).toBe('−1.24');
  });

  it('handles NaN', () => {
    expect(formatWithSign(NaN)).toBe('NaN');
  });

  it('handles Infinity', () => {
    expect(formatWithSign(Infinity)).toBe('+Infinity');
    expect(formatWithSign(-Infinity)).toBe('−Infinity');
  });

  it('handles very large numbers', () => {
    expect(formatWithSign(1e20)).toBe('+100000000000000000000');
  });

  it('handles very small numbers', () => {
    expect(formatWithSign(1e-10, 0)).toBe('0');
  });

  it('returns zero without sign when a positive value rounds to zero', () => {
    expect(formatWithSign(0.2)).toBe('0');
    expect(formatWithSign(0.004, 2)).toBe('0.00');
  });

  it('returns zero without sign when a negative value rounds to zero', () => {
    expect(formatWithSign(-0.2)).toBe('0');
    expect(formatWithSign(-0.004, 2)).toBe('0.00');
  });

  it('returns zero without sign for negative zero', () => {
    expect(formatWithSign(-0)).toBe('0');
    expect(formatWithSign(-0, 2)).toBe('0.00');
  });

  it('keeps the sign when the rounded value is not zero', () => {
    expect(formatWithSign(0.5)).toBe('+1');
    expect(formatWithSign(-0.006, 2)).toBe('−0.01');
  });
});

describe('formatPercent', () => {
  it('formats positive percentages without plus by default', () => {
    expect(formatPercent(0.1234)).toBe('12%');
  });

  it('formats positive percentages with plus when flag is true', () => {
    expect(formatPercent(0.1234, 2, true)).toBe('+12.34%');
  });

  it('formats negative percentages', () => {
    expect(formatPercent(-0.1234)).toBe('−12%');
  });

  it('formats negative percentages with decimals', () => {
    expect(formatPercent(-0.1234, 2)).toBe('−12.34%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0%');
  });

  it('handles zero with plus flag (still no sign)', () => {
    expect(formatPercent(0, 0, true)).toBe('0%');
  });

  it('handles zero with fraction and plus flag (still no sign)', () => {
    expect(formatPercent(0, 2, true)).toBe('0.00%');
  });

  it('returns zero without sign when a value rounds to zero', () => {
    expect(formatPercent(-0.001)).toBe('0%');
    expect(formatPercent(0.001, 0, true)).toBe('0%');
    expect(formatPercent(-0.00001, 2)).toBe('0.00%');
  });

  it('respects decimals', () => {
    expect(formatPercent(0.1234, 2)).toBe('12.34%');
  });

  it('multiplies by 100 correctly', () => {
    expect(formatPercent(1)).toBe('100%');
    expect(formatPercent(0.01)).toBe('1%');
  });

  it('rounds correctly', () => {
    expect(formatPercent(0.01479, 2)).toBe('1.48%');
  });

  it('handles NaN', () => {
    expect(formatPercent(NaN)).toBe('NaN%');
  });

  it('handles Infinity', () => {
    expect(formatPercent(Infinity)).toBe('Infinity%');
    expect(formatPercent(-Infinity)).toBe('−Infinity%');
  });
});