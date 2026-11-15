import { getEmDashCollection, type EmDashCollections } from 'emdash'
import type { Page, Recipe } from '../types'
import { LOCALES, type Locale } from '../i18n'

const segments: Record<Locale, { recipe: string; category: string; about: string }> = {
	es: { recipe: 'receta', category: 'categoria', about: 'nosotros' },
	en: { recipe: 'recipe', category: 'category', about: 'about' }
}

export const recipeSegment = (locale: Locale) => segments[locale].recipe
export const categorySegment = (locale: Locale) => segments[locale].category
/** URL of the About page: the `pages` entry with this slug must exist in EmDash */
export const aboutUrl = (locale: Locale) => `/${locale}/${segments[locale].about}`
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
		imageMain: d.image_main,
		images: (d.images ?? []).flatMap((i) => i.image ?? []),
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

/** Published pages (About…) of a locale. */
export async function getPages(locale: Locale): Promise<Page[]> {
	const { entries, error } = await getEmDashCollection('pages', { locale, status: 'published' })
	if (error) throw error
	return entries.map(({ data: d }) => {
		const slug = d.slug ?? d.id
		const { translationGroup } = d as typeof d & { translationGroup?: string | null }
		return {
			title: d.title,
			slug,
			body: d.body ?? [],
			url: `/${locale}/${slug}`,
			translationGroup: translationGroup || d.id
		}
	})
}

/** Every locale's items, needed to link a page to its translations. */
const byLocale = async <T>(get: (l: Locale) => Promise<T[]>) =>
	Object.fromEntries(
		await Promise.all(LOCALES.map(async (l) => [l, await get(l)] as const))
	) as Record<Locale, T[]>

export const getAllRecipes = () => byLocale(getRecipes)
export const getAllPages = () => byLocale(getPages)

/** Unique category names in order of first appearance. */
export const getCategories = (recipes: Recipe[]): string[] => [
	...new Set(recipes.flatMap((r) => r.category))
]

/** Equivalent URL of the current page in every locale (landing as fallback). */
export const alternates = (urlFor: (l: Locale) => string | undefined) =>
	Object.fromEntries(LOCALES.map((l) => [l, urlFor(l) ?? `/${l}`])) as Record<Locale, string>

type Translatable = { url: string; translationGroup: string }

const translationOf = <T extends Translatable>(all: Record<Locale, T[]>, l: Locale, item?: T) =>
	item && all[l].find((r) => r.translationGroup === item.translationGroup)

/** Alternates of a recipe or page, through its EmDash translation group. */
export const translationAlternates = <T extends Translatable>(all: Record<Locale, T[]>, item: T) =>
	alternates((l) => translationOf(all, l, item)?.url)

/** A category's translation: same position in the categories of a translated recipe. */
export function categoryAlternates(all: Record<Locale, Recipe[]>, locale: Locale, name: string) {
	const source = all[locale].find((r) => r.category.includes(name))
	const i = source?.category.indexOf(name) ?? -1
	return alternates((l) => {
		const translated = translationOf(all, l, source)?.category[i]
		return translated && categoryUrl(l, translated)
	})
}
