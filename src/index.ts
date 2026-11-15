// Main entry point: every module that works in all environments, as flat named exports.
// The same functions are also available from the subpath of each module (e.g. '@mielk/fn/arrays').
// The 'redis' module depends on the redis client (Node.js only) and is available only from '@mielk/fn/redis'.
export * from './arrays/index.js';
export * from './dates/index.js';
export * from './io/index.js';
export * from './math/index.js';
export * from './objects/index.js';
export * from './regex/index.js';
export * from './strings/index.js';
export * from './types/index.js';
export * from './variables/index.js';
