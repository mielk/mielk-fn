// const toMap = (arr, keyFn, valueFn = (item) => item, skipUndefined = true, ignoreDuplicates = true) => {
// 	const map = new Map();
// 	if (arr && arr.length) {
// 		(skipUndefined ? arr.filter(Boolean) : arr).forEach((item) => {
// 			const key = keyFn(item);
// 			const value = valueFn ? valueFn(item) : item;
// 			if (ignoreDuplicates && map.has(key)) {
// 			} else {
// 				map.set(key, value);
// 			}
// 		});
// 	}
// 	return map;
// };

// const createIndexedArray = (items, indexCallback) => {
// 	const arr = [];
// 	items.forEach((item) => {
// 		const index = indexCallback(item);
// 		arr[index] = item;
// 	});
// 	return arr;
// };

// export default { toMap, createIndexedArray };
