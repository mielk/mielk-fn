import { isPlainObject } from '../variables/variables.js';

export const parseJsonFile = (file: unknown): Record<string, unknown> => {
  if (file && typeof file === 'object' && 'default' in file) {
    const value = (file as Record<string, unknown>).default;
    return isPlainObject(value) ? value : {};
  }
  return {};
};
