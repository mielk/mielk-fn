/**
 * Builds a `Map` from an array, with a key computed for each item.
 *
 * @param items Items to put in the map.
 * @param keyCallback Returns the key of an item.
 * @param valueCallback Returns the value stored for an item; without it the item itself is stored.
 * @param ignoreDuplicates `true` (default): the first item with a given key wins; `false`: the last one wins.
 * @returns Map from keys to values, in the order in which the keys first appear.
 */
export function toMap<T, K>(
    items: readonly T[],
    keyCallback: (item: T) => K,
    valueCallback?: undefined,
    ignoreDuplicates?: boolean,
): Map<K, T>;
export function toMap<T, K, V>(
    items: readonly T[],
    keyCallback: (item: T) => K,
    valueCallback: (item: T) => V,
    ignoreDuplicates?: boolean,
): Map<K, V>;
export function toMap<T, K, V>(
    items: readonly T[],
    keyCallback: (item: T) => K,
    valueCallback?: (item: T) => V,
    ignoreDuplicates = true,
): Map<K, T | V> {
    const map = new Map<K, T | V>();
    for (const item of items) {
        const key = keyCallback(item);
        if (!map.has(key) || !ignoreDuplicates) {
            map.set(key, valueCallback ? valueCallback(item) : item);
        }
    }
    return map;
}

/**
 * Places each item at the array index returned by the callback. Indexes that no item takes stay empty.
 *
 * @param items Items to place.
 * @param callback Returns the index of an item.
 * @returns Sparse array with the items at their indexes; a later item replaces an earlier one at the same index.
 * @throws {TypeError} When the callback returns a value that is not a number.
 */
export const toIndexedArray = <T>(items: readonly T[], callback: (item: T) => number): T[] => {
    const arr: T[] = [];
    for (const item of items) {
        const index: unknown = callback(item);
        if (typeof index !== 'number') {
            throw new TypeError('Callback should return a number.');
        }
        arr[index] = item;
    }
    return arr;
};
