/**
 * Finds the first match of a pattern and returns its first capturing group as an integer.
 *
 * The group is parsed with `parseInt(group, 10)`, so leading digits are enough (`'12px'` gives `12`).
 *
 * @param input Text to search.
 * @param pattern Regular expression with at least one capturing group. Pass a `RegExp` built once when the
 *   function is called repeatedly; a string is compiled on every call. The `g` and `y` flags are ignored.
 * @returns The integer from the first group, or `undefined` when there is no match, the group is empty or
 *   did not participate, or it does not start with a number.
 * @throws {SyntaxError} When `pattern` is a string that is not a valid regular expression (e.g. `'('`).
 */
export const getCapturedNumber = (input: string, pattern: string | RegExp): number | undefined => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : withoutStatefulFlags(pattern);
    const group = regex.exec(input)?.[1];
    if (!group) return undefined;
    const num = parseInt(group, 10);
    return Number.isNaN(num) ? undefined : num;
};

/** Returns the expression without the `g` and `y` flags, which make `exec` depend on `lastIndex`. */
const withoutStatefulFlags = (regex: RegExp): RegExp =>
    regex.global || regex.sticky ? new RegExp(regex.source, regex.flags.replace(/[gy]/g, '')) : regex;
