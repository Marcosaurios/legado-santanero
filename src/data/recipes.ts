import { getEmDashCollection, type EmDashCollections } from 'emdash'
import type { Recipe } from '../types'
import { LOCALES, type Locale } from '../i18n'

const segments: Record<Locale, { recipe: string; category: string }> = {
	es: { recipe: 'receta', category: 'categoria' },
	en: { recipe: 'recipe', category: 'category' }
}

export const recipeSegment = (locale: Locale) => segments[locale].recipe
export const categorySegment = (locale: Locale) => segments[locale].category
export const categoryUrl = (locale: Locale, name: string) =>
	`/${locale}/${categorySegment(locale)}/${encodeURIComponent(name)}`

/** Entry data as EmDash returns it (types generated in emdash-env.d.ts) */
export type RecipeEntry = EmDashCollections['recipes'] & { translationGroup?: string | null }

/** EmDash entry → Recipe */
export function toRecipe(d: RecipeEntry, locale: Locale): Recipe {
	const slug = d.slug ?? d.id
	return {
		title: d.title,
		slug,
		category: (d.category ?? []).map((c) => c.name),
		ingredients: (d.ingredients ?? []).map((i) => i.name),
		description: d.description ?? [],
		imageMain: d.image_main?.src,
		images: (d.images ?? []).flatMap((i) => (i.image?.src ? [i.image.src] : [])),
		minutes: d.minutes,
		difficulty: d.difficulty,
		createdAt: d.createdAt.toISOString(),
		updatedAt: d.updatedAt.toISOString(),
		url: `/${locale}/${recipeSegment(locale)}/${slug}`,
		translationGroup: d.translationGroup || d.id
	}
}

/** Published recipes of a locale, oldest first. */
export async function getRecipes(locale: Locale): Promise<Recipe[]> {
	const { entries, error } = await getEmDashCollection('recipes', {
		locale,
		status: 'published',
		orderBy: { created_at: 'asc' }
	})
	if (error) throw error
	return entries.map((e) => toRecipe(e.data, locale))
}

/** Recipes of every locale, needed to link a page to its translations. */
export const getAllRecipes = async () =>
	Object.fromEntries(
		await Promise.all(LOCALES.map(async (l) => [l, await getRecipes(l)] as const))
	) as Record<Locale, Recipe[]>

/** Unique category names in order of first appearance. */
export const getCategories = (recipes: Recipe[]): string[] => [
	...new Set(recipes.flatMap((r) => r.category))
]

/** Equivalent URL of the current page in every locale (landing as fallback). */
export const alternates = (urlFor: (l: Locale) => string | undefined) =>
	Object.fromEntries(LOCALES.map((l) => [l, urlFor(l) ?? `/${l}`])) as Record<Locale, string>

const translationOf = (all: Record<Locale, Recipe[]>, l: Locale, recipe?: Recipe) =>
	recipe && all[l].find((r) => r.translationGroup === recipe.translationGroup)

export const recipeAlternates = (all: Record<Locale, Recipe[]>, recipe: Recipe) =>
	alternates((l) => translationOf(all, l, recipe)?.url)

/** A category's translation: same position in the categories of a translated recipe. */
export function categoryAlternates(all: Record<Locale, Recipe[]>, locale: Locale, name: string) {
	const source = all[locale].find((r) => r.category.includes(name))
	const i = source?.category.indexOf(name) ?? -1
	return alternates((l) => {
		const translated = translationOf(all, l, source)?.category[i]
		return translated && categoryUrl(l, translated)
	})
}
