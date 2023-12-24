import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

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
   },
   build: {
      emptyOutDir: isFinalBundle,
      target: 'es2015',
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
            writeFileSync(
               'dist/astro.js',
               'export { pushAstro as push } from "./index.js";\nexport { NotivueAstro as Notivue } from "./index.js";\n'.concat(
                  astroReExports.map((name) => `export { ${name} } from "./index.js";`).join('\n')
               )
            )
         },
      },
   ],
})

const astroReExports = [
   'lightTheme',
   'pastelTheme',
   'materialTheme',
   'darkTheme',
   'slateTheme',

   'filledIcons',
   'outlinedIcons',

   'DEFAULT_CONFIG',

   'useNotivueKeyboard',
   'useNotifications',
   'useNotivueConfig',
   'useNotivue',
   'usePush',

   'Notifications',
   'NotivueSwipe',
   'NotivueKeyboard',
]
