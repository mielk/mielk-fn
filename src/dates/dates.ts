const defaultTimeZone = 'Europe/Warsaw';
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string) {
	if (formatterCache.has(timeZone)) {
		return formatterCache.get(timeZone)!;
	}

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


export function formatDateDefault(date: Date | undefined, timeZone = defaultTimeZone): string {
	if (!date) return '';

	const formatter = getFormatter(timeZone);
	const parts = formatter.formatToParts(date);
	const map = Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<Intl.DateTimeFormatPartTypes, string>;
	return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}

export default { formatDateToDefault: formatDateDefault }