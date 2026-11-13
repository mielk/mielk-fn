import { isPlainObject } from '../variables/variables.js';

/**
 * Returns the content of a JSON module imported dynamically (`await import('./file.json', { with: { type: 'json' } })`).
 *
 * @param file The imported module namespace.
 * @returns The `default` export when it is a plain object; otherwise an empty object.
 */
export const parseJsonFile = (file: unknown): Record<string, unknown> => {
  if (file && typeof file === 'object' && 'default' in file) {
    const value = (file as Record<string, unknown>).default;
    return isPlainObject(value) ? value : {};
  }
  return {};
};
