import { defineMiddleware } from 'astro:middleware'

// Required by `i18n.routing: 'manual'`; locale routing is done by src/pages/[...path].astro
export const onRequest = defineMiddleware((_context, next) => next())
