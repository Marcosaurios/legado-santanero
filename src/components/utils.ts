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

/** Fisher–Yates shuffle (copy). */
function shuffle<T>(items: T[]): T[] {
	const a = [...items]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

/**
 * Up to `count` random recipes, each from a different category (its first match in a
 * shuffled category order) and never one of `exclude`.
 */
export function pickFromDistinctCategories<T extends { category: string[] }>(
	recipes: T[],
	count: number,
	exclude: T[] = []
): T[] {
	const picked: T[] = []
	const categories = shuffle([...new Set(recipes.flatMap((r) => r.category))])
	for (const category of categories) {
		if (picked.length === count) break
		const recipe = shuffle(recipes).find(
			(r) => r.category.includes(category) && !picked.includes(r) && !exclude.includes(r)
		)
		if (recipe) picked.push(recipe)
	}
	return picked
}
