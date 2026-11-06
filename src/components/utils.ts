/**
 * Fn to format a duration in minutes to HH MM
 * @param minsDuration
 */
export function formatDuration(minsDuration: number): string {
	const h = Math.floor(minsDuration / 60)
	const m = minsDuration % 60

	const amounts = []
	if (h > 0) {
		amounts.push(`${h}h`)
	}
	if (m > 0) {
		amounts.push(`${m}min`)
	}
	return amounts.join(' ')
}
