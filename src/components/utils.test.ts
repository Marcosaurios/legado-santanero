import { describe, expect, it } from 'vitest'
import { formatDuration, pickFromDistinctCategories } from './utils'

describe('Utils', () => {
	describe('formatDuration', () => {
		it('Should convert 120min to 2h', () => {
			const r = formatDuration(120)
			expect(r).equal('2h')
		})
		it('Should convert 130min to 2h 10min', () => {
			const r = formatDuration(130)
			expect(r).equal('2h 10min')
		})
		it('Should convert 30min to 30min', () => {
			const r = formatDuration(30)
			expect(r).equal('30min')
		})
		it('Should convert 600min to 10h', () => {
			const r = formatDuration(600)
			expect(r).equal('10h')
		})
	})

	describe('pickFromDistinctCategories', () => {
		const r = (category: string[]) => ({ category })
		const latest = r(['a'])
		const recipes = [r(['a']), r(['a', 'b']), r(['b']), r(['c']), r(['c']), latest]

		it('Should pick recipes that each stand for a different category', () => {
			for (let i = 0; i < 50; i++) {
				const picked = pickFromDistinctCategories(recipes, 3, [latest])
				expect(picked).toHaveLength(3)
				expect(new Set(picked).size).equal(3)
				expect(picked).not.toContain(latest)
			}
		})
		it('Should return fewer when there are not enough categories', () => {
			expect(pickFromDistinctCategories([r(['a']), r(['a'])], 3)).toHaveLength(1)
		})
	})
})
