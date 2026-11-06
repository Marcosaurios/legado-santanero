import esComponents from './locales/es/components.json'
import esTemplates from './locales/es/templates.json'
import enComponents from './locales/en/components.json'
import enTemplates from './locales/en/templates.json'

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

const dict = {
	es: { components: esComponents, templates: esTemplates },
	en: { components: enComponents, templates: enTemplates }
}

/** Dot-path lookup, e.g. t('es', 'components.navbar.title'). Falls back to the key. */
export function t(locale: Locale, key: string): string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const value = key.split('.').reduce<any>((o, k) => o?.[k], dict[locale])
	return typeof value === 'string' ? value : key
}
