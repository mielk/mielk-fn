/** Numeric range from `min` to `max`; whether the bounds are included is decided by the code that uses it. */
export type Range = {
    /** Lower bound. */
    min: number;
    /** Upper bound. */
    max: number;
};
