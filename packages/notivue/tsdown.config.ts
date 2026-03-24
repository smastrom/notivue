import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'tsdown/config'

const require = createRequire(import.meta.url)
const { getFunctions, getObjects, getComponents } = require('./shared/exports.js') as {
   getFunctions: (o?: { omit?: string[] }) => string[]
   getObjects: (o?: { omit?: string[] }) => string[]
   getComponents: (o?: { omit?: string[] }) => string[]
}

const path = (url: string) => fileURLToPath(new URL(url, import.meta.url))

const isWatch = process.argv.includes('--watch')

export default defineConfig({
   entry: 'index.ts',
   platform: 'browser',
   target: 'es2015',
   minify: isWatch
      ? false
      : {
           compress: {
              dropConsole: true,
           },
        },
   // Watch must not wipe dist (e.g. monorepo dev:astro); production build still cleans via `pnpm build`.
   clean: !isWatch,
   outDir: 'dist',
   dts: { vue: true },
   deps: {
      neverBundle: ['vue'],
   },
   alias: {
      '@/core': path('./core'),
      '@/shared': path('./shared'),
      '@/Notivue': path('./Notivue'),
      '@/NotivueSwipe': path('./NotivueSwipe'),
      '@/NotivueKeyboard': path('./NotivueKeyboard'),
      '@/Notifications': path('./Notifications'),
      '@/astro': path('./astro'),
      notivue: path('./index.ts'),
   },
   plugins: [vue()],
   hooks: {
      'build:done'() {
         const astroReExports = [
            ...getFunctions({ omit: ['notify', 'push', 'createNotivue'] }),
            ...getComponents({ omit: ['Notivue'] }),
            ...getObjects(),
         ]
         writeFileSync(
            'dist/astro.js',
            [
               'export { notifyAstro as notify } from "./index.js";',
               'export { pushAstro as push } from "./index.js";',
               'export { NotivueAstro as Notivue } from "./index.js";',
               'export { createNotivueAstro as createNotivue } from "./index.js";',
               ...astroReExports.map((name) => `export { ${name} } from "./index.js";`),
            ].join('\n')
         )
      },
   },
})
