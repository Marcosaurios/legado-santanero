import { describe, expect, it } from 'vitest'
import { formatDuration } from './utils'

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
})
