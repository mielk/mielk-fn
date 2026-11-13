const DEFAULT_TIME_ZONE = 'Europe/Warsaw';
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone,
  });

  formatterCache.set(timeZone, formatter);
  return formatter;
}

/**
 * Formats a date as `YYYY-MM-DD HH:mm:ss` (24-hour clock) in a time zone.
 *
 * @param date Date to format; `undefined` gives an empty string. It must be a valid date.
 * @param timeZone IANA time zone name (default `Europe/Warsaw`).
 * @returns The formatted date, or `''` when `date` is `undefined`.
 * @throws {RangeError} When `timeZone` is not a valid time zone, or `date` is an invalid date
 *   (e.g. `new Date('invalid')`).
 */
export function formatDateDefault(date: Date | undefined, timeZone = DEFAULT_TIME_ZONE): string {
  if (!date) return '';

  const formatter = getFormatter(timeZone);
  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<Intl.DateTimeFormatPartTypes, string>;
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}
