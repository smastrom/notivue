import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// @ts-ignore
import { getFunctions, getObjects, getComponents } from './shared/exports'

const path = (url: string) => fileURLToPath(new URL(url, import.meta.url))

const isFinalBundle = !process.argv.includes('--watch')

export default defineConfig({
   resolve: {
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
   },
   esbuild: {
      drop: isFinalBundle ? ['console'] : [],
      ...(!isFinalBundle ? { minifyIdentifiers: false, minifySyntax: false } : {}),
   },
   build: {
      emptyOutDir: isFinalBundle,
      target: 'es2015',
      minify: isFinalBundle ? 'esbuild' : false,
      lib: {
         entry: 'index.ts',
         fileName: 'index',
         formats: ['es'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
   plugins: [
      dts({
         rollupTypes: true,
      }),
      vue(),
      {
         name: 'write-astro-entry',
         closeBundle() {
            const astroReExports = [
               ...getFunctions({ omit: ['push'] }),
               ...getComponents({ omit: ['Notivue'] }),
               ...getObjects(),
            ]

            writeFileSync(
               'dist/astro.js',
               [
                  'export { pushAstro as push } from "./index.js";',
                  'export { NotivueAstro as Notivue } from "./index.js";',
                  ...astroReExports.map((name) => `export { ${name} } from "./index.js";`),
               ].join('\n')
            )
         },
      },
   ],
})
