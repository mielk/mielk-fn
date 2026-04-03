export type ObjectAny = { [key: string]: any };
export type ObjectPrimitives = { [key: string]: string | number | boolean | null };
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};