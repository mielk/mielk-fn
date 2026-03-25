export const toMap = (
  items: any[],
  keyCallback: (item: any) => string | number,
  valueCallback: ((item: any) => any) = (item) => item,
  ignoreDuplicates = true
) => {
  const map = new Map();
  for (const item of items) {
    const key = keyCallback(item);
    const value = valueCallback ? valueCallback(item) : item;
    if (!map.has(key) || !ignoreDuplicates) {
      map.set(key, value);
    }
  }
  return map;
};

export const toIndexedArray = <T>(items: T[], callback: (item: T) => number): T[] => {
  const arr: any[] = [];
  for (const item of items) {
    const index = callback(item);
    if (typeof index !== 'number') {
      throw new TypeError('Callback should return a number.');
    }
    arr[index] = item;
  }
  return arr;
};

export default { toMap, toIndexedArray };
