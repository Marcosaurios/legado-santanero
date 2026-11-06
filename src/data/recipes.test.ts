import { describe, expect, it, vi } from 'vitest'

vi.mock('emdash', () => ({ getEmDashCollection: vi.fn() }))
const { toRecipe, categoryAlternates } = await import('./recipes')

const entry = {
	id: '01ES',
	slug: 'arroz-con-leche',
	status: 'published',
	title: 'Arroz con leche',
	category: [{ name: 'postres' }, { name: 'dulces caseros' }],
	ingredients: [{ name: 'Leche' }, { name: 'Arroz' }],
	description: [],
	image_main: { id: 'm1', src: '/_emdash/api/media/file/m1' },
	images: [{ image: { id: 'm2', src: '/m2.jpg' } }, { image: null }],
	minutes: 70,
	createdAt: new Date('2024-03-05T10:00:00.000Z'),
	updatedAt: new Date('2024-03-06T10:00:00.000Z'),
	publishedAt: null,
	translationGroup: 'g1'
}

describe('toRecipe', () => {
	it('maps an EmDash entry to a Recipe', () => {
		expect(toRecipe(entry, 'es')).toMatchObject({
			slug: 'arroz-con-leche',
			url: '/es/receta/arroz-con-leche',
			category: ['postres', 'dulces caseros'],
			ingredients: ['Leche', 'Arroz'],
			imageMain: '/_emdash/api/media/file/m1',
			images: ['/m2.jpg'],
			createdAt: '2024-03-05T10:00:00.000Z',
			translationGroup: 'g1'
		})
	})

	it('links a category to the one in the same position of the translated recipe', () => {
		const en = toRecipe(
			{
				...entry,
				id: '01EN',
				slug: 'rice-pudding',
				category: [{ name: 'desserts' }, { name: 'homemade sweets' }]
			},
			'en'
		)
		const all = { es: [toRecipe(entry, 'es')], en: [en] }
		expect(categoryAlternates(all, 'es', 'dulces caseros')).toEqual({
			es: '/es/categoria/dulces%20caseros',
			en: '/en/category/homemade%20sweets'
		})
	})
})
