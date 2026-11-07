import type { MediaValue, PortableTextBlock } from 'emdash'

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
