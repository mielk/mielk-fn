/**
 * Changes the first non-whitespace character of a string to upper case.
 *
 * @param str Text to change.
 * @returns The text with its first non-whitespace character in upper case; leading whitespace is kept.
 */
export const capitalizeFirst = (str: string): string => {
  if (!str) return str;

  const index = str.search(/\S/);
  if (index === -1) return str;

  return str.slice(0, index) + str.charAt(index).toUpperCase() + str.slice(index + 1);
};

/**
 * Removes leading and trailing whitespace and collapses each run of whitespace inside the text to its first
 * character.
 *
 * @param value Text to change.
 * @returns The text without leading and trailing whitespace and without repeated whitespace.
 * @since 2.0.0 (replaces `clear`)
 */
export const collapseWhitespace = (value: string): string => {
  const regex = /(^\s+|(?<=\s)\s|\s+$)/g;
  return value.replace(regex, '');
};
