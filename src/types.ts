import type { PortableTextBlock } from 'emdash'

export type Recipe = {
	title: string
	slug: string
	category: string[]
	ingredients: string[]
	description: PortableTextBlock[]
	imageMain?: string
	images?: string[]
	minutes?: number
	difficulty?: number
	updatedAt: string
	createdAt: string
	// "virtual" props
	url: string
	/** Shared by every locale version of the same recipe (EmDash translation group) */
	translationGroup: string
}
