import js from '@eslint/js'
import ts from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...astro.configs.recommended,
	prettier,
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	{ ignores: ['dist/', '.astro/', '.wrangler/', 'emdash-env.d.ts', 'worker-configuration.d.ts'] }
]
