/** Flat object whose values are strings, numbers, booleans or `null` (e.g. a row of simple settings). */
export type ObjectPrimitives = { [key: string]: string | number | boolean | null };
/** Like `Partial<T>`, but every nested object property is optional as well, at any depth. */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
