import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { d1, r2 } from '@emdash-cms/cloudflare'
import emdash from 'emdash/astro'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	// Pages render per request on Cloudflare Workers; EmDash (admin at /_emdash/admin) is part of the app
	output: 'server',
	adapter: cloudflare(),
	// Per-locale content in EmDash. Routing is 'manual' because our own [...path] route
	// handles the /es and /en prefixes (prefixDefaultLocale would break EmDash's admin)
	i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: 'manual' },
	integrations: [
		react(),
		emdash({
			database: d1({ binding: 'DB', session: 'auto', coalesce: true }),
			storage: r2({ binding: 'MEDIA' }),
			// siteUrl and allowedOrigins are tight to passkeys, keep these. In a hostname migration, it will be a different story
			...(!process.argv.includes('dev') && {
				siteUrl: 'https://legadosantanero.es',
				allowedOrigins: ['https://www.legadosantanero.es']
			})
		})
	],
	// Anything loaded at the root is Spanish
	redirects: { '/': '/es' },
	// 'class' keeps Svelte-like specificity so scoped styles beat the global `a:link` rules
	scopedStyleStrategy: 'class',
	devToolbar: { enabled: false },
	vite: { plugins: [Icons({ compiler: 'astro' })] }
})
