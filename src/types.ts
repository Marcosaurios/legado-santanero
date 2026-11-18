import type { MediaValue, PortableTextBlock } from 'emdash'

/** Static page (About…) from the EmDash `pages` collection, served at /:locale/:slug */
export type Page = {
	title: string
	slug: string
	body: PortableTextBlock[]
	url: string
	translationGroup: string
}

export type Recipe = {
	title: string
	slug: string
	category: string[]
	ingredients: string[]
	description: PortableTextBlock[]
	/** Raw EmDash media, render with `Image` from 'emdash/ui' (it resolves local/R2 URLs) */
	imageMain?: MediaValue
	images?: MediaValue[]
	minutes?: number
	difficulty?: number
	updatedAt: string
	createdAt: string
	// "virtual" props
	url: string
	/** Shared by every locale version of the same recipe (EmDash translation group) */
	translationGroup: string
}
